import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from '../entities/Customer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/LoginDto';
import type { Request, Response } from 'express';
import { JSX_ENVIRONMENT, JSX_SECURE } from '../constants/Constants';

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
  @Get('getbyemail')
  findByEmail(@Query('email') email: string) {
    return this.customersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Créer un nouveau client' })
  @Post()
  create(@Body() customer: Customer) {
    return this.customersService.create(customer);
  }

  @ApiOperation({ summary: 'Vérification du token client' })
  @Get('verify')
  async verify(@Req() req: Request): Promise<any> {
    const token = req.cookies['token'];
    if (!token) {
      throw new UnauthorizedException('Aucun token de session trouvé');
    }
    return await this.customersService.verify(token);
  }

  @ApiOperation({ summary: 'Authentification client' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.customersService.login(loginDto);

    response.cookie('token', result.access_token, {
      httpOnly: true,
      secure: JSX_SECURE,
      sameSite: JSX_ENVIRONMENT, // 'lax' est souvent plus simple pour le dev local
      path: '/',
      maxAge: 3600000, // 1 heure par exemple
    });

    return result;
  }

  @ApiOperation({ summary: 'Déconnexion client' })
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('token', '', {
      httpOnly: true,
      secure: JSX_SECURE, // Mettre 'true' si vous êtes en HTTPS
      sameSite: JSX_ENVIRONMENT,
      expires: new Date(0),
      path: '/',
    });

    return { message: 'Déconnexion réussie' };
  }

  @ApiOperation({ summary: 'Supprimer un client par son ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
