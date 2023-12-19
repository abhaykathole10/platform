import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/event-data.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private defaultPlayers: Player[] = [
    { id: 'p1', jersey: '1', name: 'Navas', class: 'p1', selected: false },
    { id: 'p2', jersey: '33', name: 'Maldini', class: 'p2', selected: false },
    { id: 'p3', jersey: '3', name: 'Rudiger', class: 'p3', selected: false },
    { id: 'p4', jersey: '4', name: 'Ramos', class: 'p4', selected: false },
    { id: 'p5', jersey: '66', name: 'Trent', class: 'p5', selected: false },
    { id: 'p6', jersey: '8', name: 'Kroos', class: 'p6', selected: false },
    { id: 'p7', jersey: '5', name: 'Busquets', class: 'p7', selected: false },
    { id: 'p8', jersey: '10', name: 'Modric', class: 'p8', selected: false },
    { id: 'p9', jersey: '7', name: 'Cristiano', class: 'p9', selected: false },
    { id: 'p10', jersey: '9', name: 'Halland', class: 'p10', selected: false },
    { id: 'p11', jersey: '30', name: 'Messi', class: 'p11', selected: false },
  ];

  private playerDataArray: Player[] = [];
  private playerDataSubject = new BehaviorSubject<Player[]>([]);

  constructor() {
    this.playerDataSubject.next(this.playerDataArray);
  }

  updatePlayerData(data: Player[]) {
    this.playerDataArray = data;
    localStorage.setItem('player-data', JSON.stringify(this.playerDataArray));
    this.playerDataSubject.next(this.playerDataArray);
  }

  getPlayerData() {
    const storedPlayerData = localStorage.getItem('player-data');
    this.playerDataArray = storedPlayerData
      ? JSON.parse(storedPlayerData)
      : this.defaultPlayers;
    return this.playerDataArray;
  }

  getPlayerDataObservable() {
    return this.playerDataSubject.asObservable();
  }

  resetAllPlayers() {
    this.playerDataArray = this.defaultPlayers;
    this.notifySubscribers();
  }

  private notifySubscribers() {
    localStorage.setItem('player-data', JSON.stringify(this.playerDataArray));
    this.playerDataSubject.next(this.playerDataArray);
  }
}
