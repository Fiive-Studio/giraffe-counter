import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private players: string[];
  private playersAbbr: string[];
  private results: number[][];
  private resultsTotal: number[][];
  private count: number[];

  constructor(private utils: UtilsService) {
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

  addResults(values: number[]) {
    this.results.push(new Array<number>(this.players.length));
    this.results[this.results.length - 1] = values;

    this.addResultsTotal(values);
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

  setPlayer(name: string, pos: number) {
    this.players[pos] = name;
    this.setPlayerAbbr(pos);
  }

  setPlayerAbbr(pos: number) {
    this.playersAbbr[pos] = this.players[pos][0];
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
}
