import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ApiOperation, ApiTags, ApiProperty } from '@nestjs/swagger';

class GeneratePresignedUrlDto {
  @ApiProperty() userId: string;
  @ApiProperty() orderId: string;
  @ApiProperty() fileType: string;
  @ApiProperty() originalName: string;
}

@ApiTags('S3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({ summary: "Générer une URL présignée pour l'upload" })
  @Post('generate-upload-url')
  async generateUploadUrl(@Body() body: GeneratePresignedUrlDto) {
    return await this.s3Service.generatePresignedUploadUrl(
      body.userId,
      body.orderId,
      body.fileType,
      body.originalName,
    );
  }

  @ApiOperation({ summary: "Supprimer tous les fichiers d'une commande" })
  @Delete('order/:userId/:orderId')
  async deleteOrderFiles(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    await this.s3Service.deleteOrderFolder(userId, orderId);
    return { message: 'Dossier de commande supprimé avec succès' };
  }
}
