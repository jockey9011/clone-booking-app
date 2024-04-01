import express from 'express';
import { createHotel, deleteHotel, updateHotel, getHotel, getHotels, countByCity, countByType, getRoom } from '../controllers/hotel.controllers.js';
import { verifyAdmin } from '../utils/verifyToken.js';


const router = express.Router();

//CREATE
router.post("/", verifyAdmin,  createHotel);


//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

//GET
router.get("/find/:id", getHotel);

//GETING ALL HOTELS
router.get("/", getHotels);

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getRoom);

export default router;