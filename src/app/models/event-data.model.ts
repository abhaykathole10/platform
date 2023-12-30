export class EventData {}
export interface Coordinate {
  x: string;
  y: string;
}

export interface DataItem {
  id: string;
  team: string;
  time: string;
  jersey: string;
  name: string;
  event: string;
  start: Coordinate;
  end: Coordinate;
  subEvents: SubEvents;
  goalArea: string;
}

export interface Player {
  id: string;
  jersey: string;
  name: string;
  class: string;
  selected: boolean;
}

export interface Subtag {
  type: string;
  name: string;
  category: string[];
  disabled: boolean;
  clicked: boolean;
  bgColor: string;
}

export interface SubEvents {
  foot: string;
  outcome: string;
  keypass: boolean;
  assist: boolean;
  throughpass: boolean;
  clearance: boolean;
  takeon: boolean;
  handfoul: boolean;
}

export interface GoalArea {
  name: string;
  category: string;
  disabled: boolean;
  clicked: boolean;
}
