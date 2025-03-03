import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User";
import { Product } from "./Product";

@Entity("branches")
export class Branch {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255 })
    full_address: string

    @Column({ nullable: false, length: 30 })
    document: string

    @OneToOne(() => User, (user) => user.branch)
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date

    @OneToMany(()=> Product, (product) => product.branch)
    products: Product[]
}