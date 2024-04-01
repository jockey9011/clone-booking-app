import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {createError} from "./../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  
  try {
    const salt = bcrypt.genSaltSync(10);
    const pass = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: pass
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, 'Usuario no encontrado'));
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return next(createError(400, 'Credenciales Inválidas'));

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET);

    const {password,isAdmin,...other} = user._doc;

    res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200).json({...other});
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    // Limpia la cookie que contiene el token de acceso
    res.clearCookie("access_token").sendStatus(200);
  } catch (err) {
    next(err);
  }
};
