export class EventData {}
export interface coordinate {
  x: string;
  y: string;
}

export interface DataItem {
  id: string;
  team: string;
  jersey: string;
  name: string;
  event: string;
  subtags: string[];
  start: coordinate;
  end: coordinate;
}

export interface Player {
  id: string;
  jersey: string;
  name: string;
  class: string;
  selected: boolean;
}

export interface Squad {
  player1: Player;
  player2: Player;
  player3: Player;
  player4: Player;
  player5: Player;
  player6: Player;
  player7: Player;
  player8: Player;
  player9: Player;
  player10: Player;
  player11: Player;
  player12: Player;
  player13: Player;
  player14: Player;
  player15: Player;
}

export interface Subtag {
  name: string;
  category: string[];
  disabled: boolean;
  clicked: boolean;
}
