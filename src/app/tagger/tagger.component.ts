import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DataItem, coordinate } from '../models/event-data.model';
import { EventService } from '../services/event.service';

type Lineup = {
  [key: string]: {
    name: string;
    jersey: string;
  };
};

@Component({
  selector: 'app-tagger',
  templateUrl: './tagger.component.html',
  styleUrls: ['./tagger.component.css'],
})
export class TaggerComponent {
  lineup: Lineup = {
    p1: { name: 'Cris', jersey: '7' },
    p2: { name: 'John', jersey: '4' },
    p3: { name: 'Stalin', jersey: '13' },
    p4: { name: 'Pope', jersey: '19' },
    p5: { name: 'Viktor', jersey: '3' },
    p6: { name: 'Arya', jersey: '32' },
    p7: { name: 'Susan', jersey: '92' },
    p8: { name: 'Ursula', jersey: '11' },
    p9: { name: 'Monica', jersey: '21' },
    p10: { name: 'Matt', jersey: '5' },
    p11: { name: 'Peter', jersey: '9' },
  };

  allPlayers = Object.keys(this.lineup).map((key) => ({
    id: key,
    jersey: this.lineup[key].jersey,
    name: this.lineup[key].name,
    class: key,
  }));

  allSubTags = [
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Through ball', category: 'pass' },
    { subtagname: 'SCP', category: ['pass', 'shot'] },
    { subtagname: 'CPLT', category: 'pass' },
    { subtagname: 'INCPLT', category: 'pass' },
    { subtagname: 'Goal', category: 'shot' },
    { subtagname: 'Right', category: 'shot' },
    { subtagname: 'Left', category: 'shot' },
    { subtagname: 'Head', category: 'shot' },
    { subtagname: 'Off-target', category: 'shot' },
    { subtagname: 'Saved', category: 'shot' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
    { subtagname: 'Assist', category: 'pass' },
  ];

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

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    if (this.allPlayersEnteredSuccessfully(this.lineup)) {
      this.areAllPlayersFilled = true;
    }
    this.loadAllPlayers();
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
    if (!this.allPlayersEnteredSuccessfully(this.lineup)) {
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

  allPlayersEnteredSuccessfully(playerObject: any) {
    for (const key in playerObject) {
      if (playerObject.hasOwnProperty(key)) {
        if (playerObject[key].name === '' || playerObject[key].jersey === '') {
          return false;
        }
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
      switch (event.key) {
        case 'p':
          this.currentEvent = 'pass';
          console.log('Event is PASS');
          break;
        case 's':
          this.currentEvent = 'shot';
          console.log('Event is SHOT');
          break;
      }
    }
  }

  loadAllPlayers() {
    this.allPlayers = Object.keys(this.lineup).map((key) => ({
      id: key,
      jersey: this.lineup[key].jersey,
      name: this.lineup[key].name,
      class: key,
    }));
  }

  handleClick(player: string) {
    if (this.editModeON) {
      const plyJersey = prompt('Enter jersey');
      const plyName = prompt('Enter player name');

      if (plyJersey !== null && plyName !== null) {
        const updatedLineup = { ...this.lineup };
        updatedLineup[player] = {
          ...updatedLineup[player],
          jersey: plyJersey,
          name: plyName,
        };

        // Update the lineup object reference
        this.lineup = updatedLineup;

        // Update allPlayers array
        this.loadAllPlayers();

        if (this.allPlayersEnteredSuccessfully(this.lineup)) {
          this.areAllPlayersFilled = true;
        }
      }
    } else {
      this.currentPlayerJersey = this.lineup[player].jersey;
      this.currentPlayerName = this.lineup[player].name;
      this.showPlayers = false;
    }
  }

  handleMapMouseDown(event: MouseEvent) {
    if (!this.showPlayers) {
      const x = event.offsetX;
      const y = event.offsetY;

      const normalizedX = Math.round(
        (x / this.pitchContainer.nativeElement.offsetWidth) * this.xScale
      ).toString();
      const normalizedY = Math.round(
        (y / this.pitchContainer.nativeElement.offsetHeight) * this.yScale
      ).toString();

      this.startCoordinates = { x: normalizedX, y: normalizedY };

      console.log(`Start Coordinates: (${normalizedX}, ${normalizedY})`);
    }
  }

  handleMapMouseUp(event: MouseEvent) {
    if (!this.showPlayers) {
      if (this.startCoordinates) {
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

        console.log(`End Coordinates: (${normalizedX}, ${normalizedY})`);

        this.eventCoordinates = {
          team: this.currentTeam,
          jersey: this.currentPlayerJersey,
          name: this.currentPlayerName,
          event: this.currentEvent,
          subtag: this.currentPlayerName,
          start: this.startCoordinates,
          end: this.endCoordinates,
        };

        console.log(this.eventCoordinates);

        this.eventService.sendData(this.eventCoordinates);

        this.startCoordinates = { x: '', y: '' };
      }
      this.showPlayers = true;
    }
  }
}
