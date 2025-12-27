import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service], // Exporté pour le seed
})
export class S3Module {}
