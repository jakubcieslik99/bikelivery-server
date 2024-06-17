import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB || 'database',
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsRun: process.env.ENV !== 'development' ? true : false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
