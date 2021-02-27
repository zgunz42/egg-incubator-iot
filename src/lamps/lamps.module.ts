import { Module } from '@nestjs/common';
import { LampService } from './lamps.service';

@Module({
  controllers: [],
  providers: [LampService],
})
export class LampsModule {}
