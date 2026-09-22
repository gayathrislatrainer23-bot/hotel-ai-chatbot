import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ENV } from "../config/env.js";
import { checkRoomAvailability, createBooking } from "./booking.service.js";

const model = new ChatGoogleGenerativeAI({
  apiKey: ENV.GEMINI_API_KEY,
  model: "gemini-3.6-flash",
});

// Wrap Tool 1 for the AI
const checkAvailabilityTool = tool(
  async ({ roomType, checkInDate, checkOutDate }) => {
    const result = await checkRoomAvailability({ roomType, checkInDate, checkOutDate });
    return JSON.stringify(result);
  },
  {
    name: "check_room_availability",
    description: "Check if a room type is available for given check-in and check-out dates.",
    schema: z.object({
      roomType: z.string().describe("Room type: Standard, Deluxe, Sea View, or Suite"),
      checkInDate: z.string().describe("Check-in date in YYYY-MM-DD format"),
      checkOutDate: z.string().describe("Check-out date in YYYY-MM-DD format"),
    }),
  }
);

// Wrap Tool 2 for the AI
const createBookingTool = tool(
  async ({ guestName, roomType, checkInDate, checkOutDate, guests }) => {
    const result = await createBooking({ guestName, roomType, checkInDate, checkOutDate, guests });
    return JSON.stringify(result);
  },
  {
    name: "create_booking",
    description: "Book a room for a guest after confirming availability.",
    schema: z.object({
      guestName: z.string().describe("Name of the guest"),
      roomType: z.string().describe("Room type: Standard, Deluxe, Sea View, or Suite"),
      checkInDate: z.string().describe("Check-in date in YYYY-MM-DD format"),
      checkOutDate: z.string().describe("Check-out date in YYYY-MM-DD format"),
      guests: z.number().describe("Number of guests"),
    }),
  }
);

const modelWithTools = model.bindTools([checkAvailabilityTool, createBookingTool]);

export async function getAgentResponse(userMessage) {
  const response = await modelWithTools.invoke(userMessage);

  // If the AI decided to call a tool
  if (response.tool_calls && response.tool_calls.length > 0) {
    const toolCall = response.tool_calls[0];
    let toolResult;

    if (toolCall.name === "check_room_availability") {
      toolResult = await checkAvailabilityTool.invoke(toolCall.args);
    } else if (toolCall.name === "create_booking") {
      toolResult = await createBookingTool.invoke(toolCall.args);
    }

    // Send the tool's result back to the AI to generate a natural reply
    const finalResponse = await model.invoke([
      { role: "user", content: userMessage },
      { role: "assistant", content: "", tool_calls: response.tool_calls },
      { role: "tool", content: toolResult, tool_call_id: toolCall.id },
    ]);

    return finalResponse.content;
  }

  // If no tool was needed, just return the AI's direct reply
  return response.content;
}