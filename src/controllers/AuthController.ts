import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import AppError from "../utils/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


class AuthController {
    private userRepository

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        try {
            if (!email || !password) {
                throw new AppError("E-mail e senha são obrigatórios", 400)
            }

            const user = await this.userRepository.findOne({
                where: { email },
                select: ["id", "name", "profile", "password_hash"],
            })

            if (!user) {
                throw new AppError("E-mail ou senha incorretos", 401)
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash)
            if (!passwordMatch) {
                throw new AppError("E-mail ou senha incorretos", 401)
            }

            const token = jwt.sign(
                { id: user.id, profile: user.profile },
                process.env.JWT_SECRET!,
                { expiresIn: "3h" }
            )

            res.status(200).json({
                token,
                name: user.name,
                profile: user.profile,
            })

        } catch (error) {
            next(error)
        }
    }
}

export default AuthController