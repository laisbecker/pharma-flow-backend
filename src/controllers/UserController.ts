import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../database/data-source"
import AppError from "../utils/AppError"
import { User } from "../entities/User"
import { validateCNPJ, validateCPF, validateEmail } from "../utils/validators"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Branch } from "../entities/Branch"
import { Driver } from "../entities/Driver"

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

    const { name, profile, email, password, document, full_address } = req.body

    try {

      if (!name || !profile || !email || !password || !document) {
        throw new AppError("Todos os campos obrigatórios devem ser preenchidos", 400)
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
        await this.driverRepository.save({ full_address, document, user: user })
      } else if (profile === "BRANCH") {
        await this.branchRepository.save({ full_address, document, user: user })
      }

      const token = jwt.sign({ id: user.id, profile: user.profile },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" }
      )

      res.status(201).json({ name: user.name, profile: user.profile, token })

    } catch (error) {
      next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { profile } = req.query

    const whereConditions: any = {}
    if (profile) whereConditions.profile = profile

    try {
      const listUsers = await this.userRepository.find({ where: whereConditions, select: ["id", "name", "status", "profile"] })
      res.status(200).json(listUsers)
    } catch (error) {
      next(error)
    }
  }

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params
      const user = await this.userRepository.findOne({ where: { id: +params.id }, relations: ['driver', 'branch'] })

      if (!user) {
        throw new AppError("Usuário não localizado", 404)
      }

      let full_address = ''
      if (user.profile === 'DRIVER' && user.driver) {
        full_address = user.driver.full_address
      } else if (user.profile === 'BRANCH' && user.branch) {
        full_address = user.branch.full_address
      }

      const responseData = {
        id: user.id,
        name: user.name,
        status: user.status,
        profile: user.profile,
        full_address: full_address
      }

      res.status(200).json(responseData)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params
      const body = req.body
      const forbiddenFields = ['id', 'created_at', 'updated_at', 'status', 'profile']

      const hasForbiddenField = Object.keys(body).some(field => forbiddenFields.includes(field))
      if (hasForbiddenField) {
        throw new AppError('Existem informações que não podem ser alteradas', 403)
      }

      const user = await this.userRepository.findOne({
        where: { id: +params.id },
        relations: ['driver', 'branch']
      })

      if (!user) {
        throw new AppError('Usuário não encontrado!', 404)
      }

      if (body.name) user.name = body.name
      if (body.email) user.email = body.email
      if (body.password) {
        user.password_hash = await bcrypt.hash(body.password, 10)
      }

      if (body.full_address) {
        if (user.profile === 'DRIVER' && user.driver) {
          user.driver.full_address = body.full_address
          await this.driverRepository.save(user.driver)
        }
        else if (user.profile === 'BRANCH' && user.branch) {
          user.branch.full_address = body.full_address
          await this.branchRepository.save(user.branch)
        }
      }

      const updatedUser = await this.userRepository.save(user)

      const responseData = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
        profile: updatedUser.profile,
        full_address: body.full_address || (user.profile === 'DRIVER' ? user.driver?.full_address : user.branch?.full_address)
      }

      res.status(200).json(responseData)

    } catch (error) {
      next(error)
    }
  }

  status = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params
      const user = await this.userRepository.findOneBy({ id: +params.id })

      if (!user) {
        throw new AppError('Usuário não encontrado', 404)
      } else {
        user.status = !user.status

        await this.userRepository.save(user)
        res.status(200).json({message: "status do usuário atualizado!", status: user.status})
      }
    } catch (error) {
      next(error)
    }
  }

}

export default UserController
