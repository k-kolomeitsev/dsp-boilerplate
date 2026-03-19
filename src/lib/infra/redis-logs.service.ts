// @dsp obj-8447460e
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { LogChannelName } from '../common';

// @dsp func-76aa5bd3
@Injectable()
export class RedisLogsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async sendLog(message: string) {
    await this.redis.publish(LogChannelName, message);
  }
}
