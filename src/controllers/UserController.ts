import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source"
import AppError from "../utils/AppError";
import { User } from "../entities/User";
import { validateCNPJ, validateCPF, validateEmail } from "../utils/validators";
import bcrypt from "bcrypt";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";

class UserController {
  private userRepository
  private branchRepository
  private driverRepository

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.branchRepository = AppDataSource.getRepository(Branch)
    this.driverRepository = AppDataSource.getRepository(Driver)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, profile, email, password, document, full_address } = req.body

      if (!name || !profile || !email || !password || !document) {
        throw new AppError("Todos os campos obrigatórios devem ser preenchidos", 400);
      }

      if (!validateEmail(email)) {
        throw new AppError("Formato de e-mail inválido!", 400)
      }

      if (password.length < 6 || password.length > 20) {
        throw new AppError("A senha deve ter entre 6 e 20 caracteres!", 400)
      }

      if (profile === "DRIVER" && !validateCPF(document)) {
        throw new AppError("Insira um CPF válido", 400)
      } else if (profile === "BRANCH" && !validateCNPJ(document)) {
        throw new AppError("Insira um CNPJ válido", 400)
      }

      const emailExists = await this.userRepository.findOne({ where: { email: email } })
      if (emailExists) {
        throw new AppError("Este e-mail já possui um cadastro", 409)
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const user = await this.userRepository.save({ name, profile, email, password_hash: passwordHash, status: true })

      if (profile === "DRIVER") {
        await this.driverRepository.save({ full_address, document, user_id: user.id })
      } else if (profile === "BRANCH") {
        await this.branchRepository.save({ full_address, document, user_id: user.id })
      }

      res.status(201).json({name: user.name, profile: user.profile})

    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
