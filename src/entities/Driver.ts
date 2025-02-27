import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User";

@Entity("drivers")
export class Driver {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255 })
    full_address: string

    @Column({ nullable: false, length: 30})
    document: string

    @OneToOne(() => User, (user) => user.driver)
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date
}