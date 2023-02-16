import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('PG_HOST'),
    port: configService.get<number>('PG_PORT'),
    username: configService.get<string>('PG_USER'),
    password: configService.get<string>('PG_PASSWORD'),
    database: configService.get<string>('PG_DB'),
    autoLoadEntities: true,
    synchronize: false,
    //synchronize: true,
    logging: configService.get<string>('ENV') === 'dev' ? true : false,
  }),
};
