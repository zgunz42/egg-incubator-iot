import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from 'nest-mqtt';
import { INCUBATOR_MOTOR_ROTATE } from 'src/config/topics';
import { MotorRotateArgs } from './motor-rotate.args';

@Injectable()
export class MotorService {
  constructor(private readonly mqttService: MqttService) {}

  async rotate(args: MotorRotateArgs) {
    const status = await this.mqttService.publish(INCUBATOR_MOTOR_ROTATE, args);
    Logger.log(status);
    if (status.cmd === 'publish') {
      const data = JSON.parse(status.payload.toString());
      return data.status;
    }
  }
}
