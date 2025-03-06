import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../database/data-source"
import { Product } from "../entities/Product"
import AppError from "../utils/AppError"
import { Movement } from "../entities/Movement";
import { FindManyOptions } from "typeorm";
import { Driver } from "../entities/Driver";
import { MovementStatus } from "../enums/MovementStatus";

class MovementController {

    private movementRepository = AppDataSource.getRepository(Movement);
    private productRepository = AppDataSource.getRepository(Product);

    private formatMovement(movement: Movement) {
        return {
            id: movement.id,
            destination_branch: {
                name: movement.destinationBranch.user.name,
                full_address: movement.destinationBranch.full_address
            },
            product: {
                name: movement.product.name,
                description: movement.product.description,
                url_cover: movement.product.url_cover
            },
            quantity: movement.quantity,
            status: movement.status,
            created_at: movement.created_at,
            updated_at: movement.updated_at,
            driver: movement.driver ? {
                id: movement.driver.id,
                name: movement.driver.user.name
            } : null
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { product_id, quantity, driver_id } = req.body
            const destination_branch_id = +req.body.destination_branch_id
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

            if (destination_branch_id === source_branch_id) {
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
                    driver: driver_id ? { id: driver_id } : undefined,
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
        try {
            const userProfile = (req as any).userProfile
            const branchId = (req as any).branchId

            const queryOptions: FindManyOptions<Movement> = {
                relations: ["destinationBranch", "destinationBranch.user", "product", "driver", "driver.user"],
                order: { created_at: "DESC" }
            }

            if (userProfile === "BRANCH" && branchId) {
                queryOptions.where = { destinationBranch: { id: branchId } }
            }

            const movements = await this.movementRepository.find(queryOptions)
            const formattedMovements = movements.map(movement => this.formatMovement(movement))

            res.status(200).json(formattedMovements)

        } catch (error) {
            next(error)
        }
    }

    updateStart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const movementId = +req.params.id
            const driverId = (req as any).driverId

            const movement = await this.movementRepository.findOne({
                where: { id: movementId },
                relations: ['driver']
            })

            if (!movement) {
                throw new AppError("Movimentação não encontrada", 404)
            }

            if (movement.status !== MovementStatus.PENDING) {
                throw new AppError("Esta movimentação já foi iniciada ou finalizada", 400)
            }

            if (movement.driver && movement.driver.id !== driverId) {
                throw new AppError("Outro motorista já está responsável por esta movimentação", 403)
            }

            movement.status = MovementStatus.IN_PROGRESS
            movement.driver = { id: driverId } as Driver

            await this.movementRepository.save(movement)

            const fullMovement = await this.movementRepository.findOne({
                where: { id: movementId },
                relations: [
                    'destinationBranch',
                    'destinationBranch.user',
                    'product',
                    'driver',
                    'driver.user'
                ]
            })

            if (!fullMovement) {
                throw new AppError("Movimentação não encontrada após atualização", 500)
            }

            const formattedMovement = this.formatMovement(fullMovement)

            res.status(200).json(formattedMovement)

        } catch (error) {
            next(error)
        }
    }

    updateEnd = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const movementId = +req.params.id
            const driverId = (req as any).driverId

            const movement = await this.movementRepository.findOne({
                where: { id: movementId },
                relations: ['driver', 'product', 'destinationBranch']
            })

            if (!movement) {
                throw new AppError("Movimentação não encontrada", 404)
            }

            if (movement.status === MovementStatus.PENDING) {
                throw new AppError("Esta movimentação ainda não foi iniciada", 400)
            }

            if (movement.status === MovementStatus.FINISHED) {
                throw new AppError("Esta movimentação já foi finalizada", 400)
            }

            if (movement.driver && movement.driver.id !== driverId) {
                throw new AppError("Outro motorista já está responsável por esta movimentação", 403)
            }

            await AppDataSource.transaction(async transactionalEntityManager => {
                movement.status = MovementStatus.FINISHED

                await transactionalEntityManager.save(movement)

                const existingProduct = await this.productRepository.findOne({
                    where: {
                        name: movement.product.name,
                        branch: { id: movement.destinationBranch.id }
                    }
                })

                if (existingProduct) {
                    existingProduct.amount += movement.quantity
                    await transactionalEntityManager.save(existingProduct)
                } else {
                    const newProduct = this.productRepository.create({
                        name: movement.product.name,
                        description: movement.product.description,
                        url_cover: movement.product.url_cover,
                        amount: movement.quantity,
                        branch: { id: movement.destinationBranch.id }
                    })

                    await transactionalEntityManager.save(newProduct)
                }
            })

            const fullMovement = await this.movementRepository.findOne({
                where: { id: movementId },
                relations: [
                    'destinationBranch',
                    'destinationBranch.user',
                    'product',
                    'driver',
                    'driver.user'
                ]
            })

            if (!fullMovement) {
                throw new AppError("Movimentação não encontrada após atualização", 500)
            }

            const formattedMovement = this.formatMovement(fullMovement)
            res.status(200).json(formattedMovement)
        } catch (error) {
            next(error)
        }
    }
}

export default MovementController