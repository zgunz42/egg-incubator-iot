import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncubatorService } from './incubator.service';
import { Incubator, IncubatorSchema } from './incubator.entitiy';
import { LampsModule } from 'src/lamps/lamps.module';
import { MotorModule } from 'src/motor/motor.module';
import { IncubatorController } from './incubator.controller';
import {
  IncubatorMotorProcess,
  IncubatorTempProcess,
} from './incubator.process';
import { IncubatorTask } from './incubator.task';
import { ReportModule } from 'src/report/report.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'incubator-motor',
    }),
    BullModule.registerQueue({
      name: 'incubator-lamp',
    }),
    MongooseModule.forFeature([
      { name: Incubator.name, schema: IncubatorSchema },
    ]),
    LampsModule,
    MotorModule,
    forwardRef(() => ReportModule),
  ],
  controllers: [IncubatorController],
  providers: [
    IncubatorService,
    IncubatorTask,
    IncubatorMotorProcess,
    IncubatorTempProcess,
  ],
  exports: [IncubatorService],
})
export class IncubatorModule {}
