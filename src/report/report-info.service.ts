import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { Subscribe, Payload, MqttService } from 'nest-mqtt';
import {
  INCUBATOR_INFO,
  INCUBATOR_REPORT,
  REPORT_STREAMS_KEY,
  APPLICATION_ID,
  CONSUMER_ID,
} from 'src/config/topics';
import * as background from 'async';
import { IncubatorInfoDocument, IncubatorInfoReport } from './report.entity';
import * as Redis from 'ioredis';
import * as luxon from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Readable } from 'stream';
import { ReportEventGateway } from './report-event.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { hasOwnProperty } from 'src/utils';
import { report } from 'process';

@Injectable()
export class ReportInfoService {
  client: Redis.Redis;
  channel: Readable;
  constructor(
    private readonly gateway: ReportEventGateway,
    private readonly mqttService: MqttService,
    private readonly redisService: RedisService,
    @InjectModel(IncubatorInfoReport.name)
    private readonly model: Model<IncubatorInfoDocument>,
  ) {}

  async onModuleInit() {
    this.client = this.redisService.getClient();
    try {
      await this.client.xgroup(
        'CREATE',
        REPORT_STREAMS_KEY,
        APPLICATION_ID,
        '$',
        'MKSTREAM',
      );
    } catch (error) {
      Logger.warn(`Group ${APPLICATION_ID} already exists ${error}`);
    }
  }

  @Subscribe({ topic: INCUBATOR_REPORT })
  readReport(@Payload('json') payload: any) {
    this.client.xadd(
      REPORT_STREAMS_KEY,
      '*',
      'report',
      JSON.stringify({ ...payload, receiveDate: luxon.DateTime.now().toISO() }),
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sumInfo() {
    // let myid,
    //   lastid = '0-0',
    //   checkBacklog = true;
    // if (checkBacklog) {
    //   myid = lastid;
    // } else {
    //   myid = '>';
    // }

    const reply = await this.client.xreadgroup(
      'GROUP',
      APPLICATION_ID,
      CONSUMER_ID,
      'COUNT',
      60,
      'BLOCK',
      0,
      'STREAMS',
      REPORT_STREAMS_KEY,
      '>',
    );
    if (!reply) {
      return;
    }
    const results = reply[0][1];
    const { length } = results;
    // Logger.log(reply);
    const reports = results.map((message: any) => {
      // convert the message into a JSON Object
      const id = message[0];
      const values = message[1];
      const msgObject: { id: string; report?: Partial<IncubatorInfoReport> } = {
        id: id,
      };
      this.client.xack(REPORT_STREAMS_KEY, APPLICATION_ID, id);
      for (let i = 0; i < values.length; i = i + 2) {
        msgObject[values[i]] = values[i + 1];
      }
      if (hasOwnProperty(msgObject, 'report')) {
        msgObject.report = JSON.parse(msgObject.report);
      }
      return msgObject;
    });
    Logger.warn(
      'Has total ' + reports.length + ' on ' + reply[0][0] + reply[0][1].length,
    );

    if (length) {
      const summary = reports
        .filter((data) => data.report.dhcstatus !== 'TIMEOUT')
        .reduce(
          (acc, val, index, arr) => {
            let temperature = val.report.temperature + acc.temperature;
            let humidity = val.report.humidity + acc.humidity;
            let waterlevel = val.report.waterlevel + acc.waterlevel;

            if (index === arr.length - 1) {
              temperature = this.round2(temperature / arr.length);
              humidity = this.round2(humidity / arr.length);
              waterlevel = this.round2(waterlevel / arr.length);
            }

            return {
              id: val.id,
              ...acc,
              ...val.report,
              temperature,
              humidity,
              waterlevel,
            };
          },
          {
            humidity: 0,
            temperature: 0,
            waterlevel: 0,
            sum: luxon.DateTime.now().toISO(),
          },
        );
      this.gateway.server.emit('pullback', summary);
      // lastid = results[length - 1][0];
      // Logger.warn(lastid + 'on' + reply);
      // Logger.warn('on' + reply);
    }
  }

  round2(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  /**
   * sum daily report on the redis and save into
   * database
   */
  @Cron(CronExpression.EVERY_SECOND)
  pingInfo() {
    this.mqttService.publish(INCUBATOR_INFO, {
      all: true,
    });
  }
}
