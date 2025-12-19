import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/Product';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOneBy({ id });
  }

  create(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async seed() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      console.log('Seeding initial products...');
      await this.productsRepository.save([
        { name: 'Tirage Standard 10x15', description: 'Papier photo premium brillant', price: 0.25, category: 'Tirage' },
        { name: 'Agrandissement A4', description: 'Format 21x29.7cm', price: 4.50, category: 'Tirage' },
        { name: 'Livre Photo Paysage', description: 'Couverture rigide, 24 pages', price: 29.90, category: 'Album' },
        { name: 'Mug Personnalisé', description: 'Céramique blanche', price: 12.00, category: 'Cadeau' },
      ]);
    }
  }
}
