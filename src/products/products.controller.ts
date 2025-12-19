import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/Product';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Produits')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Récupérer la liste de tous les produits' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Créer un nouveau produit' })
  @Post()
  create(@Body() product: Product) {
    return this.productsService.create(product);
  }

  @ApiOperation({ summary: 'Supprimer un produit par son ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
