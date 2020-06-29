import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private players: string[];
  private playersAbbr: string[];
  private results: number[][];
  private resultsTotal: number[][];
  private count: number[];

  // Usage
  // first: set setPlayersCount
  // second: setPlayer
  // third: addResults

  constructor(private utils: UtilsService
    , private persistence: PersistenceService) {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
    this.count = new Array<number>(0);
  }

  setPlayersCount(count: number) {
    this.players = new Array<string>(count);
    this.count = new Array<number>(count);
    this.playersAbbr = new Array<string>(count);
  }

  getCount() { return this.count; }
  getPlayers() { return this.players; }
  getPlayersAbbr() { return this.playersAbbr; }
  getResults() { return this.results; }
  getResultsTotal() { return this.resultsTotal; }

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

  addResults(values: number[]) {
    this.results.push(new Array<number>(this.players.length));
    this.results[this.results.length - 1] = values;

    this.addResultsTotal(values);

    // Storage data
    this.persistence.saveObject(this.persistence.RESULTS_LIST, this.results);
    this.persistence.saveObject(this.persistence.RESULTS_TOTAL_LIST, this.resultsTotal);
  }

  addResultsTotal(values: number[]) {

    if (this.results.length > 0) {
      this.resultsTotal.push(new Array<number>(this.players.length));

      if (this.results.length > 1) {
        for (let x = 0; x < values.length; x++) {
          values[x] = parseInt(values[x].toString()) + parseInt(this.results[this.results.length - 2][x].toString());
        }
      }

      this.resultsTotal[this.results.length - 1] = values;
    }
  }

  loadResults(values: number[][], valuesTotal: number[][]) {
    this.results = values;
    this.resultsTotal = valuesTotal;
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

  showNames() {
    console.table(this.players);
  }

  removeResults(){
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();

    this.persistence.removeItem(this.persistence.RESULTS_LIST);
    this.persistence.removeItem(this.persistence.RESULTS_TOTAL_LIST);
  }

  resetValues() {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
    this.count = new Array<number>(0);
  }
}
