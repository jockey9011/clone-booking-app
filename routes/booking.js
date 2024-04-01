import express from 'express';
import { createBooking, getUserBookings, getBooking, updateBooking, deleteBooking } from '../controllers/booking.controllers.js';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Crear un nuevo booking
router.post('/', verifyToken, createBooking);

// Obtener todas las reservas de un usuario
router.get('/user/:userId', verifyToken, getUserBookings);

// Obtener una reserva específica por ID
router.get('/:id', verifyAdmin, verifyToken, getBooking);

// Editar una reserva por su ID
router.put('/:id', verifyToken, updateBooking);

// Eliminar una reserva por su ID
router.delete('/:id', verifyToken, deleteBooking);

export default router;
// 