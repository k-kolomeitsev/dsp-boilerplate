// @dsp obj-f9d2ede4
import { UnprocessableEntityException } from '@nestjs/common';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

// @dsp func-1980bbb1
export async function validateResponse<TDto extends object>(
  dto: ClassConstructor<TDto>,
  data: unknown[],
  throwError?: boolean,
): Promise<TDto[]>;
export async function validateResponse<TDto extends object>(
  dto: ClassConstructor<TDto>,
  data: unknown,
  throwError?: boolean,
): Promise<TDto>;
export async function validateResponse<TDto extends object>(
  dto: ClassConstructor<TDto>,
  data: unknown,
  throwError = true,
): Promise<TDto | TDto[]> {
  const result = plainToInstance(dto, data, {
    strategy: 'excludeAll',
    enableImplicitConversion: true,
  }) as TDto | TDto[];

  const errors = Array.isArray(result)
    ? (await Promise.all(result.map((item) => validate(item)))).flat()
    : await validate(result);

  if (errors.length && throwError) {
    throw new UnprocessableEntityException(errors);
  }
  return result;
}
