import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { EventService } from '../services/event.service';
import { PlayersService } from '../services/players.service';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  @Input() areAllPlayersFilled = false;
  @Input() editModeON = true;
  @Input() videoUploaded: boolean = false;
  url: any;
  format: string;
  videoYtUrl: string;
  source: string;

  @Output() taggingButtonClicked = new EventEmitter<any>();
  @Output() onVideoUpload = new EventEmitter<any>();
  @Output() switchSideButtonClicked = new EventEmitter<any>();

  @ViewChild('closeModal') closeModal: ElementRef;

  taggingButtonLabel = 'Start Tagging';
  currentMode = 'Welcome!';

  switchValue = '';
  switchSideValue = false;
  currentTeam: string = '';
  teamReadOnly: boolean = false;

  constructor(
    private eventService: EventService,
    private playersService: PlayersService,
    private exportService: ExportService
  ) {}

  @ViewChild('fileInput') fileInput: ElementRef;

  onTaggingButtonClicked(event: any) {
    this.editModeON = !this.editModeON;
    this.switchValue = this.editModeON ? '' : 'ballerMetrics';
    this.currentMode = this.editModeON ? 'Edit mode' : 'Tagging mode';
    this.teamReadOnly = this.currentMode === 'Tagging mode' ? true : false;
    this.taggingButtonClicked.emit({
      buttonLabel: this.taggingButtonLabel,
      teamName: this.currentTeam,
      isEditable: this.editModeON,
    });
    this.taggingButtonLabel = this.editModeON
      ? 'Start Tagging'
      : 'Stop tagging';
  }

  openModalClicked() {
    if (this.url) {
      this.fileInput.nativeElement.value = '';
      this.url = undefined;
      this.videoUploaded = false;
    }
  }

  // for YOUTUBE video
  handleYoutubeUpload() {
    if (this.videoYtUrl) {
      this.source = 'youtube';
      this.videoUploaded = true;
      this.url = this.videoYtUrl;
    }
  }

  // for LOCAL video
  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.source = 'local';
        this.videoUploaded = true;
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  onDoneClick() {
    if (this.url) {
      this.onVideoUpload.emit({
        source: this.source,
        url: this.url,
        videoUploaded: this.videoUploaded,
        format: this.format,
      });
      this.closeModal.nativeElement.click();
    } else {
      alert('Please upload a video');
    }
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
    }
  }
}
