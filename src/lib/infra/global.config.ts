// @dsp obj-ceb2475e
import { IsNumber, IsString } from 'class-validator';
import { EnvValue, ConfigFragment } from '../common';

export const APP_SERVICE_DEFAULT = 'api';

// @dsp func-c5e53b43
export class GlobalConfig extends ConfigFragment {
  @IsString()
  @EnvValue()
  public readonly APP_ENV: string;

  @IsNumber()
  @EnvValue({ defaultValue: 3000 })
  public readonly APP_PORT: number;

  @IsString()
  @EnvValue({
    defaultValue: `http://localhost:${process.env.APP_PORT}`,
    transform: (raw) => String(raw).trim().replace(/\/+$/g, ''),
  })
  public readonly APP_HOST: string;

  @IsString()
  @EnvValue({ defaultValue: 'api' })
  public readonly APP_PREFIX: string;

  @IsString()
  @EnvValue({ defaultValue: APP_SERVICE_DEFAULT })
  public readonly APP_SERVICE: string;

  get isProd() {
    return this.APP_ENV === 'prod';
  }
}
