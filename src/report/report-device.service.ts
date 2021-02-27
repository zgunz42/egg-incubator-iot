import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe, Payload } from 'nest-mqtt';
import { REPORT } from 'src/config/topics';
import { IncubatorDocument, IncubatorReport } from './report.entity';

@Injectable()
export class ReportDeviceService {
  constructor(
    @InjectModel(IncubatorReport.name)
    private readonly model: Model<IncubatorDocument>,
  ) {}

  @Subscribe({ topic: REPORT })
  async readReport(@Payload('json') payload: any) {
    const report = await this.model.create(payload);
    return report;
  }
}
