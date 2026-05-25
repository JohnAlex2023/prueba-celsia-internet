import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { AppDataSource } from './config/data-source';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

function createApp(): Application {
  const app = express();

  // Seguridad y middlewares de transporte
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('combined'));

  // Rutas
  app.use('/api/v1', routes);

  // Manejo de errores (siempre al final)
  app.use(errorHandler);

  return app;
}

async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    // eslint-disable-next-line no-console
    console.log('[DB] Conexión establecida con MySQL');

    const app = createApp();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[API] Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[BOOT] Error iniciando la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
