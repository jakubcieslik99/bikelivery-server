import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export default (config: ConfigService<unknown, boolean>) =>
  ({
    origin: (origin, callback) => {
      const allowedOrigins = [
        `http://localhost:${config.get('app.port')}`,
        `http://127.0.0.1:${config.get('app.port')}`,
        `http://${config.get('app.host')}:${config.get('app.port')}`,
        config.get('cors.apiUrl'),
        config.get('cors.appUrl'),
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || (!origin && config.get('app.env') !== 'production')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }) as CorsOptions;
