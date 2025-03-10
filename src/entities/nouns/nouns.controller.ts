// src/nouns/nouns.controller.ts

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    NotFoundException,
    Logger, // Import Logger
  } from '@nestjs/common';
  
  import { NounsService } from './nouns.service';
  import { Nouns } from './nouns.entity';
  
  @Controller('nouns')
  export class NounsController {
    private readonly logger = new Logger(NounsController.name); // Create Logger Instance
  
    constructor(private readonly nounsService: NounsService) {}
  
    @Post()
    async create(@Body() nounData: Partial<Nouns>): Promise<Nouns> {
      this.logger.log(`POST /nouns - Creating noun: ${JSON.stringify(nounData)}`);
      const createdNoun = await this.nounsService.create(nounData);
      this.logger.log(`POST /nouns - Noun created: ${JSON.stringify(createdNoun)}`);
      return createdNoun;
    }
  
    @Get()
    async findAll(): Promise<Nouns[]> {
      this.logger.log('GET /nouns - Fetching all nouns');
      const nouns = await this.nounsService.findAll();
      this.logger.log(`GET /nouns - Found ${nouns.length} nouns`);
      return nouns;
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Nouns> {
      this.logger.log(`GET /nouns/${id} - Fetching noun with ID: ${id}`);
      const noun = await this.nounsService.findOne(id);
      if (!noun) {
        this.logger.warn(`GET /nouns/${id} - Noun with ID ${id} not found`);
        throw new NotFoundException(`Noun with ID ${id} not found`);
      }
      this.logger.log(`GET /nouns/${id} - Found noun: ${JSON.stringify(noun)}`);
      return noun;
    }
  
    @Put(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() nounData: Partial<Nouns>,
    ): Promise<Nouns> {
      this.logger.log(`PUT /nouns/${id} - Updating noun with ID: ${id}, data: ${JSON.stringify(nounData)}`);
      const updatedNoun = await this.nounsService.update(id, nounData);
      if (!updatedNoun) {
        this.logger.warn(`PUT /nouns/${id} - Noun with ID ${id} not found`);
        throw new NotFoundException(`Noun with ID ${id} not found`);
      }
      this.logger.log(`PUT /nouns/${id} - Noun updated: ${JSON.stringify(updatedNoun)}`);
      return updatedNoun;
    }
  
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      this.logger.log(`DELETE /nouns/${id} - Deleting noun with ID: ${id}`);
      await this.nounsService.delete(id);
      this.logger.log(`DELETE /nouns/${id} - Noun with ID: ${id} deleted`);
    }
  }