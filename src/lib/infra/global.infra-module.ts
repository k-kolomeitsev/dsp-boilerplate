// @dsp obj-7003afc3
import { Global, Module } from '@nestjs/common';
import { GlobalConfig } from './global.config';

// @dsp func-b90339fc
@Global()
@Module({
  providers: [GlobalConfig],
  exports: [GlobalConfig],
})
export class GlobalInfraModule {}
