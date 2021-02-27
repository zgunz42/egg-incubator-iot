import { Module } from '@nestjs/common';
import { MotorService } from './motor.service';

@Module({
  providers: [MotorService],
  exports: [MotorService],
})
export class MotorModule {}
