import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { IncubatorService } from './incubator.service';
@Processor('incubator-lamp')
export class IncubatorTempProcess {
  constructor(private readonly incubatorService: IncubatorService) {}

  @Process()
  async process(job: Job<any>) {
    //as
    job.progress(0);
    const incubId = job.data.id;
    if (incubId) {
      const isAdjusted = await this.incubatorService.adjustTemperature(incubId);
      job.progress(100);
      return { targetId: incubId, isAdjusted };
    }
    job.progress(100);
    return { targetId: incubId, isAdjusted: false };
  }
}

@Processor('incubator-motor')
export class IncubatorMotorProcess {
  constructor(private readonly incubatorService: IncubatorService) {}

  @Process()
  async process(job: Job<any>) {
    //as
    job.progress(0);
    const incubId = job.data.id;
    if (incubId) {
      const isAdjusted = await this.incubatorService.motorRotate({
        incubatorId: incubId,
      });
      job.progress(100);
      return { targetId: incubId, isAdjusted };
    }
    job.progress(100);
    return { targetId: incubId, isAdjusted: false };
  }
}
