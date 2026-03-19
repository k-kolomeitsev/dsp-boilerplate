// @dsp obj-204bf1d0
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { validateResponse } from '../../lib/common';
import {
  CreateExampleDto,
  ExampleResponseDto,
} from '../../lib/dto/example.dto';
import { ExampleService } from './example.service';

// @dsp func-13cf8edb
@ApiTags('examples')
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @ApiOperation({ summary: 'Create a record' })
  @ApiCreatedResponse({ type: ExampleResponseDto })
  @Post()
  async create(@Body() dto: CreateExampleDto): Promise<ExampleResponseDto> {
    const result = await this.exampleService.create(dto);
    return validateResponse(ExampleResponseDto, result);
  }

  @ApiOperation({ summary: 'Get all records' })
  @ApiOkResponse({ type: ExampleResponseDto, isArray: true })
  @Get()
  async findAll(): Promise<ExampleResponseDto[]> {
    const result = await this.exampleService.findAll();
    return validateResponse(ExampleResponseDto, result);
  }

  @ApiOperation({ summary: 'Get record by ID' })
  @ApiOkResponse({ type: ExampleResponseDto })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExampleResponseDto> {
    const result = await this.exampleService.findOne(id);
    return validateResponse(ExampleResponseDto, result);
  }

  @ApiOperation({ summary: 'Delete a record' })
  @ApiNoContentResponse({ description: 'Record deleted' })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.exampleService.remove(id);
  }
}
