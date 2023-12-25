import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/event-data.model';
import { ALLPLAYERS } from '../shared/app.constants';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private defaultPlayers: Player[] = ALLPLAYERS;

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
