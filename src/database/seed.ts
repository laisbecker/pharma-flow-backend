import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { UserProfile } from "../enums/UserProfile";
import AppError from "../utils/AppError";

async function seedAdminUser() {
  try {
    await AppDataSource.initialize()

    const userRepository = AppDataSource.getRepository(User)

    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@email.com" },
    })

    if (existingAdmin) {
      return
    }

    const admin = new User()
    admin.name = "Admin"
    admin.email = "admin@email.com"
    admin.password_hash = await bcrypt.hash("123456", 10)
    admin.profile = UserProfile.ADMIN

    await userRepository.save(admin)

  } catch (error) {
    throw new AppError(`Falha ao criar usuário admin: ${error instanceof Error ? error.message : "Erro desconhecido"}`, 500)
  } finally {
    await AppDataSource.destroy()
  }
}

seedAdminUser()