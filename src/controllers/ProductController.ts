import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../database/data-source"
import { Product } from "../entities/Product"
import AppError from "../utils/AppError"

class ProductController {
    private productRepository

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product)
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, amount, description, url_cover } = req.body

            if (!name) {
                throw new AppError("É obrigatório preencher o nome", 400)
            }

            if (!amount) {
                throw new AppError("É obrigatório preencher a quantidade", 400)
            }

            if (!description) {
                throw new AppError("É obrigatório preencher a descrição", 400)
            }

            const branchId = (req as any).branchId

            const product = this.productRepository.create({ name, amount: +amount, description, url_cover: url_cover || null, branch: { id: branchId } })

            await this.productRepository.save(product)

            res.status(201).json({
                id: product.id,
                name: product.name,
                amount: product.amount,
                description: product.description,
                url_cover: product.url_cover,
                created_at: product.created_at,
                updated_at: product.updated_at
            })

        } catch (error) {
            next(error)
        }
    }

}

export default ProductController