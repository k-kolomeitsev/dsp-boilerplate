// @dsp obj-9d136d41
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsConfig } from './nats.config';
import { NatsConfigProxyModule } from './nats.config-module';

// @dsp func-56e03d64
export const NATS_CLIENT = 'NATS_CLIENT';

// @dsp func-4fe4e38b
@Global()
@Module({
  imports: [
    NatsConfigProxyModule,
    ClientsModule.registerAsync([
      {
        name: NATS_CLIENT,
        imports: [NatsConfigProxyModule],
        inject: [NatsConfig],
        useFactory: (config: NatsConfig) => ({
          transport: Transport.NATS,
          options: config.clientOptions,
        }),
      },
    ]),
  ],
  exports: [ClientsModule, NatsConfigProxyModule],
})
export class NatsInfraModule {}
