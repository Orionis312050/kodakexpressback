import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { Customer } from './entities/Customer';
import { Product } from './entities/Product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'kodak_express_db',
      entities: [Product, Customer],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CustomersModule,
    ProductsModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
