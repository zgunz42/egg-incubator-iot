import { Incubator } from './incubator.entitiy';
import { IsMACAddress, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncubatorCreateInput implements Partial<Incubator> {
  @IsMACAddress()
  @ApiProperty({
    required: true,
    description: 'id of incubator device (mac id) for now',
    type: String,
  })
  incubatorId: string;

  @IsString()
  @ApiProperty({
    required: true,
    description: 'type of egg like chiken',
    type: String,
  })
  eggType: string;

  @IsString()
  @ApiProperty({
    required: true,
    description: 'model of incubator device',
    type: String,
  })
  model: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
  })
  name: string;

  @IsNumber()
  @Min(15)
  @ApiProperty({
    required: true,
    type: Number,
    minimum: 15,
  })
  duration: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'total turn taken do in one day\nturn will divied evenly',
    minimum: 0,
  })
  turnPerDay: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    required: true,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  avgHumidity: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    minimum: 25,
    maximum: 40,
  })
  avgTemp: number;
}
