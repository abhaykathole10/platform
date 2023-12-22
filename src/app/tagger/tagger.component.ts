import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  DataItem,
  Player,
  Subtag,
  Coordinate,
  GoalArea,
  SubEvents,
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
  allSubTags: Subtag[] = [
    // FOOT
    {
      type: 'Foot',
      name: 'Right',
      category: ['Shot', 'Save', 'Cross'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Foot',
      name: 'Left',
      category: ['Shot', 'Save', 'Cross'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Foot',
      name: 'Middle',
      category: ['Shot', 'Save', 'Cross'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Foot',
      name: 'Header',
      category: ['Shot'],
      disabled: true,
      clicked: false,
    },

    // OUTCOME
    {
      type: 'Outcome',
      name: 'Goal',
      category: ['Shot', 'Free Kick', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Outcome',
      name: 'Off Target',
      category: ['Shot', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Outcome',
      name: 'Blocked',
      category: ['Shot', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Outcome',
      name: 'Saved',
      category: ['Shot', 'Penalty'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Outcome',
      name: 'Yellow Card',
      category: ['Foul'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Outcome',
      name: 'Red Card',
      category: ['Foul'],
      disabled: true,
      clicked: false,
    },

    // COMPLETION
    {
      type: 'Completion',
      name: 'Complete',
      category: ['Pass', 'Take On', 'Tackle', 'Long Kick'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Completion',
      name: 'Incomplete',
      category: ['Pass', 'Take On', 'Tackle', 'Long Kick'],
      disabled: true,
      clicked: false,
    },

    // KEY PASS (boolean)
    {
      type: 'Key Pass',
      name: 'Key Pass',
      category: ['Pass', 'Long Kick', 'Cross', 'Free Kick', 'Corner'],
      disabled: true,
      clicked: false,
    },

    // ASSIST (boolean)
    {
      type: 'Assist',
      name: 'Assist',
      category: ['Pass', 'Long Kick', 'Cross', 'Free Kick', 'Corner'],
      disabled: true,
      clicked: false,
    },

    // THROUGH PASS (boolean)
    {
      type: 'Through Pass',
      name: 'Through Pass',
      category: ['Pass'],
      disabled: true,
      clicked: false,
    },

    // CLEARANCE
    {
      type: 'Clearance',
      name: 'Clearance',
      category: ['Pass', 'Interception'],
      disabled: true,
      clicked: false,
    },

    // HAND FOUL
    {
      type: 'Hand Foul',
      name: 'Hand Ball',
      category: ['Foul'],
      disabled: true,
      clicked: false,
    },

    //other
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
    {
      type: 'Assist',
      name: 'Assist',
      category: ['pass'],
      disabled: true,
      clicked: false,
    },
  ];

  allGoalAreas: GoalArea[] = [
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
      name: 'Bootom left',
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

  private playerDataSubscription: Subscription;
  allPlayers: Player[] = [];

  subtagsSelected: SubEvents;
  goalAreaSelected: string = '';

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

  startCoordinates: Coordinate;
  endCoordinates: Coordinate;

  // TEAM & PLAYER
  currentTeam = '';
  currentPlayerJersey = '';
  currentPlayerName = '';
  currentEvent = '';

  latestDeleted = false;

  @ViewChild('pitchContainer') pitchContainer: ElementRef;
  @ViewChild('localVideoPlayer') localVideoPlayer: ElementRef;
  @ViewChild('youtubeVideoPlayer') youtubeVideoPlayer: HTMLIFrameElement;

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
    this.initializeAll();
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
        case 'F9' + 0: // MUTE is SAVE
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
        case '.' + 3: // enter is PRESSURE
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
        case 'NumLock' + 0: // Numlock is CORNER
          this.currentEvent = 'Corner';
          break;
        case 'F8' + 0: // F11 is OFFSIDE
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
      if (this.currentEvent === 'Shot') {
        this.enableGoalAreas();
      }
    }
  }

  @HostListener('document:keydown.backspace', ['$event'])
  handleDeleteLast(event: KeyboardEvent) {
    if (this.eventService.getAllEvents().length && !this.latestDeleted) {
      this.eventService.removeLatestEvent();
      this.latestDeleted = true;
    } else alert('Latest tag already deleted');
  }

  // @HostListener('document:keydown.space', ['$event'])
  // handleSpacebarEvent(event: KeyboardEvent) {
  //   if (this.youtubeVideoPlayer) {
  //     event.preventDefault();

  //     if (this.youtubeVideoPlayer instanceof HTMLIFrameElement) {
  //       this.toggleVideoPlayPause(this.youtubeVideoPlayer);
  //     }
  //   }
  // }

  // private toggleVideoPlayPause(video: HTMLIFrameElement): void {
  //   // if (video.nativeElement.paused) {
  //   //   video.nativeElement.play();
  //   // } else {
  //   //   video.nativeElement.pause();
  //   // }

  //   const player: any = (iframe.contentWindow || iframe.contentDocument) as any;
  //   if (player && player.postMessage) {
  //     player.postMessage(
  //       '{"event":"command","func":"togglePlayPause","args":""}',
  //       '*'
  //     );
  //   }
  // }

  enableSubtags(mainTag: string) {
    for (let subtag of this.allSubTags) {
      if (subtag.category.includes(mainTag)) {
        subtag.disabled = false;
      }
    }
  }

  enableGoalAreas() {
    for (let area of this.allGoalAreas) {
      area.disabled = false;
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
      subtag.clicked = !subtag.clicked;
      this.allSubTags
        .filter(
          (sTag) => sTag.type === subtag.type && sTag.name !== subtag.name
        )
        .forEach((sTag) => (sTag.disabled = subtag.clicked));

      const subtagType = subtag.type.toLowerCase().replace(/\s/g, '');

      switch (subtagType) {
        case 'keypass':
        case 'assist':
        case 'throughpass':
        case 'clearance':
        case 'handfoul':
          (this.subtagsSelected as any)[subtagType] = true;
          break;
        case 'completion':
          this.subtagsSelected.outcome = subtag.name;
          break;
        default:
          (this.subtagsSelected as any)[subtagType] = subtag.name;
          break;
      }
    }
  }

  handleGoalArea(area: GoalArea) {
    if (area) {
      area.clicked = !area.clicked;
      this.goalAreaSelected = area.name;
    }
  }

  ngAfterViewInit() {
    // Access the native element after the view has been initialized
    console.log('ngAfter view Init =>  ', this.pitchContainer.nativeElement);
  }

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
      this.initializeAll();
    }
  }

  exportEvent() {
    const eventData: DataItem = {
      id: new Date().getTime().toString(),
      team: this.currentTeam,
      jersey: this.currentPlayerJersey,
      name: this.currentPlayerName,
      event: this.currentEvent,
      start: this.startCoordinates,
      end: this.endCoordinates,
      subEvents: this.subtagsSelected,
      goalArea: this.goalAreaSelected,
    };

    this.eventService.addEventData(eventData);
  }

  initializeAll() {
    this.showPlayers = true;
    this.currentEvent = '';
    this.subtagsSelected = {
      foot: '',
      outcome: '',
      keypass: false,
      assist: false,
      throughpass: false,
      clearance: false,
      handfoul: false,
    };
    this.startCoordinates = { x: '', y: '' };
    for (let subtag of this.allSubTags) {
      subtag.disabled = true;
      subtag.clicked = false;
    }
    this.goalAreaSelected = '';
    for (let area of this.allGoalAreas) {
      area.disabled = true;
      area.clicked = false;
    }
    this.latestDeleted = false;
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.playerDataSubscription.unsubscribe();
  }
}
