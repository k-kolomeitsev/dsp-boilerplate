// @dsp obj-5340dda3
import { Module } from '@nestjs/common';
import { RedisConfig } from './redis.config';

@Module({
  providers: [RedisConfig],
  exports: [RedisConfig],
})
export class RedisConfigProxyModule {}
