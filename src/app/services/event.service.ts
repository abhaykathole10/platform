import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataItem } from '../models/event-data.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventDataArray: DataItem[] = [];
  private eventDataSubject = new BehaviorSubject<DataItem[]>([]);

  constructor() {
    this.eventDataArray = this.getAllEvents();
    this.eventDataSubject.next(this.eventDataArray);
  }

  addEventData(data: DataItem) {
    if (!this.eventDataArray) {
      this.eventDataArray = [];
    }
    this.eventDataArray.push(data);
    localStorage.setItem('event-data', JSON.stringify(this.eventDataArray));
    this.eventDataSubject.next(this.eventDataArray);
  }

  getAllEvents() {
    const storedEventData = localStorage.getItem('event-data');
    this.eventDataArray = storedEventData
      ? JSON.parse(storedEventData)
      : this.resetAll();
    return this.eventDataArray;
  }

  getEventDataObservable() {
    return this.eventDataSubject.asObservable();
  }

  removeLastEntry() {
    this.eventDataArray.pop();
    this.notifySubscribers();
  }

  deleteEventById(id: string) {
    const indexToDelete = this.eventDataArray.findIndex(
      (event) => event.id === id
    );
    if (indexToDelete !== -1) {
      this.eventDataArray.splice(indexToDelete, 1);
      this.notifySubscribers();
    }
  }

  resetAll() {
    this.eventDataArray = [];
    this.notifySubscribers();
  }

  private notifySubscribers() {
    localStorage.setItem('event-data', JSON.stringify(this.eventDataArray));
    this.eventDataSubject.next(this.eventDataArray);
  }
}
