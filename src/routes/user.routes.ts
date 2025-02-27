import { Router } from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../middlewares/auth"; 
import { verifyUser } from "../middlewares/verifyUser"; 

const userRouter = Router()
const userController = new UserController()

userRouter.post("/", verifyToken, verifyUser, userController.create)
userRouter.get("/", verifyToken, verifyUser, userController.getAll)

export default userRouter