// @dsp obj-8a0d5cb4
import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfig } from './redis.config';
import { RedisConfigProxyModule } from './redis.config-module';
import { RedisLogsService } from './redis-logs.service';

/**
 * # Module, providing Redis for the application.
 */
// @dsp func-e72988c4
@Global()
@Module({
  imports: [
    RedisConfigProxyModule,
    RedisModule.forRootAsync({
      imports: [RedisConfigProxyModule],
      useFactory: (configService: RedisConfig) => ({
        type: 'single',
        options: configService.redisOptions,
      }),
      inject: [RedisConfig],
    }),
  ],
  providers: [RedisLogsService],
  exports: [RedisModule, RedisConfigProxyModule, RedisLogsService],
})
export class RedisInfraModule {}
