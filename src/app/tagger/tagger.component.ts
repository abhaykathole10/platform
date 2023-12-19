import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  DataItem,
  Player,
  Subtag,
  coordinate,
} from '../models/event-data.model';
import { EventService } from '../services/event.service';
import { PlayersService } from '../services/players.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.css'],
})
export class TaggerComponent {
  private playerDataSubscription: Subscription;
  allPlayers: Player[] = [];

  allSubTags: Subtag[] = [
    // PASS
    {
      name: 'Assist',
      category: ['Pass', 'Long Kick', 'Cross', 'Free Kick', 'Corner'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Key Pass',
      category: ['Pass', 'Long Kick', 'Cross', 'Free Kick', 'Corner'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Through Pass',
      category: ['Pass'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Clearance',
      category: ['Pass', 'Interception'],
      disabled: true,
      clicked: false,
    },

    // SHOT
    {
      name: 'Goal',
      category: ['Shot', 'Free Kick', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Off Target',
      category: ['Shot', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Blocked',
      category: ['Shot', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Saved',
      category: ['Shot', 'Penalty'],
      disabled: true,
      clicked: false,
    },

    // FOOT
    {
      name: 'Right',
      category: ['Shot', 'Save', 'Take On', 'Cross'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Left',
      category: ['Shot', 'Save', 'Take On', 'Cross'],
      disabled: true,
      clicked: false,
    },
    { name: 'Header', category: ['Shot'], disabled: true, clicked: false },

    // FOUL
    { name: 'Yellow Card', category: ['Foul'], disabled: true, clicked: false },
    { name: 'Red Card', category: ['Foul'], disabled: true, clicked: false },
    { name: 'Hand Ball', category: ['Foul'], disabled: true, clicked: false },

    // COMPLETION
    {
      name: 'Complete',
      category: ['Pass', 'Take On', 'Tackle', 'Long Kick'],
      disabled: true,
      clicked: false,
    },
    {
      name: 'Incomplete',
      category: ['Pass', 'Take On', 'Tackle', 'Long Kick'],
      disabled: true,
      clicked: false,
    },

    //other
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
    { name: 'Assist', category: ['pass'], disabled: true, clicked: false },
  ];

  allGoalParts: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    'Top left',
    'Top',
    'Top right',
    '7',
    '8',
    'Left',
    'Middle',
    'Right',
    '9',
    '10',
    'Bootom left',
    'Bottom',
    'Bottom right',
    '11',
  ];

  trackableEvents: string[] = [
    'Pass',
    'Goal Kick',
    'Long Kick',
    'Cross',
    'Free Kick',
    'Throw In',
    'Carry',
    'Corner',
  ];

  subtagsSelected: string[] = [];

  editModeON = true;
  showPlayers = true;
  areAllPlayersFilled = false;
  switchSide = false;

  // VIDEO
  url: string;
  format: string;
  videoUploaded = false;
  localUpload = false;
  youtubeUpload = false;

  // PITCH
  xScale = 120;
  yScale = 80;

  startCoordinates: coordinate;
  endCoordinates: coordinate;

  // TEAM & PLAYER
  currentTeam = '';
  currentPlayerJersey = '';
  currentPlayerName = '';
  currentEvent = '';

  //EVENT
  eventCoordinates: DataItem;

  @ViewChild('pitchContainer') pitchContainer: ElementRef;

  constructor(
    private eventService: EventService,
    private playerService: PlayersService
  ) {}

  ngOnInit(): void {
    this.playerDataSubscription = this.playerService
      .getPlayerDataObservable()
      .subscribe((data) => {
        this.allPlayers = data;
      });
    this.allPlayers = this.playerService.getPlayerData();
    if (this.allPlayersEnteredSuccessfully(this.allPlayers)) {
      this.areAllPlayersFilled = true;
    }
    this.resetAll();
  }

  onSwitchSide() {
    this.switchSide = !this.switchSide;
  }

  onVideoUpload(event: any) {
    if (event.source === 'local') {
      this.localUpload = true;
      this.youtubeUpload = false;
    } else if (event.source === 'youtube') {
      this.localUpload = false;
      this.youtubeUpload = true;
    }
    this.url = event.url;
    this.videoUploaded = event.videoUploaded;
    this.format = event.format;
  }

  taggingButtonClicked(event: any) {
    if (!this.allPlayersEnteredSuccessfully(this.allPlayers)) {
      alert('Some Players are missing!');
    } else {
      this.editModeON = event.isEditable;
      if (event.buttonLabel === 'Start Tagging') {
        this.currentTeam = event.teamName;
        //Event fetching logic
      } else if (event.buttonLabel === 'End Tagging') {
        alert('Thanks! players tagged successfully');
      }
    }
  }

  allPlayersEnteredSuccessfully(players: Player[]) {
    for (const player of players) {
      if (player.name === '' || player.jersey === '') {
        return false;
      }
    }
    return true;
  }

  areAllPlayersLinedUp(event: any) {
    this.areAllPlayersFilled = event;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (this.currentPlayerJersey && this.currentPlayerName) {
      switch (event.key + event.location) {
        case '0' + 3: // NUM 0 -> PASS
          this.currentEvent = 'Pass';
          break;
        case '+' + 3: // NUM + is SHOT
          this.currentEvent = 'Shot';
          break;
        case 'AudioVolumeMute' + 0: // MUTE is SAVE
          this.currentEvent = 'Save';
          break;
        case 'ArrowRight' + 0: // < is TAKE ON
          this.currentEvent = 'Take On';
          break;
        case 'ArrowLeft' + 0: // > is TACKLE
          this.currentEvent = 'Tackle';
          break;
        case 'Insert' + 0: // Insert is GOAL KICK
          this.currentEvent = 'Goal Kick';
          break;
        case '5' + 3: // NUM 5 is LONG KICK
          this.currentEvent = 'Long Kick';
          break;
        case '6' + 3: // NUM 6 is CROSS
          this.currentEvent = 'Cross';
          break;
        case '4' + 3: // NUM 4 is INTERCEPTION
          this.currentEvent = 'Interception';
          break;
        case '/' + 3: // / is FREE KICK
          this.currentEvent = 'Free Kick';
          break;
        case 'Enter' + 3: // enter is THROW IN
          this.currentEvent = 'Throw In';
          break;
        case 'Delete' + 3: // enter is PRESSURE
          this.currentEvent = 'Pressure';
          break;
        case 'F12' + 0: // F12 is FOUL
          this.currentEvent = 'Foul';
          break;
        case 'PageUp' + 0: // PageUp is CARRY
          this.currentEvent = 'Carry';
          break;
        case 'End' + 0: // End is RECOVERY
          this.currentEvent = 'Recovery';
          break;
        case 'NumLock' + 3: // Numlock is CORNER
          this.currentEvent = 'Corner';
          break;
        case 'F11' + 0: // F11 is OFFSIDE
          this.currentEvent = 'Offside';
          break;
        case 'F10' + 0: // F10 is PENALTY
          this.currentEvent = 'Penalty';
          break;
        case 'Delete' + 0: // Delete(normal) is BALL OUT
          this.currentEvent = 'Ball Out';
          break;
      }
      this.enableSubtags(this.currentEvent);
    }
  }

  enableSubtags(mainTag: string) {
    for (let subtag of this.allSubTags) {
      if (subtag.category.includes(mainTag)) {
        subtag.disabled = false;
      }
    }
  }

  selectedPlayerIndex: number | null = null;

  handlePlayerClick(selectedPlayer: Player) {
    if (this.editModeON) {
      const plyJersey = prompt('Enter jersey');
      const plyName = prompt('Enter player name');

      if (plyJersey !== null && plyName !== null) {
        const updatedLineup = [...this.allPlayers];
        const playerIndex = updatedLineup.findIndex(
          (player) => player.id === selectedPlayer.id
        );
        if (playerIndex !== -1) {
          updatedLineup[playerIndex] = {
            ...updatedLineup[playerIndex],
            jersey: plyJersey,
            name: plyName,
          };
        }

        this.allPlayers = updatedLineup;
        this.playerService.updatePlayerData(this.allPlayers);

        if (this.allPlayersEnteredSuccessfully(this.allPlayers)) {
          this.areAllPlayersFilled = true;
        }
      }
    } else {
      for (let player of this.allPlayers) {
        if (player.id === selectedPlayer.id) {
          this.currentPlayerJersey = player.jersey;
          this.currentPlayerName = player.name;
        }
      }
      this.showPlayers = false;
    }
  }

  handleSubtagClick(subtag: Subtag) {
    if (subtag) {
      if (subtag.clicked === false) {
        this.subtagsSelected.push(subtag.name);
        subtag.clicked = true;
      } else {
        subtag.clicked = false;
        const removedSubtagIndex = this.subtagsSelected.indexOf(subtag.name);
        if (removedSubtagIndex !== -1) {
          this.subtagsSelected.splice(removedSubtagIndex, 1);
        }
      }
    }
  }

  // ngAfterViewInit() {
  //   // Access the native element after the view has been initialized
  //   console.log('ngAfter view Init =>  ', this.pitchContainer.nativeElement);
  // }

  handleMapMouseDown(event: MouseEvent) {
    if (!this.showPlayers) {
      if (this.currentEvent) {
        const x = event.offsetX;
        const y = event.offsetY;

        const normalizedX = Math.round(
          (x / this.pitchContainer.nativeElement.offsetWidth) * this.xScale
        ).toString();
        const normalizedY = Math.round(
          (y / this.pitchContainer.nativeElement.offsetHeight) * this.yScale
        ).toString();

        this.startCoordinates = { x: normalizedX, y: normalizedY };
      } else alert('Please select main event');
    }
  }

  handleMapMouseUp(event: MouseEvent) {
    if (!this.showPlayers) {
      if (
        this.startCoordinates &&
        this.trackableEvents.includes(this.currentEvent)
      ) {
        const x = event.offsetX;
        const y = event.offsetY;

        const normalizedX = Math.round(
          (x / this.pitchContainer.nativeElement.offsetWidth) * this.xScale
        ).toString();
        const normalizedY = Math.round(
          (y / this.pitchContainer.nativeElement.offsetHeight) * this.yScale
        ).toString();

        this.endCoordinates = {
          x: normalizedX,
          y: normalizedY,
        };
      } else this.endCoordinates = { x: '0', y: '0' };

      this.exportEvent();
      this.resetAll();
    }
  }

  exportEvent() {
    this.eventCoordinates = {
      id: new Date().getTime().toString(),
      team: this.currentTeam,
      jersey: this.currentPlayerJersey,
      name: this.currentPlayerName,
      event: this.currentEvent,
      subtags: this.subtagsSelected,
      start: this.startCoordinates,
      end: this.endCoordinates,
    };

    this.eventService.addEventData(this.eventCoordinates);
  }

  resetAll() {
    this.showPlayers = true;
    this.currentEvent = '';
    this.subtagsSelected = [];
    this.startCoordinates = { x: '', y: '' };
    for (let subtag of this.allSubTags) {
      subtag.disabled = true;
      subtag.clicked = false;
    }
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.playerDataSubscription.unsubscribe();
  }
}
