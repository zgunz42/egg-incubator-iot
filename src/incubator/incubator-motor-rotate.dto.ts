import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsNumber, Min, Max } from 'class-validator';
import { IncubatorFindOne } from './incubator-find-one.dto';

export class IncubatorMotorRotate extends IncubatorFindOne {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'control speed in second less delay is more speed',
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @IsPositive({ always: false })
  @Min(10)
  @Max(40)
  delay?: number;
}
