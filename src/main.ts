import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Kodak Express API')
    .setDescription("L'API de gestion des produits et clients Kodak Express")
    .setVersion('1.0')
    .addTag('Produits', 'Gestion du catalogue photo')
    .addTag('Clients', 'Gestion de la base client')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Seed des données
  try {
    await app.listen(3001);
    console.log(`🚀 Serveur API Kodak Express lancé sur http://localhost:3001`);
    console.log(
      `📚 Documentation Swagger disponible sur http://localhost:3001/api`,
    );
    console.log(`- Produits disponibles sur: http://localhost:3001/products`);
    console.log(`- Clients disponibles sur: http://localhost:3001/customers`);
  } catch (error) {
    console.error(
      "❌ Erreur au démarrage. Vérifiez que MySQL est lancé et que la base 'kodak_db' existe.",
    );
    console.error(error);
  }
}
bootstrap();
