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
import { ALLGOALAREAS, ALLSUBTAGS } from '../shared/app.constants';

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.css'],
})
export class TaggerComponent {
  allPlayers: Player[] = [];
  allSubTags: Subtag[] = ALLSUBTAGS;
  allGoalAreas: GoalArea[] = ALLGOALAREAS;

  private playerDataSubscription: Subscription;

  // EVENTS THAT NEED START & END locations
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

  // CONFIGURATION
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

  // SUBTAG & GOALAREA
  subtagsSelected: SubEvents;
  goalAreaSelected: string = '';

  latestDeleted = false;

  isScrolling: boolean = false;

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
        this.allPlayers.filter((player) =>
          player.id === 'p0' ? (player.name = this.currentTeam) : player.name
        );
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
  handleMainEvents(event: KeyboardEvent) {
    if (this.localVideoPlayer && !this.editModeON) {
      const video = this.localVideoPlayer.nativeElement;
      switch (event.key) {
        case 'n':
          video.currentTime -= 1;
          break;
        case 'm':
          video.currentTime += 1;
          break;
      }
    }
    if (
      this.currentPlayerJersey &&
      this.currentPlayerName &&
      !this.editModeON
    ) {
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
          event.preventDefault();
          break;
        case 'ArrowLeft' + 0: // > is TACKLE
          this.currentEvent = 'Tackle';
          event.preventDefault();
          break;
        case 'ArrowDown' + 0: // v is LOOSE BALL DUEL
          this.currentEvent = 'LBD';
          event.preventDefault();
          break;
        case 'Insert' + 0: // Insert is GOAL KICK
        case 'Help' + 0:
          this.currentEvent = 'Goal Kick';
          event.preventDefault();
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
          event.preventDefault();
          break;
        case 'PageUp' + 0: // PageUp is CARRY
          this.currentEvent = 'Carry';
          break;
        case 'End' + 0: // End is RECOVERY
          this.currentEvent = 'Recovery';
          break;
        case 'NumLock' + 0: // Numlock is CORNER
        case 'Clear' + 0:
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
      this.eventService.setCurrentMainTag(this.currentEvent);
      this.enableSubtags(this.currentEvent);
      if (['Shot', 'Save', 'Penalty'].includes(this.currentEvent)) {
        this.enableGoalAreas();
      }
    }
  }

  // REMOVE LATEST EVENT WITH BACKSPACE
  @HostListener('document:keydown.backspace', ['$event'])
  removeLatestEvent(event: KeyboardEvent) {
    if (!this.editModeON) {
      if (this.eventService.getAllEvents().length && !this.latestDeleted) {
        this.eventService.removeLatestEvent();
        this.latestDeleted = true;
      } else alert('Latest tag already deleted');
    }
  }

  // PLAY OR PAUSE VIDEO ON RIGHT CONTROL
  @HostListener('document:keydown.control', ['$event'])
  playPauseVideo(event: KeyboardEvent) {
    if (event.location === 2 && this.localVideoPlayer && !this.editModeON) {
      const videoElement = this.localVideoPlayer.nativeElement;
      videoElement.paused ? videoElement.play() : videoElement.pause();
    }
  }

  // INCREASE PLAYBACK SPEED ON SHIFT
  @HostListener('document:keydown.shift', ['$event'])
  @HostListener('document:keyup.shift', ['$event'])
  handleShiftKey(event: KeyboardEvent) {
    if (
      event.location === 2 &&
      this.localVideoPlayer?.nativeElement &&
      !this.editModeON
    ) {
      this.localVideoPlayer.nativeElement.playbackRate =
        event.type === 'keydown' ? 2 : 1;
    }
  }

  // FORWARD OR BACKWARD ON MOUSE SCROLL
  // @HostListener('wheel', ['$event'])
  // onWheel(event: WheelEvent): void {
  //   if (this.localVideoPlayer && !this.editModeON) {
  //     const video: HTMLVideoElement = this.localVideoPlayer.nativeElement;
  //     const direction: number = Math.sign(event.deltaY);

  //     if (!this.isScrolling) {
  //       this.isScrolling = true;
  //       this.scrollVideo(video, direction);
  //     } else {
  //       if (event.deltaY === 0) {
  //         this.isScrolling = false;
  //       } else {
  //         this.scrollVideo(video, direction);
  //       }
  //     }
  //     event.preventDefault();
  //   }
  // }

  // private scrollVideo(video: HTMLVideoElement, direction: number): void {
  //   const step = 0.01;
  //   video.currentTime += direction * step;

  //   requestAnimationFrame(() => {
  //     if (this.isScrolling) {
  //       this.scrollVideo(video, direction);
  //     }
  //   });
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
          this.eventService.setCurrentPlayer(this.currentPlayerJersey);
          this.setEventTimeStamp();
        }
      }
      this.showPlayers = false;
    }
  }

  currentTime: string;

  setEventTimeStamp() {
    if (this.localVideoPlayer) {
      const video = this.localVideoPlayer.nativeElement;
      const currentTimeInSeconds: number = video.currentTime;
      this.currentTime = this.formatTime(currentTimeInSeconds);
    }
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = Math.floor(seconds % 60);

    const formattedMinutes: string =
      minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds: string =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
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
          (this.subtagsSelected as any)[subtagType] = !(
            this.subtagsSelected as any
          )[subtagType];
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
      time: this.currentTime,
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
    this.currentPlayerJersey = '';
    this.currentPlayerName = '';
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
    this.currentTime = '';
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.playerDataSubscription.unsubscribe();
  }
}
