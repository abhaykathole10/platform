import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/event-data.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private defaultPlayers: Player[] = [
    { id: 'p0', jersey: 'fc', name: 'baller', class: 'p0', selected: false },
    { id: 'p1', jersey: '25', name: 'Buffon', class: 'p1', selected: false },
    { id: 'p2', jersey: '12', name: 'Camavinga', class: 'p2', selected: false },
    { id: 'p3', jersey: '5', name: 'Maguire', class: 'p3', selected: false },
    { id: 'p4', jersey: '2', name: 'Saliba', class: 'p4', selected: false },
    { id: 'p5', jersey: '66', name: 'Trent', class: 'p5', selected: false },
    { id: 'p6', jersey: '22', name: 'Isco', class: 'p6', selected: false },
    { id: 'p7', jersey: '41', name: 'Rice', class: 'p7', selected: false },
    { id: 'p8', jersey: '10', name: 'Zidane', class: 'p8', selected: false },
    { id: 'p9', jersey: '7', name: 'Grealish', class: 'p9', selected: false },
    { id: 'p10', jersey: '9', name: 'Halland', class: 'p10', selected: false },
    { id: 'p11', jersey: '11', name: 'Salah', class: 'p11', selected: false },
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
