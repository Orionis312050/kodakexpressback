import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../entities/Customer';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/LoginDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/RegisterDto';
import { VerifyTokenDto } from '../dto/VerifyTokenDto';

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

  async create(customer: Customer): Promise<any> {
    const newCustomer = this.customersRepository.create(customer);
    const savedCustomer = await this.customersRepository.save(newCustomer);

    // 2. Génération du payload JWT
    const payload = { email: savedCustomer.email, sub: savedCustomer.id };

    // 3. On retourne l'utilisateur (sans mot de passe) + le token
    const result: RegisterDto = savedCustomer;
    console.log(result);
    return {
      access_token: this.jwtService.sign(payload),
      ...result,
    };
  }

  async verify(token: string): Promise<any> {
    try {
      const payload: VerifyTokenDto = await this.jwtService.verifyAsync(token);
      const customer = await this.findOne(payload.sub);

      if (!customer) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      const { password, ...result } = customer;
      return result;
    } catch (error) {
      throw new UnauthorizedException(
        'Token invalide ou expiré' + ' : ' + error,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
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

    // Génération du token
    const payload = { email: customer.email, sub: customer.id };

    // On retourne le token + les infos utilisateur
    // const { password, ...result } = customer;
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

  async remove(id: number): Promise<void> {
    await this.customersRepository.delete(id);
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
