// @dsp obj-e9ecbb37
import { IsBoolean, IsInt, IsString, IsOptional } from 'class-validator';
import { ConfigFragment, EnvValue } from '../common';

const DecodeBase64 = (based?: string): string | undefined =>
  based ? Buffer.from(based, 'base64').toString('utf-8') : undefined;

// @dsp func-6c1ab983
export class TypeORMConfig extends ConfigFragment {
  @IsString()
  @EnvValue()
  public readonly POSTGRES_HOST: string;

  @IsInt()
  @EnvValue()
  public readonly POSTGRES_PORT: number;

  @IsString()
  @EnvValue()
  public readonly POSTGRES_DB: string;

  @IsString()
  @EnvValue()
  public readonly POSTGRES_USER: string;

  @IsString()
  @EnvValue()
  public readonly POSTGRES_PASSWORD: string;

  @IsBoolean()
  @EnvValue()
  public readonly TYPEORM_LOGGING: boolean;

  @IsBoolean()
  @EnvValue()
  public readonly TYPEORM_SYNCHRONIZE: boolean;

  @IsBoolean()
  @EnvValue<boolean>({ defaultValue: false })
  public readonly TYPEORM_MIGRATION_RUN: boolean;

  @IsString()
  @IsOptional()
  @EnvValue({ transform: DecodeBase64 })
  public readonly TYPEORM_SSL_CERT?: string;

  get fullConfig() {
    return {
      database: this.POSTGRES_DB,
      username: this.POSTGRES_USER,
      password: this.POSTGRES_PASSWORD,
      host: this.POSTGRES_HOST,
      port: this.POSTGRES_PORT,
      migrationsRun: this.TYPEORM_MIGRATION_RUN,
      synchronize: this.TYPEORM_SYNCHRONIZE,
      logging: this.TYPEORM_LOGGING,
      ssl: this.TYPEORM_SSL_CERT ? { ca: this.TYPEORM_SSL_CERT } : undefined,
    };
  }
}
