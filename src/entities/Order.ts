import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { GroceryItem } from "./GroceryItem";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("json")
    items: { groceryId: number; quantity: number }[];

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}


