import { LogLevel } from '@nestjs/common';

export const devLogLevels: LogLevel[] = [
  'error',
  'warn',
  'log',
  'verbose',
  'debug',
];
export const prodLogLevels: LogLevel[] = ['error', 'warn'];
