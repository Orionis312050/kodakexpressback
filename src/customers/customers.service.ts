import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../entities/Customer';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/LoginDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenDto } from '../dto/VerifyTokenDto';
import {
  CustomerWithoutPassword,
  LoginResponse,
  RegisterResponse,
  UserRegister,
} from '../interfaces/Interfaces';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.customersRepository.findOne({
      where: { email: email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'address',
        'zipCode',
        'city',
      ],
    });
  }

  findOne(id: number): Promise<Customer | null> {
    return this.customersRepository.findOneBy({ id });
  }

  async create(customer: Customer): Promise<RegisterResponse> {
    const newCustomer = this.customersRepository.create(customer);
    const savedCustomer = await this.customersRepository.save(newCustomer);

    const payload = { email: savedCustomer.email, sub: savedCustomer.id };

    const result: UserRegister = savedCustomer;
    return {
      access_token: this.jwtService.sign(payload),
      ...result,
    };
  }

  async verify(token: string): Promise<CustomerWithoutPassword | null> {
    const payload: VerifyTokenDto = await this.jwtService.verifyAsync(token);
    const customer = await this.findOne(payload.sub);

    if (!customer) {
      return null;
    }

    const result: CustomerWithoutPassword = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      address: customer.address,
      zipCode: customer.zipCode,
      city: customer.city,
    };

    console.log(result);

    return result;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const customer = await this.customersRepository.findOneBy({
      email: loginDto.email,
    });

    if (!customer) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isMatch = await bcrypt.compare(loginDto.password, customer.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { email: customer.email, sub: customer.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    };
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.customersRepository.delete(id);
    return result.affected !== 0;
  }

  // Seed pour les clients
  async seed() {
    const count = await this.customersRepository.count();
    if (count === 0) {
      console.log('Seeding initial customers...');
      await this.customersRepository.save([
        {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          phone: '0601020304',
        },
        {
          firstName: 'Marie',
          lastName: 'Curie',
          email: 'marie.c@science.org',
          phone: '0699887766',
        },
      ]);
    }
  }
}
