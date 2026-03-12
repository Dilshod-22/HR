import 'dotenv/config';
import { DataSource } from 'typeorm';
import { InitialSchema1739112000000 } from './migrations/1739112000000-InitialSchema';
import { ContractsAndCustomers1739120000000 } from './migrations/1739120000000-ContractsAndCustomers';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'crud_full',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [InitialSchema1739112000000, ContractsAndCustomers1739120000000],
  synchronize: false,
});
