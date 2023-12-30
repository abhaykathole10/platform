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
  @ViewChild('youtubePlayerContainer') youtubePlayerContainer: ElementRef;

  private playerYT: any;

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

  //  INITIALIZING YOUTUBE PLAYER
  private initYoutubePlayer() {
    if (this.youtubeUpload) {
      if ((window as any).YT && (window as any).YT.Player) {
        this.playerYT = new (window as any).YT.Player(
          this.youtubePlayerContainer.nativeElement,
          {
            videoId: this.getVideoId(this.url),
            events: {
              onReady: () => {},
              onStateChange: (event: any) => {},
            },
          }
        );
      }
    }
  }

  // EXTRRACTING VIDEO ID FROM YOUTUBE VIDEO URL
  private getVideoId(url: string): string {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : '';
  }

  onSwitchSide() {
    this.switchSide = !this.switchSide;
  }

  onVideoUpload(event: any) {
    this.url = event.url;
    this.videoUploaded = event.videoUploaded;
    this.format = event.format;
    if (event.source === 'local') {
      this.localUpload = true;
      this.youtubeUpload = false;
    } else if (event.source === 'youtube') {
      this.localUpload = false;
      this.youtubeUpload = true;
      this.initYoutubePlayer();
    }
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
    if (!this.editModeON) {
      switch (event.key + event.location) {
        case 'AltGraph' + 2:
        case 'Alt' + 2:
          this.handleBackward();
          break;

        case 'ContextMenu' + 0:
          window.addEventListener('contextmenu', (e) => e.preventDefault());
          this.handleForward();
          break;
      }
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
          case 'ArrowRight' + 0: // < OFFENSIVE DUEL
            this.currentEvent = 'Offensive Duel';
            event.preventDefault();
            break;
          case 'ArrowLeft' + 0: // > DEFENSIVE DUEL
            this.currentEvent = 'Defensive Duel';
            event.preventDefault();
            break;
          case 'ArrowUp' + 0: // ^ is AIR BALL DUEL
            this.currentEvent = 'Air Duel';
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
          case '*' + 3: // * is CORNER
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
  }

  handleBackward() {
    if (this.playerYT) {
      const currentTime = this.playerYT.getCurrentTime();
      this.playerYT.seekTo(currentTime - 1, true);
    } else if (this.localVideoPlayer) {
      const video = this.localVideoPlayer.nativeElement;
      video.currentTime -= 1;
    }
  }

  handleForward() {
    if (this.playerYT) {
      const currentTime = this.playerYT.getCurrentTime();
      this.playerYT.seekTo(currentTime + 1, true);
    } else if (this.localVideoPlayer) {
      const video = this.localVideoPlayer.nativeElement;
      video.currentTime += 1;
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
    if (event.location === 2 && !this.editModeON) {
      this.togglePlayPause('both');
    }
  }

  togglePlayPause(action: string) {
    const videoElement = this.localVideoPlayer?.nativeElement;
    const playerState = this.playerYT?.getPlayerState();

    if (videoElement && this.localUpload) {
      if (action === 'both') {
        videoElement.paused ? videoElement.play() : videoElement.pause();
      } else if (action === 'pause') {
        videoElement.pause();
      }
    } else if (playerState !== undefined && this.youtubeUpload) {
      if ((playerState === 1 && action === 'both') || action === 'pause') {
        this.playerYT.pauseVideo();
      } else if (
        (playerState === 2 || playerState === 5 || playerState === -1) &&
        action === 'both'
      ) {
        this.playerYT.playVideo();
      }
    }
  }

  // INCREASE PLAYBACK SPEED ON SHIFT
  @HostListener('document:keydown.shift', ['$event'])
  @HostListener('document:keyup.shift', ['$event'])
  handleShiftKey(event: KeyboardEvent) {
    if (event.location === 2 && !this.editModeON) {
      const speed = event.type === 'keydown' ? 2 : 1;
      if (this.localVideoPlayer && this.localUpload) {
        this.localVideoPlayer.nativeElement.playbackRate = speed;
      } else if (this.playerYT && this.youtubeUpload) {
        this.playerYT.setPlaybackRate(speed);
      }
    }
  }

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
      this.togglePlayPause('pause');
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
    let currentTimeInSeconds: number | undefined;
    if (this.localVideoPlayer && this.localUpload) {
      const video = this.localVideoPlayer.nativeElement;
      currentTimeInSeconds = video.currentTime;
    } else if (this.playerYT && this.youtubeUpload) {
      currentTimeInSeconds = this.playerYT.getCurrentTime();
    }
    if (currentTimeInSeconds !== undefined) {
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
        case 'takeon':
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
      takeon: false,
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
