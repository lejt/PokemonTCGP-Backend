import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { devLogLevels, prodLogLevels } from './config/log-limits';
import { Express } from 'express';

let server: Express;

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const logLevel =
    process.env.NODE_ENV === 'production' ? prodLogLevels : devLogLevels;

  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // whitelist omits unknown properties, transform converts incoming data to one stated in DTO

  // Enable CORS with a specific origin for production
  const frontendUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL // TODO: make sure this frontend url is the same in vercel.json
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

  // Get the Express instance that NestJS uses internally
  server = app.getHttpAdapter().getInstance();

  // Initialize the application but don't start listening in production (for serverless)
  if (process.env.NODE_ENV === 'production') {
    await app.init();
  } else {
    const configService = app.get(ConfigService);
    const port = process.env.PORT || configService.get('PORT');
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
  }

  return server;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Export the serverless handler
export default async function handler(req, res) {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
}
