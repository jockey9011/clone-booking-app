import express from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controllers.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

/* router.get("/prueba", verifyToken, (req, res, next) => {
  res.send("Hola, estás autenticado")
});

router.get("/prueba/:id", verifyUser, (req, res, next) => {
  res.send("Hola, estás autenticado y autorizado para ver este contenido")
});

router.get("/admin/:id", verifyAdmin, (req, res, next) => {
  res.send("Hola Admin, estaás autenticado y puedes hacer todas las acciones")
}); */


//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", verifyUser, getUser);

//GETING ALL UserS
router.get("/", verifyAdmin, getUsers);


export default router;

