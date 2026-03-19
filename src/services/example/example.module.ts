// @dsp obj-2874daa6
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from '../../lib/entity';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

// @dsp func-c54a2c1b
@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {
  public static readonly appService = 'api' as const;
}
