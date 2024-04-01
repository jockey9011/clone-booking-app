import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import createError from 'http-errors';


export const createBooking = async (req, res, next) => {
  const newBooking = new Booking(req.body);
  try {
    
    const user = await User.findById(newBooking.userId);
    const hotel = await Hotel.findById(newBooking.hotelId);

    if (!user || !hotel) {
      return next(createError(404, 'Usuario o hotel no encontrado'));
    }

    const room = await Room.findOne({ "roomNumbers._id": newBooking.roomId });

    if (!room) {
      return next(createError(404, 'Habitación no encontrada'));
    }

  
    const bookedDates = await Booking.find({
      roomId: room._id,
      checkIn: { $lte: newBooking.checkOut },
      checkOut: { $gte: newBooking.checkIn }
    });

    if (bookedDates.length > 0) {
      return next(createError(400, 'La habitación ya está reservada para estas fechas'));
    }

    
    const total = room.price * Math.floor((newBooking.checkOut - newBooking.checkIn) / (1000 * 60 * 60 * 24));
    newBooking.total = total;

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};



export const getUserBookings = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const bookings = await Booking.find({ userId });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};


export const getBooking = async (req, res, next) => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.findById(bookingId).populate('userId roomId hotelId');
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};


export const updateBooking = async (req, res, next) => {
  const bookingId = req.params.id;
  const updateData = req.body; // Datos actualizados de la reserva
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });
    if (!updatedBooking) {
      return next(createError(404, 'Reserva no encontrada'));
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};


export const deleteBooking = async (req, res, next) => {
  const bookingId = req.params.id;
  try {
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return next(createError(404, 'Reserva no encontrada'));
    }
    res.status(200).json({ message: 'Reserva eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};



export default { createBooking, getUserBookings, getBooking, updateBooking, deleteBooking };
