import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import bookingRoute from './routes/booking.js';
import imagesRoute from './routes/images.js'; 
import reviewsRoute from './routes/reviews.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');
  } catch (error) {
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
})

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/images', imagesRoute); 
app.use('/api/reviews', reviewsRoute); 

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Server Error - No available";
  return res.status(errorStatus).json({
    message: errorMessage,
    status: errorStatus,
    success: false,
    stack: err.stack
  });
});

const PORT = 3000; // Especificar el puerto directamente

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}!`);
});



export default app;

