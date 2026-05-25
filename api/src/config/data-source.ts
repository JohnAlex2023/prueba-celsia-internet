import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Cliente } from '../entities/Cliente';
import { Servicio } from '../entities/Servicio';

dotenv.config();

/**
 * DataSource de TypeORM (patrón Singleton).
 * Centraliza la conexión a MySQL y registra las entidades de la aplicación.
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'celsia',
  password: process.env.DB_PASSWORD || 'celsia123',
  database: process.env.DB_NAME || 'celsia_internet',
  synchronize: true, // En producción usar migraciones
  logging: process.env.NODE_ENV === 'development',
  entities: [Cliente, Servicio],
  charset: 'utf8mb4_unicode_ci',
});
