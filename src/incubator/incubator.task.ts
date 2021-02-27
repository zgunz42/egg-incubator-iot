import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IncubatorService } from './incubator.service';

@Injectable()
export class IncubatorTask {
  constructor(
    private readonly incubatorService: IncubatorService,
    @InjectQueue('incubator-lamp') private readonly lampQue: Queue,
    @InjectQueue('incubator-motor') private readonly motorQue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_SECOND) // check incubator every seconds
  autoAdjustTemp() {
    // Logger.log('getting job ready');

    this.incubatorService.findMany().then((incubators) => {
      incubators.forEach((incubator) => {
        Logger.log('get report await to be send');
        // get report await to be send
        // when send create queue to adjust temp
        this.lampQue.add({
          targetId: incubator.incubatorId,
        });
        this.motorQue.add({
          targetId: incubator.incubatorId,
        });
      });
    });
  }
}
