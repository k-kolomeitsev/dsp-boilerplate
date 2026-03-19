// @dsp obj-24b29166
import { Module } from '@nestjs/common';
import { NatsConfig } from './nats.config';

@Module({
  providers: [NatsConfig],
  exports: [NatsConfig],
})
export class NatsConfigProxyModule {}
