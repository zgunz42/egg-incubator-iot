import { Position } from './lamps.interface';
export type LampToggle = {
  target: Position;
  shine: boolean;
};

export type LampsSwitchArgs = {
  incubatorId: string;
  lamps: LampToggle[];
};
