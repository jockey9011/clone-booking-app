import Hotel from '../models/Hotel.js';
import Image from '../models/Image.js';

export const createImage = async (req, res, next) => {
  try {
    const { hotelId, url } = req.body;
    
   
    const newImage = await Image.create({ hotelId, url });
    
   
    await Hotel.findByIdAndUpdate(
      hotelId,
      {
        $push: { photos: newImage._id }
      },
      { new: true }
    );

    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getImagesByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const images = await Image.find({ hotelId });
    const imageUrls = images.map(image => image.url); 
    res.status(200).json(imageUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllImages = async (req, res, next) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    next(error);
  }
};



