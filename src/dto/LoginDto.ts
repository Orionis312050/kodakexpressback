import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jean.dupont@email.com',
    description: "L'email du client",
  })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Le mot de passe' })
  password: string;
}
