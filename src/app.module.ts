import { Module, CacheModule } from '@nestjs/common';
import { MqttModule } from 'nest-mqtt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from 'nestjs-redis';
import { IncubatorModule } from './incubator/incubator.module';
import { ReportModule } from './report/report.module';
import { LampsModule } from './lamps/lamps.module';
import { MotorModule } from './motor/motor.module';
import { BullModule } from '@nestjs/bull';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    RedisModule.register({
      host: 'redis-cache',
      db: 0,
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis-cache',
        port: 6379,
      },
    }),
    CacheModule.register(),
    EventEmitterModule.forRoot({
      delimiter: '/',
    }),
    MqttModule.forRoot({
      host: 'mosquitto',
      port: 1883,
      clientId: 'incubator_server' + uuidv4(),
      keepalive: 60,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://mongo-db/incubator'),
    IncubatorModule,
    ReportModule,
    LampsModule,
    MotorModule,
  ],
})
export class AppModule {}
