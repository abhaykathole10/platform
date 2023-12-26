import { GoalArea, Player, Subtag } from '../models/event-data.model';

export const ALLPLAYERS: Player[] = [
  { id: 'p0', jersey: 'fc', name: 'baller', class: 'p0', selected: false },
  { id: 'p1', jersey: '25', name: 'Buffon', class: 'p1', selected: false },
  { id: 'p2', jersey: '12', name: 'Camavinga', class: 'p2', selected: false },
  { id: 'p3', jersey: '5', name: 'Maguire', class: 'p3', selected: false },
  { id: 'p4', jersey: '2', name: 'Saliba', class: 'p4', selected: false },
  { id: 'p5', jersey: '66', name: 'Trent', class: 'p5', selected: false },
  { id: 'p6', jersey: '22', name: 'Isco', class: 'p6', selected: false },
  { id: 'p7', jersey: '41', name: 'Rice', class: 'p7', selected: false },
  { id: 'p8', jersey: '10', name: 'Zidane', class: 'p8', selected: false },
  { id: 'p9', jersey: '7', name: 'Grealish', class: 'p9', selected: false },
  { id: 'p10', jersey: '9', name: 'Halland', class: 'p10', selected: false },
  { id: 'p11', jersey: '11', name: 'Salah', class: 'p11', selected: false },
];

export const ALLSUBTAGS: Subtag[] = [
  // FOOT
  {
    type: 'Foot',
    name: 'Right',
    category: ['Shot', 'Save', 'Cross'],
    disabled: true,
    clicked: false,
    bgColor: '#884dff',
  },
  {
    type: 'Foot',
    name: 'Left',
    category: ['Shot', 'Save', 'Cross'],
    disabled: true,
    clicked: false,
    bgColor: '#884dff',
  },
  {
    type: 'Foot',
    name: 'Middle',
    category: ['Shot', 'Save', 'Cross'],
    disabled: true,
    clicked: false,
    bgColor: '#884dff',
  },
  {
    type: 'Foot',
    name: 'Header',
    category: ['Shot'],
    disabled: true,
    clicked: false,
    bgColor: '#884dff',
  },

  // COMPLETION
  {
    type: 'Completion',
    name: 'Complete',
    category: ['Pass', 'Take On', 'Tackle', 'Long Kick'],
    disabled: true,
    clicked: false,
    bgColor: '#99004d',
  },
  {
    type: 'Completion',
    name: 'Incomplete',
    category: ['Pass', 'Take On', 'Tackle', 'Long Kick'],
    disabled: true,
    clicked: false,
    bgColor: '#99004d',
  },

  // OUTCOME
  {
    type: 'Outcome',
    name: 'Goal',
    category: ['Shot', 'Free Kick', 'Penalty', 'Save'],
    disabled: true,
    clicked: false,
    bgColor: '#ff1a8c',
  },
  {
    type: 'Outcome',
    name: 'Off Target',
    category: ['Shot', 'Penalty'],
    disabled: true,
    clicked: false,
    bgColor: '#ff1a8c',
  },
  {
    type: 'Outcome',
    name: 'Blocked',
    category: ['Shot', 'Penalty'],
    disabled: true,
    clicked: false,
    bgColor: '#ff1a8c',
  },
  {
    type: 'Outcome',
    name: 'Saved',
    category: ['Shot', 'Penalty', 'Save'],
    disabled: true,
    clicked: false,
    bgColor: '#ff1a8c',
  },
  {
    type: 'Outcome',
    name: 'Yellow Card',
    category: ['Foul'],
    disabled: true,
    clicked: false,
    bgColor: '#ff1a8c',
  },
  {
    type: 'Outcome',
    name: 'Red Card',
    category: ['Foul'],
    disabled: true,
    clicked: false,
    bgColor: '#ff1a8c',
  },

  // KEY PASS (boolean)
  {
    type: 'Key Pass',
    name: 'Key Pass',
    category: ['Pass', 'Long Kick', 'Cross', 'Free Kick', 'Corner'],
    disabled: true,
    clicked: false,
    bgColor: '#00b359',
  },

  // ASSIST (boolean)
  {
    type: 'Assist',
    name: 'Assist',
    category: ['Pass', 'Long Kick', 'Cross', 'Free Kick', 'Corner'],
    disabled: true,
    clicked: false,
    bgColor: '#00b359',
  },

  // THROUGH PASS (boolean)
  {
    type: 'Through Pass',
    name: 'Through Pass',
    category: ['Pass'],
    disabled: true,
    clicked: false,
    bgColor: '#00b359',
  },

  // CLEARANCE
  {
    type: 'Clearance',
    name: 'Clearance',
    category: ['Pass', 'Interception'],
    disabled: true,
    clicked: false,
    bgColor: '#00b359',
  },

  // HAND FOUL
  {
    type: 'Hand Foul',
    name: 'Hand Ball',
    category: ['Foul'],
    disabled: true,
    clicked: false,
    bgColor: '#00bfff',
  },

  //other
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
  {
    type: 'none',
    name: 'none',
    category: ['pass'],
    disabled: true,
    clicked: false,
    bgColor: '#a3c2c2',
  },
];

export const ALLGOALAREAS: GoalArea[] = [
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Top left',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Top',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Top right',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Left',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Middle',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Right',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Bottom left',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Bottom',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'Bottom right',
    category: 'goal',
    disabled: true,
    clicked: false,
  },
  {
    name: 'post',
    category: 'post',
    disabled: true,
    clicked: false,
  },
];
