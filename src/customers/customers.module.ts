import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../entities/Customer';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret:
        '8761951b7b73b275d0f198bb7f9b1676e3a5b91cd9126d90c2b7d442cf426742', // ⚠️ En prod, utilisez process.env.JWT_SECRET
      signOptions: { expiresIn: '60m' }, // Le token expire dans 60 minutes
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService], // Exporté pour le seed
})
export class CustomersModule {}
