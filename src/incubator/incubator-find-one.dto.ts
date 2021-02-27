import { ApiProperty } from '@nestjs/swagger';
import { IsMACAddress } from 'class-validator';
import { Incubator } from './incubator.entitiy';

export class IncubatorFindOne implements Partial<Incubator> {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsMACAddress()
  incubatorId: string;
}
