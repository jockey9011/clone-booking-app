import express from 'express';
import { createImage, getImagesByHotelId, getAllImages } from '../controllers/image.controllers.js';

const router = express.Router();

router.post('/', createImage);

router.get('/:hotelId', getImagesByHotelId);

router.get('/', getAllImages);

export default router;
