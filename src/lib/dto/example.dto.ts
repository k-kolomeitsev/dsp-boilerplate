// @dsp obj-828ae47c
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// @dsp func-240c9a44
export class CreateExampleDto {
  @ApiProperty({ description: 'Name', example: 'My Example' })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'Some description',
  })
  @IsOptional()
  @IsString()
  public description?: string;
}

// @dsp func-6aa91ebb
export class ExampleResponseDto {
  @Expose()
  @ApiProperty({ description: 'Record ID', example: '1' })
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @Expose()
  @ApiProperty({ description: 'Name', example: 'My Example' })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Description',
    example: 'Some description',
  })
  @IsOptional()
  @IsString()
  public description!: string | null;

  @Expose()
  @ApiProperty({ description: 'Creation date' })
  public createdAt!: Date;
}
