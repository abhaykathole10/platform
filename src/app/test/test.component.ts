import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  DataItem,
  Player2,
  Subtag,
  Coordinate,
  GoalArea,
  SubEvents,
  GoalCoordinate,
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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  PLAYING,
  POSSIBLE_FORMATIONS,
  POSITION_X,
  POSITION_Y,
} from '../shared/config.constants';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent {
  allSubTags: Subtag[] = ALLSUBTAGS;
  // allGoalAreas: GoalArea[] = ALLGOALAREAS;

  private playerDataSubscription: Subscription;
  private onFieldPlayerDataSubscription: Subscription;
  private onListPlayerDataSubscription: Subscription;
  private playersConfigSubscription: Subscription;

  // EVENTS THAT NEED START & END locations
  trackableEvents: string[] = TRACKABLE_EVENTS;

  // CONFIGURATION
  editModeON = true;
  showPlayers = true;
  areAllPlayersFilled = false;
  switchSide = false;
  enableGoalArea = false;

  // VIDEO
  url: any;
  youtubeUrl: string;
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
  goalAreaSelected: GoalCoordinate;

  latestDeleted = false;

  isScrolling: boolean = false;

  @ViewChild('pitchContainer') pitchContainer: ElementRef;
  @ViewChild('goalContainer') goalContainer: ElementRef;
  @ViewChild('youtubePlayerContainer') youtubePlayerContainer: ElementRef;

  @ViewChild('jersey') jerseyInput: ElementRef;

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
  @ViewChild('localVideoPlayer') localVideoPlayer!: ElementRef;

  playerJersey = '';
  mainEvent = '';

  private playerJerseySubscription: Subscription;
  private currentEventSubscription: Subscription;
  private eventDataSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private playerService: PlayersService,
    private exportService: ExportService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.setUpLocalVideoPlayer();
    this.getConfigurations();
    this.getPlayers();

    if (this.allPlayersEnteredSuccessfully(this.onFieldPlayers)) {
      this.areAllPlayersFilled = true;
    }

    this.initializeAll();
    this.getEvents();
  }

  setUpLocalVideoPlayer() {
    const input = document.querySelector<HTMLInputElement>('#video-url-input');
    const imageButton =
      this.elementRef.nativeElement.querySelector('#imageButton');

    if (input && imageButton) {
      imageButton.addEventListener('click', () => {
        input.click();
      });

      input.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          this.localUpload = true;
          this.destroyYoutubePlayer();
          const url = URL.createObjectURL(file);
          this.localVideoPlayer.nativeElement.src = url;
          this.localVideoPlayer.nativeElement.style.display = 'block'; // Show the video element
          input.value = '';
        }
      });
    }
  }

  getConfigurations() {
    const playing = this.playerService.getConfiguration('playing');
    const formation = this.playerService.getConfiguration('formation');

    this.selectedPlaying = playing ? playing : '';
    this.selectedFormation = formation ? formation : '';
  }

  getPlayers() {
    this.onFieldPlayerDataSubscription = this.playerService
      .getOnFieldPlayerDataObservable()
      .subscribe((data) => {
        this.onFieldPlayers = data;
      });
    this.onListPlayerDataSubscription = this.playerService
      .getOnListPlayerDataObservable()
      .subscribe((data) => {
        this.onListPlayers = data;
      });

    this.onFieldPlayers = this.playerService.getOnFieldPlayerData();
    this.onListPlayers = this.playerService.getOnListPlayerData();

    this.setFormation();
  }

  getEvents() {
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
            videoId: this.getVideoId(this.youtubeUrl),
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
    if (this.youtubeUrl) {
      this.youtubeUrl = '';
    }
  }

  // for YOUTUBE video
  handleYoutubeUpload() {
    if (this.localUpload) {
      this.destroyLocalPlayer();
    }
    if (this.videoYtUrl) {
      this.source = 'youtube';
      this.youtubeUrl = this.videoYtUrl;
    }
  }

  onDoneClickYT() {
    // TOOLBAR
    if (this.youtubeUrl && this.source === 'youtube') {
      this.localUpload = false;
      this.youtubeUpload = true;
      this.closeModal.nativeElement.click();
      this.initYoutubePlayer();
    } else {
      alert('Please upload a video');
    }
  }

  taggingButtonClicked() {
    // TOOLBAR
    this.editModeON = !this.editModeON;
    this.switchValue = this.editModeON ? '' : 'ballerMetrics';
    this.currentMode = this.editModeON ? 'Edit mode' : 'Tagging mode';
    this.teamReadOnly = this.currentMode === 'Tagging mode' ? true : false;

    //TAGGER
    if (!this.allPlayersEnteredSuccessfully(this.onFieldPlayers)) {
      alert('Some Players are missing!');
    }

    this.taggingButtonLabel = this.editModeON
      ? 'Start Tagging'
      : 'Stop tagging';
  }

  allPlayersEnteredSuccessfully(players: Player2[]) {
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
          // this.enableGoalAreas();
          this.enableGoalArea = true;
        }
      }
    }
  }

  handleBackward() {
    const video: HTMLVideoElement = this.localVideoPlayer.nativeElement;
    if (this.playerYT) {
      const currentTime = this.playerYT.getCurrentTime();
      this.playerYT.seekTo(currentTime - 1, true);
    } else if (video && this.localUpload) {
      video.currentTime -= 2;
    }
  }

  handleForward() {
    const video: HTMLVideoElement = this.localVideoPlayer.nativeElement;
    if (this.playerYT) {
      const currentTime = this.playerYT.getCurrentTime();
      this.playerYT.seekTo(currentTime + 1, true);
    } else if (video && this.localUpload) {
      video.currentTime += 2;
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
    const video: HTMLVideoElement = this.localVideoPlayer.nativeElement;
    const playerState = this.playerYT?.getPlayerState();

    if (video && this.localUpload && !this.youtubeUpload) {
      if (action === 'both') {
        video.paused ? video.play() : video.pause();
      } else if (action === 'pause') {
        video.pause();
      }
    } else if (
      playerState !== undefined &&
      this.youtubeUpload &&
      !this.localUpload
    ) {
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
      const video: HTMLVideoElement = this.localVideoPlayer.nativeElement;

      if (video && this.localUpload) {
        video.playbackRate = speed;
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

  // enableGoalAreas() {
  //   for (let area of this.allGoalAreas) {
  //     area.disabled = false;
  //   }
  // }

  selectedPlayerIndex: number | null = null;

  handlePlayerClick(selectedPlayer: Player2) {
    if (this.editModeON) {
      const plyJersey = prompt('Enter jersey');
      const plyName = prompt('Enter player name');

      if (plyJersey !== null && plyName !== null) {
        const updatedLineup = [...this.onFieldPlayers];
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

        this.onFieldPlayers = updatedLineup;
        this.playerService.updatePlayerData(this.onFieldPlayers);

        if (this.allPlayersEnteredSuccessfully(this.onFieldPlayers)) {
          this.areAllPlayersFilled = true;
        }
      }
    } else {
      this.togglePlayPause('pause');
      for (let player of this.onFieldPlayers) {
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
      currentTimeInSeconds = video.nativeElement.currentTime;
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

  // handleGoalArea(area: GoalArea) {
  //   if (area) {
  //     area.clicked = !area.clicked;
  //     this.goalAreaSelected = area.name;
  //   }
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
    this.goalAreaSelected = { gx: '', gy: '' };
    // for (let area of this.allGoalAreas) {
    //   area.disabled = true;
    //   area.clicked = false;
    // }
    this.latestDeleted = false;
    this.currentTime = '';
    this.enableGoalArea = false;
  }

  exportToCSV() {
    const eventsData = this.eventService.getAllEvents();
    if (eventsData.length) {
      if (confirm('Are you sure you want to export the csv file?')) {
        const fileName = prompt('Enter file name: ');
        this.exportService.exportToCsv(eventsData, `${fileName}.csv`);
      }
    } else alert('Why export blank csv? Please tag data first');
  }

  handleReset() {
    if (confirm('Are you sure you want to reset all??')) {
      this.eventService.deleteAllEvents();
      this.playerService.resetAllPlayers();
      this.resetConfigurations();
    }
  }

  resetConfigurations() {
    this.switchButton.nativeElement.click();
    this.currentTeam = '';
    this.destroyYoutubePlayer();
    this.destroyLocalPlayer();
  }

  destroyLocalPlayer() {
    if (this.localVideoPlayer || this.localUpload) {
      this.localUpload = false;
      this.localVideoPlayer.nativeElement.pause();
      this.localVideoPlayer.nativeElement.style.display = 'none';
    }
  }

  destroyYoutubePlayer() {
    if (this.youtubeUpload && this.playerYT) {
      this.youtubeUpload = false;
      this.playerYT.destroy();
      this.youtubePlayerContainer.nativeElement.innerHTML = '';
      this.videoYtUrl = '';
      this.url = undefined;
    }
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.playerDataSubscription.unsubscribe();
    this.onFieldPlayerDataSubscription.unsubscribe();
    this.onListPlayerDataSubscription.unsubscribe();
    this.playerJerseySubscription.unsubscribe();
    this.currentEventSubscription.unsubscribe();
    this.eventDataSubscription.unsubscribe();
    this.playersConfigSubscription.unsubscribe();
  }

  ////////////////////////////// CONFIG RELATED CHANGES ////////////////////////////////////

  /////////////////  PLAYING AND FORMATION /////////////////////

  playingDDValues = PLAYING;
  formationDDValues: string[] = [];
  spaceArray: number[] = [];

  selectedPlaying: string;
  selectedFormation: string;

  disableFormationdd: boolean = true;

  @ViewChild('playing') playingRef: ElementRef;
  @ViewChild('formation') formationRef: ElementRef;

  onCongifModalOpen() {
    if (this.selectedPlaying && this.selectedFormation) {
      this.playingRef.nativeElement.value = this.selectedPlaying;
      this.disableFormationdd = false;
      this.formationDDValues =
        POSSIBLE_FORMATIONS[parseInt(this.selectedPlaying)];
    }
  }

  onSelectPlaying(event: any) {
    const selectedValue = event?.target.value;
    if (selectedValue) {
      this.selectedPlaying = selectedValue;
      this.playerService.setConfiguration('playing', this.selectedPlaying);
      this.disableFormationdd = false;
      this.formationDDValues =
        POSSIBLE_FORMATIONS[parseInt(this.selectedPlaying)];
    }
  }

  onSelectFormation(event: any) {
    if (this.onFieldPlayers.length > parseInt(this.selectedPlaying)) {
      alert('On-field players cannot be greater than Playing');
    } else {
      const selectedValue = event?.target.value;
      if (selectedValue) {
        this.selectedFormation = selectedValue;
        this.playerService.setConfiguration(
          'formation',
          this.selectedFormation
        );
        this.setFormation();
      }
    }
  }

  setFormation() {
    if (this.selectedFormation) {
      const temp = this.selectedFormation.split('-');
      this.spaceArray = [];
      this.spaceArray.push(1);
      for (let i = 0; i < temp.length - 1; i++) {
        const currentLineup = parseInt(temp[i]);
        this.spaceArray.push(this.spaceArray[i] + currentLineup);
      }
    } else this.spaceArray = [];

    this.updateOrder();
  }

  /////////////////  PLAYER LIST CONTAINER /////////////////////

  configPlayerJersey: string;
  configPlayerName: string;

  onListPlayers: Player2[] = [];

  addPlayerOnList() {
    if (this.configPlayerJersey && this.configPlayerName) {
      // const temp = 'p' + this.onListPlayers.length.toString();
      const playerObj = {
        jersey: this.configPlayerJersey,
        name: this.configPlayerName,
        selected: false,
      };

      this.onListPlayers.push(playerObj);
      this.playerService.updateOnListPlayerData(this.onListPlayers);

      this.configPlayerJersey = '';
      this.configPlayerName = '';

      if (this.jerseyInput && this.jerseyInput.nativeElement) {
        this.jerseyInput.nativeElement.focus();
      }
    } else alert('fields missing');
  }

  removePlayerFromListandField(player: any) {
    this.onListPlayers = this.onListPlayers.filter(
      (onListPlayer) => onListPlayer.name !== player.name
    );
    this.onFieldPlayers = this.onFieldPlayers.filter(
      (onFieldPlayer) => onFieldPlayer.name !== player.name
    );
    this.playerService.updateOnFieldPlayerData(this.onFieldPlayers);
    this.playerService.updateOnListPlayerData(this.onListPlayers);
    this.updateOrder();
  }

  removeAllPlayerFromListandField() {
    if (confirm('Are you sure you want to delete all players')) {
      this.onListPlayers = [];
      this.onFieldPlayers = [];

      this.playerService.updateOnFieldPlayerData(this.onFieldPlayers);
      this.playerService.updateOnListPlayerData(this.onListPlayers);
    }
  }

  /////////////////// DRAG DROP CONTAINER //////////////////////////

  onFieldPlayers: Player2[] = [];

  addPlayerOnField(player: Player2) {
    if (
      this.onFieldPlayers &&
      this.onFieldPlayers.length < parseInt(this.selectedPlaying)
    ) {
      if (!this.onFieldPlayers.some((obj) => obj.name === player.name)) {
        this.onFieldPlayers.push(player);
        this.playerService.updateOnFieldPlayerData(this.onFieldPlayers);
        this.updateOrder();
      } else {
        alert('player already present on field');
      }
    } else {
      alert('Max player limit reached');
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.onFieldPlayers,
      event.previousIndex,
      event.currentIndex
    );
    this.updateOrder();
  }

  updateOrder() {
    const formation = this.selectedFormation.split('-');
    let players = this.onFieldPlayers;

    if (players && players.length) {
      players.forEach((player, index) => {
        const playerId = 'p' + index.toString();
        player.id = playerId;
      });

      // Update the first player
      players[0].top = '45%';
      players[0].left = '2%';

      let playerIndex = 1; // Start from the second player

      for (let i = 0; i < formation.length; i++) {
        const formationCount = parseInt(formation[i]);

        const posY = POSITION_Y[formationCount];
        const posX = POSITION_X[formation.length];

        for (let j = 0; j < formationCount; j++) {
          if (playerIndex >= players.length) {
            break;
          }

          players[playerIndex].top = posY[j];
          players[playerIndex].left = posX[i];

          playerIndex++;
        }
      }

      this.onFieldPlayers = players;
    }
    console.log('updateOrder onFieldPalyers ===> ', this.onFieldPlayers);
  }

  removePlayerFromField(player: Player2) {
    if (this.onFieldPlayers && this.onFieldPlayers.length) {
      this.onFieldPlayers = this.onFieldPlayers.filter(
        (onFieldPlayer) => onFieldPlayer.name !== player.name
      );
    }
    this.updateOrder();
  }

  handleGoalMouseDown(event: MouseEvent) {
    if (this.enableGoalArea) {
      const x = event.offsetX;
      const y = event.offsetY;

      const normalizedX = Math.round(
        (x / this.goalContainer.nativeElement.offsetWidth) * this.xScale
      );

      const normalizedY = Math.round(
        (y / this.goalContainer.nativeElement.offsetHeight) * this.yScale
      );

      const gX = normalizedX.toString();
      const gY = normalizedY.toString();

      // Check if Ontarget shots are inside a given limit
      if (['Goal', 'Saved'].includes(this.subtagsSelected.outcome)) {
        if (normalizedX < 12 || normalizedX > 109 || 16 > normalizedY) {
          alert('Please tag inside the goal frame');
        }
      }

      this.goalAreaSelected = { gx: gX, gy: gY };

      const dot = document.createElement('div');
      dot.className = 'red-dot';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;

      this.goalContainer.nativeElement.appendChild(dot);
    }
  }
}
