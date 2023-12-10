export class EventData {}
export interface coordinate {
  x: string;
  y: string;
}

export interface DataItem {
  team: string;
  jersey: string;
  name: string;
  event: string;
  subtag: string;
  start: coordinate;
  end: coordinate;
}

export interface Player {
  jersey: string;
  name: string;
  class: string;
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

// export class Player {
//   constructor(public jersey: string = '', public name: string = '') {}
// }

// export class Squad {
//   constructor(
//     public goalKeeper: Player,
//     public player1: Player,
//     public player2: Player,
//     public player3: Player,
//     public player4: Player,
//     public player5: Player,
//     public player6: Player,
//     public player7: Player,
//     public player8: Player,
//     public player9: Player,
//     public layer10: Player,
//     public layer11: Player,
//     public layer12: Player,
//     public layer13: Player,
//     public layer14: Player,
//     public player15: Player
//   ) {}
// }
