import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { devLogLevels, prodLogLevels } from './config/log-limits';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const logLevel =
    process.env.NODE_ENV === 'production' ? prodLogLevels : devLogLevels;

  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const frontendUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : 'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'X-CSRF-Token',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
  });

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    next();
  });

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get('PORT') || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
