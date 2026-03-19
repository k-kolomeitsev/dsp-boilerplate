// @dsp obj-eeb1ca96
import { Global, Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3Config } from './s3.config';
import { S3ConfigProxyModule } from './s3.config-module';

// @dsp func-d8b87c72
@Global()
@Module({
  imports: [
    S3ConfigProxyModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (config: S3Config) => {
          return {
            region: config.S3_REGION,
            endpoint: config.S3_ENDPOINT,
            s3ForcePathStyle: true,
            credentials: {
              accessKeyId: config.S3_ACCESS_KEY_ID,
              secretAccessKey: config.S3_SECRET_ACCESS_KEY,
            },
          };
        },
        imports: [S3ConfigProxyModule],
        inject: [S3Config],
      },
    }),
  ],
  exports: [AwsSdkModule, S3ConfigProxyModule],
})
export class S3InfraModule {}
