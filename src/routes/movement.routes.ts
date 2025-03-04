import { Router } from "express"
import verifyToken from "../middlewares/auth"
import VerifyPermissions from "../middlewares/verifyPermissions"
import MovementController from "../controllers/MovementController"

const movementRouter = Router()
const movementController = new MovementController()

movementRouter.post("/", verifyToken, VerifyPermissions.verifyBranch, movementController.create)

export default movementRouter