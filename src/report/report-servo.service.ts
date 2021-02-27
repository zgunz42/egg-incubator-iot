import { Injectable, Logger } from '@nestjs/common';
import { Subscribe, Payload } from 'nest-mqtt';
import { INCUBATOR_MOTOR_REPORT } from 'src/config/topics';

@Injectable()
export class ReportServoService {
  @Subscribe({ topic: INCUBATOR_MOTOR_REPORT })
  readReport(@Payload() payload: any) {
    Logger.log(payload);
  }
}
