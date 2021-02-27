import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { IncubatorCreateInput } from './incubator-create.dto';
import { IncubatorMotorRotate } from './incubator-motor-rotate.dto';
import { Incubator } from './incubator.entitiy';
import { IncubatorService } from './incubator.service';

@ApiTags('incubator')
@Controller('incubator')
export class IncubatorController {
  constructor(private readonly service: IncubatorService) {}

  @ApiCreatedResponse({ type: Incubator })
  @Post()
  async create(@Body() data: IncubatorCreateInput): Promise<Incubator> {
    return this.service.create(data);
  }

  @ApiResponse({ type: Incubator, isArray: true })
  @Get('collection')
  async getAll() {
    return this.service.findMany();
  }

  @ApiCreatedResponse({ type: Incubator })
  @ApiOkResponse({ type: Incubator })
  @Get('turn-egg')
  async doTurnEgg(@Param() params: IncubatorMotorRotate) {
    return this.service.motorRotate(params);
  }
}
