import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjectiveController } from './adjectives.controller';
import { AdjectivesService } from './adjectives.service';
import { Adjectives } from './adjectives.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adjectives])],
  controllers: [AdjectiveController],
  providers: [AdjectivesService],
})
export class AdjectivesModule {}