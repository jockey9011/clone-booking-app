import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGO = process.env.MONGO || 'mongodb+srv://booking_db:root@cluster0.asjtmbq.mongodb.net/booking?retryWrites=true&w=majority&appName=Cluster0';

const jonathanCredentials = {
  username: 'Jonathan',
  password: '12345',
};

let token;

beforeAll(async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true });

    const response = await request(app)
      .post('/api/auth/login')
      .send(jonathanCredentials);
    token = response.body.token;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller', () => {
  let uniqueUsername;
  let uniqueEmail;

  beforeEach(() => {
    uniqueUsername = 'testuser' + Date.now();
    uniqueEmail = 'testuser' + Date.now() + '@example.com';
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(201);
  });

  it('should authenticate a user', async () => {
    const password = 'testpassword';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      username: uniqueUsername,
      email: uniqueEmail,
      password: hashedPassword
    });
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: uniqueUsername,
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual(uniqueUsername);
  });

  it('should logout a user', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Endpoints de Usuarios', () => {
  it('Debería obtener todos los usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debería obtener un usuario por ID', async () => {
    const userId = '660622f88bb3ce6e0db72a80';
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
  });
});

describe('Endpoints de Hoteles', () => {
  let testHotelId;

  it('Debería crear un nuevo hotel', async () => {
    const res = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Hotel Test',
        city: 'City Test',
        cheapestPrice: 100,
        type: 'hotel'
      });
    expect(res.statusCode).toEqual(201);
    testHotelId = res.body._id;
  });

  it('Debería actualizar un hotel', async () => {
    const res = await request(app)
      .put(`/api/hotels/${testHotelId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Hotel Test'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated Hotel Test');
  });

  it('Debería obtener un hotel por ID', async () => {
    const response = await request(app)
      .get(`/api/hotels/find/${testHotelId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body._id).toEqual(testHotelId);
  });

  it('Debería obtener todos los hoteles', async () => {
    const response = await request(app)
      .get('/api/hotels')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
  });

  it('Debería eliminar un hotel', async () => {
    const response = await request(app)
      .delete(`/api/hotels/${testHotelId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Hotel has been deleted...');
  });
});

describe('Endpoints de Bookings', () => {
  let testBookingId;

  it('Debería crear un nuevo booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: '660622f88bb3ce6e0db72a80',
        hotelId: 'hotelId',
        roomId: 'roomId',
        checkIn: '2024-04-01',
        checkOut: '2024-04-03'
      });
    expect(res.statusCode).toEqual(201);
    testBookingId = res.body._id;
  });

  it('Debería obtener todas las reservas de un usuario', async () => {
    const response = await request(app)
      .get(`/api/bookings/user/660622f88bb3ce6e0db72a80`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debería obtener una reserva por ID', async () => {
    const response = await request(app)
      .get(`/api/bookings/${testBookingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(testBookingId);
  });

  it('Debería actualizar una reserva por ID', async () => {
    const res = await request(app)
      .put(`/api/bookings/${testBookingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        checkIn: '2024-04-02'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.checkIn).toEqual('2024-04-02');
  });

  it('Debería eliminar una reserva por ID', async () => {
    const response = await request(app)
      .delete(`/api/bookings/${testBookingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Reserva eliminada correctamente');
  });
});

//TEST PARA LAS ROOMS

describe('Endpoints de Rooms', () => {
  let testRoomId;

  it('Debería crear una nueva habitación', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({
        hotelId: 'hotelId',
        type: 'single',
        price: 100
      });
    expect(res.statusCode).toEqual(201);
    testRoomId = res.body._id;
  });

  it('Debería obtener todas las habitaciones de un hotel', async () => {
    const response = await request(app)
      .get(`/api/rooms/hotel/hotelId`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debería obtener una habitación por ID', async () => {
    const response = await request(app)
      .get(`/api/rooms/${testRoomId}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(testRoomId);
  });

  it('Debería actualizar una habitación por ID', async () => {
    const res = await request(app)
      .put(`/api/rooms/${testRoomId}`)
      .send({
        price: 120
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.price).toEqual(120);
  });

  it('Debería eliminar una habitación por ID', async () => {
    const response = await request(app)
      .delete(`/api/rooms/${testRoomId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Habitación eliminada correctamente');
  });
});

describe('Endpoints de Reviews', () => {
  let testReviewId;

  it('Debería crear una nueva reseña', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({
        userId: 'userId',
        hotelId: 'hotelId',
        rating: 4,
        comment: 'Excelente servicio'
      });
    expect(res.statusCode).toEqual(201);
    testReviewId = res.body._id;
  });

  it('Debería obtener todas las reseñas de un hotel', async () => {
    const response = await request(app)
      .get(`/api/reviews/hotel/hotelId`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debería obtener una reseña por ID', async () => {
    const response = await request(app)
      .get(`/api/reviews/${testReviewId}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(testReviewId);
  });

  it('Debería actualizar una reseña por ID', async () => {
    const res = await request(app)
      .put(`/api/reviews/${testReviewId}`)
      .send({
        rating: 5
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.rating).toEqual(5);
  });

  it('Debería eliminar una reseña por ID', async () => {
    const response = await request(app)
      .delete(`/api/reviews/${testReviewId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Reseña eliminada correctamente');
  });
});

describe('Endpoints de Imágenes', () => {
  let testImageId;

  it('Debería agregar una nueva imagen', async () => {
    const res = await request(app)
      .post('/api/images')
      .send({
        hotelId: 'hotelId',
        imageUrl: 'https://example.com/image.jpg'
      });
    expect(res.statusCode).toEqual(201);
    testImageId = res.body._id;
  });

  it('Debería obtener todas las imágenes de un hotel', async () => {
    const response = await request(app)
      .get(`/api/images/hotelId`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debería obtener una imagen por ID', async () => {
    const response = await request(app)
      .get(`/api/images/${testImageId}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(testImageId);
  });

  it('Debería actualizar una imagen por ID', async () => {
    const res = await request(app)
      .put(`/api/images/${testImageId}`)
      .send({
        imageUrl: 'https://example.com/updated-image.jpg'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.imageUrl).toEqual('https://example.com/updated-image.jpg');
  });

  it('Debería eliminar una imagen por ID', async () => {
    const response = await request(app)
      .delete(`/api/images/${testImageId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Imagen eliminada correctamente');
  });
});




