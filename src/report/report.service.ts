import { Injectable } from '@nestjs/common';

export enum ReportKind {
  DEVICE,
  INFO,
  LAMP,
  SERVO,
}
@Injectable()
export class ReportService {
  findOne(kind: ReportKind, filter: any) {
    return {};
  }

  findAll(kind: ReportKind, filter: any) {
    return [];
  }

  saveReport(kind: ReportKind, data: any) {
    return true;
  }
}
