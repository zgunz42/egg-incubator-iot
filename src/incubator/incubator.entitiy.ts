import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type IncubatorDocument = Incubator & Document;

@Schema({
  timestamps: true,
})
export class Incubator {
  @Prop({ type: String, required: true, index: true })
  @ApiProperty()
  incubatorId: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  model: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  name: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  eggType: string;

  @Prop({ type: Number, required: true })
  @ApiProperty()
  duration: number;

  @Prop({ type: Number })
  @ApiProperty()
  avgHumidity: number;

  @Prop({ type: Number })
  @ApiProperty()
  avgTemp: number;

  @Prop({ type: Number, required: true })
  @ApiProperty()
  turnPerDay: number;

  @Prop({ type: Number, required: false, default: 0 })
  @ApiProperty()
  totTurnToday: number;

  @Prop({ type: Boolean, default: false })
  @ApiProperty()
  isActive: boolean;

  @Prop({ type: Date, default: false })
  @ApiProperty()
  startDate: Date;
}

export const IncubatorSchema = SchemaFactory.createForClass(Incubator);
