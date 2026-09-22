import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";

// Tool 1: Check room availability
export async function checkRoomAvailability({ roomType, checkInDate, checkOutDate }) {
  const room = await Room.findOne({ roomType: new RegExp(roomType, "i") });

  if (!room) {
    return { available: false, message: `No room type found matching "${roomType}"` };
  }

  const overlappingBookings = await Booking.countDocuments({
    roomId: room._id,
    status: "confirmed",
    $or: [
      { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
    ],
  });

  const roomsBooked = overlappingBookings;
  const roomsAvailable = room.totalRooms - roomsBooked;

  return {
    available: roomsAvailable > 0,
    roomType: room.roomType,
    pricePerNight: room.pricePerNight,
    roomsAvailable,
    roomId: room._id.toString(),
  };
}

// Tool 2: Create a booking
export async function createBooking({ guestName, roomType, checkInDate, checkOutDate, guests }) {
  const room = await Room.findOne({ roomType: new RegExp(roomType, "i") });

  if (!room) {
    return { success: false, message: `No room type found matching "${roomType}"` };
  }

  const availability = await checkRoomAvailability({ roomType, checkInDate, checkOutDate });
  if (!availability.available) {
    return { success: false, message: "No rooms available for those dates" };
  }

  const booking = await Booking.create({
    guestName,
    roomId: room._id,
    checkInDate,
    checkOutDate,
    guests,
  });

  return {
    success: true,
    message: `Booking confirmed for ${guestName}: ${roomType} room from ${checkInDate} to ${checkOutDate}`,
    bookingId: booking._id.toString(),
  };
}