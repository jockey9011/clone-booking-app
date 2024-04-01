import Review from '../models/Review.js'; 
import Hotel from "../models/Hotel.js";


export const createReview = async (req, res) => {
  try {
    const { rating, comment, hotelId, userId } = req.body;
    const review = new Review({ rating, comment, hotelId, userId });
    await review.save();

    
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

  
    hotel.reviews.push(review._id);
    await hotel.save();

    res.status(201).json({ message: 'Reseña creada exitosamente', review });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reseña' });
  }
};



export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reseñas' });
  }
};

export const getReviewsByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const reviews = await Review.find({ hotelId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reseñas' });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.status(200).json({ message: 'Reseña actualizada exitosamente', updatedReview });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reseña' });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    
    const hotelId = review.hotelId;

   
    await Review.findByIdAndDelete(reviewId);

    
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

   
    hotel.reviews = hotel.reviews.filter(review => review.toString() !== reviewId);
    await hotel.save();

    res.status(200).json({ message: 'Reseña eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reseña' });
  }
};

