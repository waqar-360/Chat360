import { Injectable } from '@nestjs/common';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { createDatabase } from 'typeorm-extension';
import { NodeEnv } from '../../utils/enum';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}
  root(): string {
    return process.env.APP_URL;
  }

  /**
   * Configures The App Environment
   * @returns
   */
  static envConfiguration(): string {
    switch (process.env.NODE_ENV) {
      case NodeEnv.TEST:
        return `_${NodeEnv.TEST}.env`;

      default:
        return `.env`;
    }
  }

  /**
   * Create Connection to Database on App Start
   * @returns
   */
  static async createConnection() {
    await createDatabase({ ifNotExist: true });

    return {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + `./../**/**.entity{.ts,.js}`],
      synchronize: `true`,
      extra: {
        connectionLimit: 5,
      },
      logging: false,
    } as TypeOrmModuleAsyncOptions;
  }
}
