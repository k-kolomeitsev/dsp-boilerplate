// @dsp obj-ef8b7e6c
import { Module } from '@nestjs/common';
import { S3Config } from './s3.config';

@Module({
  providers: [S3Config],
  exports: [S3Config],
})
export class S3ConfigProxyModule {}
