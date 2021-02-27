import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncubatorModule } from 'src/incubator/incubator.module';
import { ReportInfoService } from './report-info.service';
import { ReportServoService } from './report-servo.service';
import { ReportDeviceService } from './report-device.service';
import { ReportLampService } from './report-lamp.service';
import { ReportController } from './report.controller';
import {
  IncubatorInfoSchema,
  IncubatorInfoReport,
  IncubatorSchema,
  IncubatorReport,
  LampSchema,
  LampReport,
  MotorSchema,
  MotorReport,
} from './report.entity';
import { ReportEventGateway } from './report-event.gateway';
import { ReportService } from './report.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IncubatorInfoReport.name, schema: IncubatorInfoSchema },
      { name: IncubatorReport.name, schema: IncubatorSchema },
      { name: LampReport.name, schema: LampSchema },
      { name: MotorReport.name, schema: MotorSchema },
    ]),
    forwardRef(() => IncubatorModule),
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    ReportInfoService,
    ReportServoService,
    ReportDeviceService,
    ReportLampService,
    ReportEventGateway,
  ],
  exports: [
    ReportService,
    ReportInfoService,
    ReportServoService,
    ReportDeviceService,
    ReportLampService,
    ReportEventGateway,
  ],
})
export class ReportModule {}
