import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/Customer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/LoginDto';

@ApiTags('Clients')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Récupérer la liste de tous les clients' })
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @ApiOperation({ summary: "Récupére l'utilisateur" })
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.customersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Créer un nouveau client' })
  @Post()
  create(@Body() customer: Customer) {
    return this.customersService.create(customer);
  }

  @ApiOperation({ summary: 'Authentification client' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.customersService.login(loginDto);
  }

  @ApiOperation({ summary: 'Supprimer un client par son ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
