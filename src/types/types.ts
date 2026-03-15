export type TLogs = {
    type: string;
    msg: string;
    time: string;
    id: number;
}

export type TDrones = {
  id: string
  x: number
  y: number
  battery: number
  status: string
  found: number
  moves: number
  sector: string
  wpIdx: number
}

export type TCell = {
    x: number,
    y: number
    hazard: boolean
    visited: boolean
    survivor: boolean
    found: boolean
}

export type TSim = {
    cells: TCell[][];
    drones: TDrones[];
    step: number;
    totalSurvivors: number;
    foundTotal: number;
    complete: boolean;
}