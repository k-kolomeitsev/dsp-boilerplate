// @dsp obj-62f6fe25
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Example } from '../../lib/entity';
import { CreateExampleDto } from '../../lib/dto/example.dto';

// @dsp func-091e2e49
@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly repo: Repository<Example>,
  ) {}

  async create(dto: CreateExampleDto): Promise<Example> {
    const entity = this.repo.create({
      name: dto.name,
      description: dto.description ?? null,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<Example[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Example> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Example #${id} not found`);
    }
    return entity;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }
}
