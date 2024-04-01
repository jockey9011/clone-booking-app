import express from 'express';
import * as reviewsController from '../controllers/review.controllers.js';

const router = express.Router();

// Ruta para crear una nueva reseña
router.post('/create', reviewsController.createReview);

// Ruta para obtener todas las reseñas
router.get('/', reviewsController.getAllReviews);

// Ruta para obtener una reseña por ID de hotel y usuario
router.get('/:hotelId', reviewsController.getReviewsByHotelId);


// Ruta para actualizar una reseña
router.put('/:id/update', reviewsController.updateReview);

// Ruta para eliminar una reseña
router.delete('/:id/delete', reviewsController.deleteReview);

export default router;
