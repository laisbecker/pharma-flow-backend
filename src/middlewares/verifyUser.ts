import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import AppError from "../utils/AppError";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    if (!req.userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const user = await userRepository.findOne({ where: { id: +req.userId }});

    if (!user || user.profile !== "ADMIN") {
      throw new AppError("Acesso negado: permissão insuficiente", 403);
    }

    next()
  } catch (error) {
    next(error)
  }
}