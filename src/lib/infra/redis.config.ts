// @dsp obj-f7c2e816
import { RedisOptions } from 'ioredis';
import { IsInt, IsString, IsOptional } from 'class-validator';
import { EnvValue, ConfigFragment } from '../common';

function convertCredEnv(value: string) {
  const cleanValue = String(value).trim().toLowerCase();
  if (cleanValue === 'no') {
    return undefined;
  }
  return value;
}

// @dsp func-bea93fd1
export class RedisConfig extends ConfigFragment {
  @IsString()
  @IsOptional()
  @EnvValue({ transform: convertCredEnv })
  public readonly REDIS_USER?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ transform: convertCredEnv })
  public readonly REDIS_PASSWORD?: string;

  @IsString()
  @EnvValue({ defaultValue: 'localhost' })
  public readonly REDIS_HOST: string;

  @IsInt()
  @EnvValue({ defaultValue: 6379 })
  public readonly REDIS_PORT: number;

  get redisOptions(): RedisOptions {
    return {
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
      ...(this.REDIS_USER && { username: this.REDIS_USER }),
      ...(this.REDIS_PASSWORD && { password: this.REDIS_PASSWORD }),
    };
  }
}
