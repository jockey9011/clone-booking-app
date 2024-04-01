import jwt from 'jsonwebtoken';
import { createError } from './../utils/error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, 'Usted no está autenticado'));
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if(err) return next(createError(403, 'Token no válido'));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'No está autorizado para realizar esta acción'));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, 'No está autorizado para realizar esta acción'));
    }
  });
};
