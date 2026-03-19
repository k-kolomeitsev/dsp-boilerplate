// @dsp obj-f70c92c9
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalInfraModule, TypeORMInfraModule } from './lib/infra';
import { ExampleModule } from './services/example/example.module';

// @dsp func-f79989f0
@Module({
  imports: [GlobalInfraModule, TypeORMInfraModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
