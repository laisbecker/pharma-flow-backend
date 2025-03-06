import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

export
  const verifyToken = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization?.split(" ")[1] ?? "";
      console.log("User ID extraído do token:", req.userId)

      if (!token) {
        throw new AppError("Token não informado", 401);
      }

      const data = jwt.verify(token, process.env.JWT_SECRET ?? "") as { id: number }
      console.log("Token decodificado:", data)
      req.userId = data.id

      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 401));
      } else {
        next(new AppError("Unknown error", 401));
      }
    }
  };

export default verifyToken;
