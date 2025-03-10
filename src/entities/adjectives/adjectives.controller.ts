// src/adjectives/adjectives.controller.ts

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
  
  import { AdjectivesService } from './adjectives.service';
  import { Adjectives } from './adjectives.entity';
  
  @Controller('adjectives')
  export class AdjectivesController {
    private readonly logger = new Logger(AdjectivesController.name); // Create Logger Instance
  
    constructor(private readonly adjectivesService: AdjectivesService) {}
  
    @Post()
    async create(@Body() adjectiveData: Partial<Adjectives>): Promise<Adjectives> {
      this.logger.log(`POST /adjectives - Creating adjective: ${JSON.stringify(adjectiveData)}`);
      const createdAdjective = await this.adjectivesService.create(adjectiveData);
      this.logger.log(`POST /adjectives - Adjective created: ${JSON.stringify(createdAdjective)}`);
      return createdAdjective;
    }
  
    @Get()
    async findAll(): Promise<Adjectives[]> {
      this.logger.log('GET /adjectives - Fetching all adjectives');
      const adjectives = await this.adjectivesService.findAll();
      this.logger.log(`GET /adjectives - Found ${adjectives.length} adjectives`);
      return adjectives;
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Adjectives> {
      this.logger.log(`GET /adjectives/${id} - Fetching adjective with ID: ${id}`);
      const adjective = await this.adjectivesService.findOne(id);
      if (!adjective) {
        this.logger.warn(`GET /adjectives/${id} - Adjective with ID ${id} not found`);
        throw new NotFoundException(`Adjective with ID ${id} not found`);
      }
      this.logger.log(`GET /adjectives/${id} - Found adjective: ${JSON.stringify(adjective)}`);
      return adjective;
    }
  
    @Put(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() adjectiveData: Partial<Adjectives>,
    ): Promise<Adjectives> {
      this.logger.log(`PUT /adjectives/${id} - Updating adjective with ID: ${id}, data: ${JSON.stringify(adjectiveData)}`);
      const updatedAdjective = await this.adjectivesService.update(id, adjectiveData);
      if (!updatedAdjective) {
        this.logger.warn(`PUT /adjectives/${id} - Adjective with ID ${id} not found`);
        throw new NotFoundException(`Adjective with ID ${id} not found`);
      }
      this.logger.log(`PUT /adjectives/${id} - Adjective updated: ${JSON.stringify(updatedAdjective)}`);
      return updatedAdjective;
    }
  
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      this.logger.log(`DELETE /adjectives/${id} - Deleting adjective with ID: ${id}`);
      await this.adjectivesService.delete(id);
      this.logger.log(`DELETE /adjectives/${id} - Adjective with ID: ${id} deleted`);
    }
  }