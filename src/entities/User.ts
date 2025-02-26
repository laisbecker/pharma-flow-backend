import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { UserProfile } from "../enums/UserProfile"
import { Driver } from "./Driver"
import { Branch } from "./Branch"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 150, nullable: false })
  name: string

  @Column({ type: "enum", enum: UserProfile, nullable: false })
  profile: UserProfile

  @Column({ nullable: false, length: 150, unique: true })
  email: string

  @Column({ nullable: false, length: 150})
  password_hash: string

  @Column({ default: true })
  status: boolean

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  created_at: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updated_at: Date

  @OneToOne(() => Driver, (driver) => driver.user)
  driver?: Driver

  @OneToOne(() => Branch, (branch) => branch.user)
  branch?: Branch
}