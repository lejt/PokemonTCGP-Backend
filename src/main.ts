import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { devLogLevels, prodLogLevels } from './config/log-limits';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const logLevel =
    process.env.NODE_ENV === 'prod' ? prodLogLevels : devLogLevels;

  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // whitelist omits unknown properties, transform converts incoming data to one stated in DTO

  // Enable CORS with a specific origin for production
  const frontendUrl =
    process.env.NODE_ENV === 'prod'
      ? process.env.FRONTEND_URL
      : 'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get('PORT');
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
