import { Router } from "express"
import verifyToken from "../middlewares/auth"
import VerifyPermissions from "../middlewares/verifyPermissions"
import ProductController from "../controllers/ProductController"

const productRouter = Router()
const productController = new ProductController()

productRouter.post("/", verifyToken, VerifyPermissions.verifyBranch, productController.create)
productRouter.get("/", verifyToken, VerifyPermissions.verifyBranch, productController.getAll)

export default productRouter