import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@Entity()
export class Customer {
  @ApiProperty({ example: 1, description: "L'identifiant unique du client" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Jean', description: 'Prénom du client' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille du client' })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'jean.dupont@email.com',
    description: 'Email unique',
  })
  @Column({ unique: true }) // Email unique
  email: string;

  @ApiProperty({
    example: 'monmotdepasse',
    description: 'Mot de passe en clair',
    required: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '0601020304',
    description: 'Numéro de téléphone',
    required: true,
  })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Date de création du compte' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    example: '1 rue de la paix',
    description: 'adresse du client',
    required: true,
  })
  @Column()
  address: string;

  @ApiProperty({
    example: '75001',
    description: 'code postal du client',
    required: true,
  })
  @Column()
  zipCode: string;

  @ApiProperty({
    example: 'Paris',
    description: 'ville du client',
    required: true,
  })
  @Column()
  city: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      // 10 est le "salt rounds" (complexité du chiffrement)
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
