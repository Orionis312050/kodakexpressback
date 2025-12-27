import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({ example: 1, description: "L'identifiant unique du produit" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tirage 10x15', description: 'Le nom du produit' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Papier brillant haute qualité',
    description: 'Description détaillée',
  })
  @Column('text')
  description: string;

  @ApiProperty({ example: 0.25, description: 'Prix unitaire en euros' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 'Tirage', description: 'Catégorie du produit' })
  @Column()
  category: string;

  @ApiProperty({ example: true, description: 'Disponibilité en stock' })
  @Column({ default: true })
  inStock: boolean;

  @ApiProperty({ example: true, description: 'Icone du produit' })
  @Column({ default: true })
  icon: string;

  @ApiProperty({ example: true, description: "Nom de l'icone du produit" })
  @Column({ default: true })
  iconName: string;
}
