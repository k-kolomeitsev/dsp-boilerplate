// @dsp obj-74f23749
import { Injectable } from '@nestjs/common';

// @dsp func-d309c77c
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
