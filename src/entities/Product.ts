import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Branch } from "./Branch"

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, length: 200 })
    name: string

    @Column({ nullable: false })
    amount: number

    @Column({ nullable: false })
    description: string

    @Column({ nullable: true, length: 200})
    url_cover: string

    @ManyToOne(() => Branch, (branch) => branch.products)
    @JoinColumn({ name: "branch_id" })
    branch: Branch;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date
}