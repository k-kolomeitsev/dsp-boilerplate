// @dsp obj-631a9a68
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './typeorm.config';
import * as Entities from '../entity';

/**
 * # Module, providing Typeorm database for the application.
 */
// @dsp func-9d9337db
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        {
          module: class TypeORMConfigProxyModule {},
          providers: [TypeORMConfig],
          exports: [TypeORMConfig],
        },
      ],
      inject: [TypeORMConfig],
      useFactory: (config: TypeORMConfig) => {
        const entities = Object.keys(Entities).map(
          (entityKey) =>
            (Entities as unknown as { [key: string]: any })[entityKey],
        );
        return {
          type: 'postgres',
          ...config.fullConfig,
          entities,
          migrations: [],
        } as any;
      },
    }),
  ],
})
export class TypeORMInfraModule {}
