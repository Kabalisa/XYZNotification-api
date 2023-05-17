import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  name: string;
  phoneNumber: number;
  email: string;
  requestsPerSecond: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers?.token) {
    return next();
  }

  const JWT: string = req.headers?.token.toString();

  try {
    const payload = jwt.verify(JWT, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
