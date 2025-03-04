import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../database/data-source"
import { Product } from "../entities/Product"
import AppError from "../utils/AppError"
import { Movement } from "../entities/Movement";
import { FindManyOptions } from "typeorm";

class MovementController {

    private movementRepository = AppDataSource.getRepository(Movement);
    private productRepository = AppDataSource.getRepository(Product);

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { destination_branch_id, product_id, quantity } = req.body
            const source_branch_id = (req as any).branchId

            if (!destination_branch_id) {
                throw new AppError("É obrigatório selecionar a filial de destino", 400)
            }

            if (!product_id) {
                throw new AppError("É obrigatório selecionar o produto", 400)
            }

            if (!quantity) {
                throw new AppError("É obrigatório selecionar a quantidade", 400)
            }

            if (source_branch_id === destination_branch_id) {
                throw new AppError("As filiais de origem e destino devem ser diferentes", 400)
            }

            if (quantity <= 0) {
                throw new AppError("A quantidade deve ser maior que zero", 400)
            }

            const product = await this.productRepository.findOne({
                where: {
                    id: product_id,
                    branch: { id: source_branch_id }
                }
            })

            if (!product) {
                throw new AppError("Produto não encontrado na filial de origem", 404)
            }

            if (product.amount < quantity) {
                throw new AppError(`Você possui ${product.amount}UN desse produto em estoque. Insira uma quantidade menor`, 400)
            }

            await AppDataSource.transaction(async (transactionalEntityManager) => {
                product.amount -= quantity
                await transactionalEntityManager.save(product)

                const movement = this.movementRepository.create({
                    destinationBranch: { id: destination_branch_id },
                    product: { id: product_id },
                    quantity
                })

                await transactionalEntityManager.save(movement);
            })

            res.status(201).json({ message: "Movimentação criada com sucesso" })
        } catch (error) {
            next(error)
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const userProfile = (req as any).userProfile
            const branchId = (req as any).branchId

            const queryOptions: FindManyOptions<Movement> = {
                relations: ["destinationBranch", "product"],
                order: {created_at: "DESC"}
            }

            if (userProfile === "BRANCH" && branchId){
                queryOptions.where = {destinationBranch: {id: branchId}}
            }

            const movements = await this.movementRepository.find(queryOptions)
            res.status(200).json(movements)

        } catch(error){
            next(error)
        }
    }
}

export default MovementController