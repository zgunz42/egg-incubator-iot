import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DhcStatus } from 'src/lamps/dhc-sensor';
import { Shine } from 'src/lamps/lamps.interface';

@Schema({
  timestamps: true,
})
export class Report {
  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  kind: string;
}

export type LampDocument = LampReport & Document;

export class LampReport extends Report {
  @Prop({ type: Boolean, required: true })
  status: boolean;
}

export const LampSchema = SchemaFactory.createForClass(LampReport);

export type MotorDocument = MotorReport & Document;

export class MotorReport extends Report {
  @Prop({ type: Number })
  isRotate: number; // TODO: change this name into rotation
}

export const MotorSchema = SchemaFactory.createForClass(MotorReport);

@Schema()
class LampsReport {
  @Prop({ type: Shine, enum: [Shine.ON, Shine.OFF] })
  left: Shine;
  @Prop({ type: Shine, enum: [Shine.ON, Shine.OFF] })
  right: Shine;
  @Prop({ type: Shine, enum: [Shine.ON, Shine.OFF] })
  center: Shine;
}

export type IncubatorDocument = IncubatorReport & Document;

export class IncubatorReport extends Report {
  @Prop()
  status: boolean;
}

export const IncubatorSchema = SchemaFactory.createForClass(IncubatorReport);

export type IncubatorInfoDocument = IncubatorInfoReport & Document;

export class IncubatorInfoReport extends Report {
  @Prop()
  humidity: number | null;
  @Prop()
  temperature: number | null;

  @Prop({ type: DhcStatus, enum: [DhcStatus.OK, DhcStatus.TIMEOUT] })
  dhcstatus: DhcStatus;
  waterlevel: number;
  @Prop({ type: LampsReport })
  lampStats: LampsReport;
  @Prop({ type: Number })
  motorDirection: number;
}

export const IncubatorInfoSchema = SchemaFactory.createForClass(
  IncubatorInfoReport,
);
