import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NounsController } from './nouns.controller';
import { NounsService } from './nouns.service';
import { Nouns } from './nouns.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nouns])],
  controllers: [NounsController],
  providers: [NounsService],
})
export class NounsModule {}