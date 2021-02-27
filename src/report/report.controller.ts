import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ReportService } from './report.service';

@swagger.ApiTags('reports')
@common.Controller('reports')
export class ReportController {
  constructor(private readonly report: ReportService) {}

  // getallreport
  // get info report
}
