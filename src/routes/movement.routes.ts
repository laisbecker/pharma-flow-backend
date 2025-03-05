import { Router } from "express"
import verifyToken from "../middlewares/auth"
import VerifyPermissions from "../middlewares/verifyPermissions"
import MovementController from "../controllers/MovementController"

const movementRouter = Router()
const movementController = new MovementController()

movementRouter.post("/", verifyToken, VerifyPermissions.verifyBranch, movementController.create)
movementRouter.get("/", verifyToken, VerifyPermissions.verifyBranchOrDriver, movementController.getAll)
movementRouter.patch("/:id/start", verifyToken, VerifyPermissions.verifyDriver, movementController.updateStart)
//movementRouter.patch("/:id/end", verifyToken, VerifyPermissions.verifyDriver, movementController.updateEnd)

export default movementRouter