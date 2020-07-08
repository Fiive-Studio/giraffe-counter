import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { PersistenceService } from './persistence.service';
import { IResults } from '../interfaces/iresult.interface';
import { GenericResultsService, AddResultResponse } from './results/generic-results.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private players: string[];
  private playersAbbr: string[];
  private count: number[];
  private results: IResults;

  // Usage
  // first: set setPlayersCount
  // second: setPlayer
  // third: addResults

  constructor(private utils: UtilsService
    , private persistence: PersistenceService) {
    this.count = new Array<number>(0);
    this.results = new GenericResultsService(persistence);
  }

  setPlayersCount(count: number) {
    this.players = new Array<string>(count);
    this.count = new Array<number>(count);
    this.playersAbbr = new Array<string>(count);
    this.results.setCount(count);
  }

  getCount(): number[] { return this.count; }
  getPlayers(): string[] { return this.players; }
  getPlayersAbbr(): string[] { return this.playersAbbr; }
  getResults(): number[][] { return this.results.getResults(); }
  getResultsTotal(): number[][] { return this.results.getResultsTotal(); }
  showSplit(pos: number): boolean { return this.results.showSplit(pos); }
  getClass(pos: number): string { return this.results.getClass(pos); }

  setPlayer(name: string, pos: number) {
    this.players[pos] = name;
    this.setPlayerAbbr(pos);
  }

  setPlayers(names: string[]) {
    this.players = names;
    for (let x = 0; x < this.players.length; x++) {
      this.setPlayerAbbr(x);
    }
  }

  setPlayerAbbr(pos: number) {
    this.playersAbbr[pos] = this.players[pos][0];
  }

  addResult(pos: number, value: number): AddResultResponse {
    let result = this.results.addResult(pos, value);
    if (result.status) {
      // Storage data
      this.persistence.saveObject(this.persistence.RESULTS_LIST, this.results.getResults());
      this.persistence.saveObject(this.persistence.RESULTS_TOTAL_LIST, this.results.getResultsTotal());
      this.results.persist();
      
      return result;
    }

    return result;
  }

  loadResults(values: number[][], valuesTotal: number[][]) {
    this.results.loadResults(values, valuesTotal);
  }

  validateNames(): boolean {
    for (let x = 0; x < this.players.length; x++) {
      if (this.utils.isNullOrEmpty(this.players[x])) {
        this.utils.showAlert("Error", "Debe digitar todos los nombres de los jugadores");
        return false;
      }
    }

    return true;
  }

  removePersistence() {
    this.results.resetValues();
    this.persistence.removeItem(this.persistence.RESULTS_LIST);
    this.persistence.removeItem(this.persistence.RESULTS_TOTAL_LIST);
    this.results.removePersist();
  }

  resetValues() {
    this.results.resetValues();
    this.count = new Array<number>(0);
  }
}
