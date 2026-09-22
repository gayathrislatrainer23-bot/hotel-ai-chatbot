import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomType: { type: String, required: true },      // "Standard", "Deluxe", "Sea View", "Suite"
  pricePerNight: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  amenities: [{ type: String }],
  imageUrl: { type: String },
});

export default mongoose.model("Room", roomSchema);