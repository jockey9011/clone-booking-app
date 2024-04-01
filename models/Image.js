import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Image', ImageSchema);
