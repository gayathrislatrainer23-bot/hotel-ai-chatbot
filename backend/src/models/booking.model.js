import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);