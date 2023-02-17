import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { entitiesList, migrationsList } from '../db/entities-migrations.list';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('PG_HOST'),
  port: configService.get<number>('PG_PORT'),
  username: configService.get<string>('PG_USER'),
  password: configService.get<string>('PG_PASSWORD'),
  database: configService.get<string>('PG_DB'),
  entities: entitiesList,
  migrations: migrationsList,
});
