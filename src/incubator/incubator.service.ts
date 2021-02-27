import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROTATE_DELAY } from 'src/config/constants';
import { MotorService } from 'src/motor/motor.service';
import { IncubatorCreateInput } from './incubator-create.dto';
import { IncubatorFindOne } from './incubator-find-one.dto';
import { IncubatorMotorRotate } from './incubator-motor-rotate.dto';
import { Incubator, IncubatorDocument } from './incubator.entitiy';
import { ReportService, ReportKind } from '../report/report.service';
import * as luxon from 'luxon';

@Injectable()
export class IncubatorService {
  private logger: Logger = new Logger('IncubatorService');
  constructor(
    @InjectModel(Incubator.name)
    private readonly incModel: Model<IncubatorDocument>,
    private readonly report: ReportService,
    private readonly motor: MotorService,
  ) {}

  async create(doc: IncubatorCreateInput) {
    const incubator = await this.incModel.create({
      ...doc,
      isActive: true,
      startDate: new Date(),
    });

    return incubator;
  }

  async find(doc: IncubatorFindOne) {
    return this.incModel.findOne(doc).exec();
  }

  async findMany() {
    const query = this.incModel.find({ isActive: true });
    // Logger.log('pre findMany');
    try {
      const incs = await query.exec();
      // Logger.log('findMany xx' + incs);
      return incs;
    } catch (error) {
      Logger.log('findMany failed');
    }

    return [];
  }

  async update(doc) {
    //as
  }

  private addDays(date: Date, days: number) {
    const copy = luxon.DateTime.fromJSDate(date);
    const duration = luxon.Duration.fromObject({
      days,
    });
    copy.plus(duration);
    return copy;
  }

  isInactive(incubator: Incubator) {
    const crackDate = this.addDays(incubator.startDate, incubator.duration);
    const today = luxon.DateTime.now();
    if (!incubator.isActive && crackDate.diff(today, 'days').days === 0) {
      return true;
    }
    return false;
  }

  async motorRotate(doc: IncubatorMotorRotate) {
    Logger.log('adjust temp' + doc);
    const incubator = await this.find(doc);
    if (
      incubator.turnPerDay > incubator.totTurnToday &&
      !this.isInactive(incubator)
    ) {
      await this.motor.rotate({
        incubatorId: incubator.incubatorId,
        delay: doc.delay || ROTATE_DELAY,
      });
      return true;
    }
    return false;
  }
  /**
   * adjust the temperature based on last receive
   * @param incubatorId
   */
  async adjustTemperature(doc: IncubatorFindOne) {
    // control the temperatur of incubator
    Logger.log('adjust temp' + doc);
    const incubator = await this.find(doc);
    if (!this.isInactive(incubator)) {
      // get latest temp report with status not null(redis)
      const data = this.report.findAll(ReportKind.INFO, {
        deviceId: incubator.incubatorId,
      });

      Logger.debug(data);
    }
    // by turning on of lamp
    // turn one lamp off if temperature
    // decrease turn one again
    // if temperature decrease again turn on and so on
    // in other increase lamp when touch lower bound of
    // temperature limit
  }
}
