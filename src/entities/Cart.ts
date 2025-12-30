import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { CartStatus } from '../interfaces/Interfaces';
import { CartItem } from './CartItem';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id', nullable: true })
  customerId: number | null;

  // Relation Many-to-One vers Customer
  @ManyToOne(() => Customer, (customer) => customer.carts, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null;

  // Relation One-to-Many vers CartItems
  // cascade: true permet de sauvegarder les items en même temps que le panier si besoin
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
