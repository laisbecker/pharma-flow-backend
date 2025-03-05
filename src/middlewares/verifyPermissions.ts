import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import AppError from "../utils/AppError";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";

class VerifyPermissions {

  static async verifyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      if (!req.userId) {
        throw new AppError("Usuário não autenticado", 401);
      }

      const user = await userRepository.findOne({ where: { id: +req.userId } });

      if (!user || user.profile !== "ADMIN") {
        throw new AppError("Acesso negado: permissão insuficiente", 403);
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  static async verifyAdminOrSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: req.userId } })

      if (!user) {
        throw new AppError("Usuário não autenticado", 401)
      }

      if (user.profile !== "ADMIN" && user.id !== Number(req.params.id)) {
        throw new AppError("Acesso negado: permissão insuficiente", 403)
      }
      next()

    } catch (error) {
      next(error)
    }
  }

  static async verifyBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const branchRepository = AppDataSource.getRepository(Branch)

      if (!req.userId) {
        throw new AppError("Usuário não autenticado", 401)
      }

      const user = await userRepository.findOne({
        where: { id: +req.userId },
        relations: ["branch"],
      })

      if (!user || user.profile !== "BRANCH"){
        throw new AppError("Acesso permitido somente para filiais", 403)
      }

      const branch = await branchRepository.findOne({
        where: {user: {id: user.id }},
      })
  
      if (!branch) {
        throw new AppError("Filial não encontrada", 404)
      }

      (req as any).branchId = branch.id

      next()
    } catch (error) {
      next(error)
    }
  }

  static async verifyBranchOrDriver(req: Request, res: Response, next: NextFunction){
    try{
      const userRepository = AppDataSource.getRepository(User)

      if(!req.userId){
        throw new AppError("Usuário não autenticado", 401)
      }

      const user = await userRepository.findOne({ where: {id: +req.userId}, relations: ["branch", "driver"]})

      if(!user || (user.profile !== "BRANCH" && user.profile !== "DRIVER")){
        throw new AppError("Acesso permitido apenas para filiais e motoristas", 403)
      }

      (req as any).userProfile = user.profile;
      (req as any).branchId = user.branch?.id;
      (req as any).driverId = user.driver?.id

      next()
    } catch(error){
      next(error)
    }
  }

  static async verifyDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = AppDataSource.getRepository(User)
      const driverRepository = AppDataSource.getRepository(Driver)

      if (!req.userId) {
        throw new AppError("Usuário não autenticado", 401)
      }

      const user = await userRepository.findOne({
        where: { id: +req.userId },
        relations: ["driver"],
      })

      if (!user || user.profile !== "DRIVER"){
        throw new AppError("Acesso permitido somente para motoristas", 403)
      }

      const driver = await driverRepository.findOne({
        where: {user: {id: user.id }},
      })
  
      if (!driver) {
        throw new AppError("Filial não encontrada", 404)
      }

      (req as any).driverId = driver.id

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default VerifyPermissions