import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player, Player2 } from '../models/event-data.model';
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

  updatePlayerData(data: any[]) {
    this.playerDataArray = data;
    localStorage.setItem('player-data', JSON.stringify(this.playerDataArray));
    this.playerDataSubject.next(this.playerDataArray);
  }

  getPlayerData() {
    const storedPlayerData = localStorage.getItem('player-data');
    if (storedPlayerData) {
      const playerData = JSON.parse(storedPlayerData);
      if (playerData.length > 0) {
        this.playerDataArray = playerData;
      } else {
        this.playerDataArray = this.defaultPlayers;
      }
    } else {
      this.playerDataArray = this.defaultPlayers;
    }
    return this.playerDataArray;
  }

  getPlayerDataObservable() {
    return this.playerDataSubject.asObservable();
  }

  ///////////////////  ON-LIST PLAYERS DATA ///////////////////////

  private onListPlayerDataArray: Player2[] = [];
  private onListPlayerDataSubject = new BehaviorSubject<Player2[]>([]);

  updateOnListPlayerData(data: any[]) {
    this.onListPlayerDataArray = data;
    localStorage.setItem(
      'onlist-player-data',
      JSON.stringify(this.onListPlayerDataArray)
    );
    this.onListPlayerDataSubject.next(this.onListPlayerDataArray);
  }

  getOnListPlayerData() {
    const storedPlayerData = localStorage.getItem('onlist-player-data');
    this.onListPlayerDataArray = storedPlayerData
      ? JSON.parse(storedPlayerData)
      : [];
    return this.onListPlayerDataArray;
  }

  getOnListPlayerDataObservable() {
    return this.onListPlayerDataSubject.asObservable();
  }

  ///////////////////  ON-FIELD PLAYERS DATA  ///////////////////////

  private onFieldPlayerDataArray: Player2[] = [];
  private onFieldPlayerDataSubject = new BehaviorSubject<Player2[]>([]);

  updateOnFieldPlayerData(data: Player2[]) {
    this.onFieldPlayerDataArray = data;
    localStorage.setItem(
      'onfield-player-data',
      JSON.stringify(this.onFieldPlayerDataArray)
    );
    this.onFieldPlayerDataSubject.next(this.onFieldPlayerDataArray);
  }

  getOnFieldPlayerData() {
    const storedPlayerData = localStorage.getItem('onfield-player-data');
    this.onFieldPlayerDataArray = storedPlayerData
      ? JSON.parse(storedPlayerData)
      : [];
    return this.onFieldPlayerDataArray;
  }

  getOnFieldPlayerDataObservable() {
    return this.onFieldPlayerDataSubject.asObservable();
  }

  ///////////////////  RESET PLAYER DATA  /////////////////////////

  resetAllPlayers() {
    this.playerDataArray = [];
    this.onFieldPlayerDataArray = [];
    this.onListPlayerDataArray = [];
    this.notifySubscribers();
  }

  private notifySubscribers() {
    localStorage.setItem('player-data', JSON.stringify(this.playerDataArray));
    localStorage.setItem(
      'onfield-player-data',
      JSON.stringify(this.onFieldPlayerDataArray)
    );
    localStorage.setItem(
      'onlist-player-data',
      JSON.stringify(this.onListPlayerDataArray)
    );
    localStorage.removeItem('playing');
    localStorage.removeItem('formation');
    this.playerDataSubject.next(this.playerDataArray);
    this.onFieldPlayerDataSubject.next(this.onFieldPlayerDataArray);
    this.onListPlayerDataSubject.next(this.onListPlayerDataArray);
  }

  ////////////////////  PLAYING AND FORMATION ///////////////////////

  setConfiguration(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  getConfiguration(key: string) {
    return localStorage.getItem(key) ? localStorage.getItem(key) : '';
  }
}
