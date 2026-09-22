import mongoose from "mongoose";
import { ENV } from "./config/env.js";
import Room from "./models/room.model.js";

const sampleRooms = [
  {
    roomType: "Standard",
    pricePerNight: 2500,
    totalRooms: 10,
    amenities: ["AC", "WiFi", "TV"],
    imageUrl: "",
  },
  {
    roomType: "Deluxe",
    pricePerNight: 4000,
    totalRooms: 6,
    amenities: ["AC", "WiFi", "TV", "Breakfast"],
    imageUrl: "",
  },
  {
    roomType: "Sea View",
    pricePerNight: 5500,
    totalRooms: 4,
    amenities: ["AC", "WiFi", "TV", "Breakfast", "Balcony"],
    imageUrl: "",
  },
  {
    roomType: "Suite",
    pricePerNight: 8000,
    totalRooms: 2,
    amenities: ["AC", "WiFi", "TV", "Breakfast", "Balcony", "Mini Bar"],
    imageUrl: "",
  },
];

async function seed() {
  console.log("MONGO_URI:", ENV.MONGO_URI);
  await mongoose.connect(ENV.MONGO_URI);
  console.log("Connected. Seeding rooms...");

  await Room.deleteMany({}); // clear existing rooms first
  await Room.insertMany(sampleRooms);

  console.log("Rooms seeded successfully!");
  process.exit();
}

seed();