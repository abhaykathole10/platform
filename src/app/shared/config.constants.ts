import { PossibleFormation, XyPosition } from '../models/event-data.model';

export const PLAYING: string[] = ['5', '6', '7', '8', '9', '10', '11'];

export const POSSIBLE_FORMATIONS: PossibleFormation = {
  11: [
    '4-3-3',
    '4-4-2',
    '4-2-3-1',
    '4-5-1',
    '4-3-1-2',
    '4-1-4-1',
    '3-4-3',
    '3-5-2',
    '5-4-1',
  ],
  10: ['4-4-1', '3-4-2', '3-5-1', '3-3-3'],
  9: ['4-3-1', '3-3-2', '3-4-1'],
  8: ['3-3-1', '4-2-1', '3-2-2'],
  7: ['2-3-1', '3-2-1'],
  6: ['2-2-1', '3-2', '3-1-1'],
  5: ['2-2', '3-1', '2-1-1'],
};

//  TOP
export const POSITION_Y: XyPosition = {
  1: ['45%'],
  2: ['35%', '55%'],
  3: ['25%', '45%', '65%'],
  4: ['15%', '35%', '55%', '75%'],
  5: ['5%', '25%', '45%', '65%', '85%'],
};

//  LEFT
export const POSITION_X: XyPosition = {
  3: ['25%', '50%', '75%'],
  4: ['20%', '40%', '60%', '80%'],
};
