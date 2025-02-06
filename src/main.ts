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
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(configService.get('BACKEND_PORT'));
  logger.log(
    `Application listening on port ${configService.get('BACKEND_PORT')}`,
  );
}
bootstrap();
