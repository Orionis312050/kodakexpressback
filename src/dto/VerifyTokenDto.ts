import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    example: 'jean.dupont@email.com',
    description: 'Email unique',
  })
  email: string;

  @ApiProperty({ example: 1, description: 'sub du payload' })
  sub: number;

  @ApiProperty({ example: 1, description: 'iat du payload' })
  iat: number;

  @ApiProperty({ example: 1, description: 'exp du payload' })
  exp: number;
}
