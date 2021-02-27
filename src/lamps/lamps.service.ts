import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from 'nest-mqtt';
import { INCUBATOR_LAMP_SWITCH } from 'src/config/topics';
import { LampsSwitchArgs } from './lamps-switch.args';

@Injectable()
export class LampService {
  constructor(private readonly mqttService: MqttService) {}

  async switch(lampswitch: LampsSwitchArgs) {
    const status = await this.mqttService.publish(
      INCUBATOR_LAMP_SWITCH,
      lampswitch.lamps,
    );
    Logger.warn(status);
    if (status.cmd === 'publish') {
      const data = JSON.parse(status.payload.toString());
      return data.status;
    }
  }
}
