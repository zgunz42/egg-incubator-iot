import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe, Payload } from 'nest-mqtt';
import { INCUBATOR_LAMP_REPORT } from 'src/config/topics';
import { LampDocument, LampReport } from './report.entity';

@Injectable()
export class ReportLampService {
  constructor(
    @InjectModel(LampReport.name) private readonly model: Model<LampDocument>,
  ) {}
  @Subscribe({ topic: INCUBATOR_LAMP_REPORT })
  async readReport(@Payload('json') payload: any) {
    const report = await this.model.create(payload);
    return report;
  }
}
