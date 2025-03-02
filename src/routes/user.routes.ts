import { Router } from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../middlewares/auth"; 
import VerifyPermissions from "../middlewares/verifyPermissions"; 

const userRouter = Router()
const userController = new UserController()

userRouter.post("/", verifyToken, VerifyPermissions.verifyAdmin, userController.create)
userRouter.get("/", verifyToken, VerifyPermissions.verifyAdmin, userController.getAll)
userRouter.get("/:id", verifyToken, VerifyPermissions.verifyAdminOrSelf, userController.getOne)
userRouter.put("/:id", verifyToken, VerifyPermissions.verifyAdminOrSelf, userController.update)
userRouter.patch("/:id/status", verifyToken, VerifyPermissions.verifyAdmin, userController.status)

export default userRouter