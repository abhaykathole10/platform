import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataItem } from '../models/event-data.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor() {}

  eventDataArray: DataItem[] = [];

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  sendData(data: DataItem) {
    this.dataSubject.next(data);
    this.eventDataArray.push(data);
    localStorage.setItem('event-data', JSON.stringify(data));
  }

  getDataArray() {
    return this.eventDataArray;
  }

  removeLastEntry() {
    this.eventDataArray.pop();
  }
}
