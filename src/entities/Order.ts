import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { OrderStatus } from '../interfaces/Interfaces';

@Entity('customer_order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  reference: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus;

  @Column({ name: 'total_products', type: 'decimal', precision: 10, scale: 2 })
  totalProducts: number;

  @Column({
    name: 'total_tax',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
  })
  totalTax: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 10, scale: 2 })
  grandTotal: number;

  @Column({ name: 'billing_address', type: 'text' })
  billingAddress: string;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  paymentMethod: string | null;

  @Column({ name: 'transaction_id', type: 'varchar', nullable: true })
  transactionId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'pickup_code', length: 6 })
  pickupCode: string;

  @Column({ name: 'picked_up_at', type: 'datetime', nullable: true })
  pickedUpAt: Date | null;
}
