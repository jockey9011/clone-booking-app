// users.js

import express from 'express';
import { updateUser, deleteUser, getUser, getUsers } from '../controllers/user.controllers.js';
import { verifyToken, verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser); // Aplica verifyAdmin solo para esta ruta
router.get("/:id", verifyToken, getUser);
router.get("/", verifyToken, verifyAdmin, getUsers); // Aplica verifyAdmin solo para esta ruta

export default router;

