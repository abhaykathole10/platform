import { Component, OnInit } from '@angular/core';
import { DataItem } from '../models/event-data.model';
import { EventService } from '../services/event.service';
import { ExportService } from '../services/export.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventData: DataItem;
  dataItems: DataItem[] = [];
  private eventDataSubscription: Subscription;

  constructor(
    private eventService: EventService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    // this.dataItems = this.eventService.getAllEvents();
    this.eventDataSubscription = this.eventService
      .getEventDataObservable()
      .subscribe((data) => {
        this.dataItems = data;
      });
  }

  deleteEvent(event: DataItem) {
    this.eventService.deleteEventById(event.id);
  }

  onExportCSV() {
    const eventsData = this.eventService.getAllEvents();
    this.exportService.exportToCsv(eventsData, 'bm-events-data.csv');
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.eventDataSubscription.unsubscribe();
  }
}
