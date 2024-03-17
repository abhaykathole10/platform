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
import {
  ALLGOALAREAS,
  ALLSUBTAGS,
  TRACKABLE_EVENTS,
} from '../shared/app.constants';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent {
  allPlayers: Player[] = [];
  allSubTags: Subtag[] = ALLSUBTAGS;
  allGoalAreas: GoalArea[] = ALLGOALAREAS;

  private playerDataSubscription: Subscription;

  // EVENTS THAT NEED START & END locations
  trackableEvents: string[] = TRACKABLE_EVENTS;

  // CONFIGURATION
  editModeON = true;
  showPlayers = true;
  areAllPlayersFilled = false;
  switchSide = false;

  // VIDEO
  url: any;
  // format: string;
  // videoUploaded = false;
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
  @ViewChild('youtubePlayerContainer') youtubePlayerContainer: ElementRef;
  @ViewChild('localVideoPlayer') localVideoPlayer: HTMLVideoElement;

  playerYT: any;

  // TOOLBAR
  switchValue = '';
  currentMode = 'Welcome!';
  teamReadOnly: boolean = false;
  taggingButtonLabel = 'Start Tagging';

  source: string;
  videoYtUrl: string;

  // @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('switchButton') switchButton: ElementRef;

  playerJersey = '';
  mainEvent = '';

  private playerJerseySubscription: Subscription;
  private currentEventSubscription: Subscription;
  private eventDataSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private playerService: PlayersService,
    private exportService: ExportService,
    private playersService: PlayersService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const input = document.querySelector<HTMLInputElement>('#video-url-input');
    // const videoContainer =
    //   document.querySelector<HTMLDivElement>('#video-container');

    const imageButton =
      this.elementRef.nativeElement.querySelector('#imageButton');

    // if (input && videoContainer) {
    //   input.addEventListener('change', (event: Event) => {
    //     const target = event.target as HTMLInputElement;
    //     const file = target.files?.[0];
    //     if (file) {
    //       const url = URL.createObjectURL(file);
    //       videoContainer.innerHTML = `
    //         <video width="100%" height="auto" src="${url}" controls></video>
    //       `;
    //       // Hide the input element
    //       // input.style.display = 'none';
    //       this.localUpload = true;
    //       this.localVideoPlayer = document.querySelector<HTMLVideoElement>(
    //         '#video-container video'
    //       );
    //     }
    //   });

    if (input && imageButton) {
      imageButton.addEventListener('click', () => {
        input.click();
      });

      input.addEventListener('change', (event: Event) => {
        if (this.youtubeUpload) {
          this.destroyYoutubePlayer();
          this.youtubeUpload = false;
        }
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          this.source = 'local';
          this.localUpload = true;
          this.youtubeUpload = false;
          const url = URL.createObjectURL(file);
          this.url = url;
          const videoContainer =
            this.elementRef.nativeElement.querySelector('#video-container');
          videoContainer.innerHTML = `
            <video width="100%" height="auto" src="${url}" controls></video>
          `;
          // input.style.display = 'none';
          this.localVideoPlayer = this.elementRef.nativeElement.querySelector(
            '#video-container video'
          );
          input.value = '';
        }
      });
    }

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

    this.playerJerseySubscription = this.eventService
      .getCurrentPlayerObservable()
      .subscribe((playerJersey) => {
        this.playerJersey = playerJersey;
      });
    this.currentEventSubscription = this.eventService
      .getCurrentMainTagObservable()
      .subscribe((mainTag) => {
        this.mainEvent = mainTag;
      });
    this.eventDataSubscription = this.eventService
      .getEventDataObservable()
      .subscribe((data) => {
        if (data) {
          this.playerJersey = this.mainEvent = '';
        }
      });
  }

  //  INITIALIZING YOUTUBE PLAYER
  initYoutubePlayer() {
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
  getVideoId(url: string): string {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : '';
  }

  onSwitchSide() {
    this.switchSide = !this.switchSide;
  }

  openModalClicked() {
    if (this.url) {
      // this.fileInput.nativeElement.value = '';
      this.url = undefined;
      // this.videoUploaded = false;
    }
  }

  // for YOUTUBE video
  handleYoutubeUpload() {
    if (this.localUpload) {
      this.destroyLocalPlayer();
    }
    if (this.videoYtUrl) {
      this.source = 'youtube';
      this.url = this.videoYtUrl;
      // this.videoUploaded = true;
    }
  }

  // for LOCAL video
  // onSelectFile(event: any) {
  //   const file = event.target.files && event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     if (file.type.indexOf('image') > -1) {
  //       this.format = 'image';
  //     } else if (file.type.indexOf('video') > -1) {
  //       this.format = 'video';
  //     }
  //     reader.onload = (event) => {
  //       this.source = 'local';
  //       this.videoUploaded = true;
  //       this.url = (<FileReader>event.target).result;
  //     };
  //   }
  // }

  onDoneClickYT() {
    // TOOLBAR
    if (this.url && this.source === 'youtube') {
      this.localUpload = false;
      this.youtubeUpload = true;
      this.closeModal.nativeElement.click();
      this.initYoutubePlayer();

      // this.onVideoUpload.emit({
      //   source: this.source,
      //   url: this.url,
      //   videoUploaded: this.videoUploaded,
      //   format: this.format,
      // });

      // TAGGER
      // this.url = event.url;
      // this.videoUploaded = event.videoUploaded;
      // this.format = event.format;
      // if (this.source === 'local') {
      //   this.localUpload = true;
      //   this.youtubeUpload = false;
      // }
      //  else if (this.source === 'youtube') {
      //   this.localUpload = false;
      //   this.youtubeUpload = true;
      //   this.initYoutubePlayer();
      // }
    } else {
      alert('Please upload a video');
    }
  }

  taggingButtonClicked(event: any) {
    // TOOLBAR
    this.editModeON = !this.editModeON;
    this.switchValue = this.editModeON ? '' : 'ballerMetrics'; // to enable/disable switch
    this.currentMode = this.editModeON ? 'Edit mode' : 'Tagging mode';
    this.teamReadOnly = this.currentMode === 'Tagging mode' ? true : false;
    // this.taggingButtonClicked.emit({
    //   buttonLabel: this.taggingButtonLabel,
    //   teamName: this.currentTeam,
    //   isEditable: this.editModeON,
    // });
    // this.taggingButtonLabel = this.editModeON
    //   ? 'Start Tagging'
    //   : 'Stop tagging';

    //TAGGER
    if (!this.allPlayersEnteredSuccessfully(this.allPlayers)) {
      alert('Some Players are missing!');
    } else {
      // this.editModeON = event.isEditable;
      if (event.buttonLabel === 'Start Tagging') {
        // this.currentTeam = event.teamName;
        this.allPlayers.filter((player) =>
          player.id === 'p0' ? (player.name = this.currentTeam) : player.name
        );
        //Event fetching logic
      } else if (event.buttonLabel === 'End Tagging') {
        alert('Thanks! players tagged successfully');
      }
    }

    this.taggingButtonLabel = this.editModeON
      ? 'Start Tagging'
      : 'Stop tagging';
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
          this.handleForward();
          break;

        case 'ContextMenu' + 0:
          window.addEventListener('contextmenu', (e) => e.preventDefault());
          this.handleBackward();
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
          case 'End' + 0: // End is Touch (initially Recovery)
            this.currentEvent = 'Touch';
            event.preventDefault();
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
          case '7' + 3: // NUM 7 is SUBBED OUT
            this.currentEvent = 'Subbed Out';
            break;
          case '1' + 3: // NUM 1 is HEAD PASS
            this.currentEvent = 'Head Pass';
            break;
          case 'Home' + 0: // Home for Hand Pass
            this.currentEvent = 'Hand Pass';
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
      const video = this.localVideoPlayer;
      video.currentTime -= 1;
    }
  }

  handleForward() {
    if (this.playerYT) {
      const currentTime = this.playerYT.getCurrentTime();
      this.playerYT.seekTo(currentTime + 1, true);
    } else if (this.localVideoPlayer) {
      const video = this.localVideoPlayer;
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
    const videoElement = this.localVideoPlayer;
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
        this.localVideoPlayer.playbackRate = speed;
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
      const video = this.localVideoPlayer;
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

  exportToCSV() {
    const eventsData = this.eventService.getAllEvents();
    if (eventsData.length) {
      if (confirm('Are you sure you want to export the csv file?')) {
        this.exportService.exportToCsv(eventsData, 'bm-events-data.csv');
      }
    } else alert('Why export blank csv? Please tag data first');
  }

  handleReset() {
    if (confirm('Are you sure you want to reset all??')) {
      this.eventService.deleteAllEvents();
      this.playersService.resetAllPlayers();
      this.resetConfigurations();
    }
  }

  resetConfigurations() {
    this.switchButton.nativeElement.click();
    this.currentTeam = '';
    // this.videoUploaded = false;
    this.destroyYoutubePlayer();
    this.destroyLocalPlayer();
  }

  destroyLocalPlayer() {
    if (this.localVideoPlayer || this.localUpload) {
      this.localUpload = false;
      this.localVideoPlayer.pause();
      this.localVideoPlayer.parentNode?.removeChild(this.localVideoPlayer);
      this.url = undefined;
    }
  }

  destroyYoutubePlayer() {
    if (this.youtubeUpload && this.playerYT) {
      this.youtubeUpload = false;
      this.playerYT.destroy(); // Destroy the YouTube player instance
      this.youtubePlayerContainer.nativeElement.innerHTML = ''; // Remove the iframe from the DOM
      this.videoYtUrl = '';
      this.url = undefined;
    }
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.playerDataSubscription.unsubscribe();
    this.playerJerseySubscription.unsubscribe();
    this.currentEventSubscription.unsubscribe();
    this.eventDataSubscription.unsubscribe();
  }
}
