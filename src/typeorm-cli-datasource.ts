// @dsp obj-cb3476ce
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

loadEnv();

const decodeBase64 = (value?: string): string | undefined =>
  value ? Buffer.from(value, 'base64').toString('utf-8') : undefined;

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: String(process.env.TYPEORM_LOGGING).toLowerCase() === 'true',
  synchronize: String(process.env.TYPEORM_SYNCHRONIZE).toLowerCase() === 'true',
  migrationsRun:
    String(process.env.TYPEORM_MIGRATION_RUN).toLowerCase() === 'true',
  ssl: process.env.TYPEORM_SSL_CERT
    ? { ca: decodeBase64(process.env.TYPEORM_SSL_CERT) }
    : undefined,
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['src/migrations/*.ts', 'dist/migrations/*.js'],
};

// @dsp func-44ac7468
export const connectionSource = new DataSource(dataSourceOptions);
