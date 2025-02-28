import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Check if the code is running in the compiled state (i.e., after build)
const isCompiled = __dirname.includes('dist');

// The root directory should always point to the project root
const rootDir = isCompiled
  ? path.resolve(__dirname, '..', '..')
  : path.resolve(__dirname, '../..');

// Resolve the path to the `config/` folder in the root directory
const configDir = path.resolve(rootDir, 'config');
// Determine the environment (production or development)
const nodeEnv = process.env.NODE_ENV || 'dev';

// Choose the appropriate environment file based on NODE_ENV
const envFile = nodeEnv === 'production' ? '.env.prod' : '.env.dev';
const envPath = path.resolve(configDir, envFile);

// Load environment variables from the determined path
dotenv.config({ path: envPath });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});
