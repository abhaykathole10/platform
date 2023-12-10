import { Component, OnInit } from '@angular/core';
import { DataItem } from '../models/event-data.model';
import { EventService } from '../services/event.service';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventData: DataItem;
  dataItems: DataItem[] = [];

  constructor(
    private eventService: EventService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.dataItems = this.eventService.getDataArray();
    console.log('dataItems => ', this.dataItems);
  }

  onDeleteLast() {
    this.eventService.removeLastEntry();
  }

  onExportCSV() {
    const data = this.eventService.getDataArray();
    this.exportService.exportToCsv(data, 'event-data.csv');
  }
}
