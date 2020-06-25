import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private players: string[];
  private results: number[][];
  private count: number[];

  constructor(private utils: UtilsService) {
    this.results = new Array<number[]>();
    this.count = new Array<number>(0);
   }

  setPlayersCount(count: number) {
    this.players = new Array<string>(count);
    this.count = new Array<number>(count);
  }

  getCount() { return this.count; }
  getPlayers() { return this.players; }

  setResult(values: number[]) {
    this.results.push(new Array<number>(this.players.length));
    this.results[this.results.length - 1] = values;
  }

  getResults() {
    return this.results;
  }

  setPlayer(name: string, pos: number) {
    this.players[pos] = name;
  }

  getPlayer(pos: number): string {
    return this.players[pos];
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
