import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { UserProfile } from "../enums/UserProfile";

async function seedAdminUser() {
  try {
    await AppDataSource.initialize()

    const userRepository = AppDataSource.getRepository(User)

    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@email.com" },
    })

    if (existingAdmin) {
      console.log("Usuário admin já existe")
      return
    }

    const admin = new User()
    admin.name = "Admin"
    admin.email = "admin@email.com"
    admin.password_hash = await bcrypt.hash("123456", 10)
    admin.profile = UserProfile.ADMIN

    await userRepository.save(admin)
    console.log("✅ Admin criado com sucesso!")

  } catch (error) {
    console.error("Erro ao criar admin:", error)
  } finally {
    await AppDataSource.destroy()
  }
}

seedAdminUser()