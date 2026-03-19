// @dsp obj-bc03d959
import { IsString } from 'class-validator';
import { ConfigFragment, EnvValue } from '../common';

// @dsp func-cb6bbb20
export class S3Config extends ConfigFragment {
  @IsString()
  @EnvValue()
  public readonly S3_BUCKET: string;

  @IsString()
  @EnvValue()
  public readonly S3_ENDPOINT: string;

  @IsString()
  @EnvValue()
  public readonly S3_ACCESS_KEY_ID: string;

  @IsString()
  @EnvValue()
  public readonly S3_SECRET_ACCESS_KEY: string;

  @IsString()
  @EnvValue()
  public readonly S3_REGION: string;
}
