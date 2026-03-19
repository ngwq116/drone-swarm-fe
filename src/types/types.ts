export type TLogs = {
  type: string;
  msg: string;
  time: string;
  id: number;
};

export type TDrones = {
  id: string;
  x: number;
  y: number;
  battery: number;
  status: "ACTIVE" | "CHARGING" | "FAILED" | "STANDBY";
  found: number;
  moves: number;
  sector: string;
  wpIdx: number;
  batch: 1 | 2; // 1 = primary swarm, 2 = backup swarm
};

export type TCell = {
  x: number;
  y: number;
  hazard: boolean;
  visited: boolean;
  survivor: boolean;
  found: boolean;
};

export type TSim = {
  cells: TCell[][];
  drones: TDrones[];
  step: number;
  totalSurvivors: number;
  foundTotal: number;
  complete: boolean;
  backupCount: number; // number of backup drones
  backupDeployStep: number; // sim step number at which backup activates
};
