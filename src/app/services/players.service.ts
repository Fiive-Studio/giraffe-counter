import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { PersistenceService } from './persistence.service';
import { IResults } from '../interfaces/iresult.interface';
import { GenericResultsService, AddResultResponse } from './results/generic-results.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private players: string[];
  private playersAbbr: string[];
  private count: number[];
  private results: IResults;
  private countType: string;
  private currentPlayer = new BehaviorSubject<string>('');
  currentPlayer$ = this.currentPlayer.asObservable();

  // Usage
  // first: set setPlayersCount
  // second: setPlayer
  // third: setTurn
  // fourth: addResults

  constructor(private utils: UtilsService
    , private persistence: PersistenceService) {
    this.count = new Array<number>(0);
    this.results = new GenericResultsService(persistence);

    this.results.currentTurn$.subscribe((e) => {
      if (this.players != undefined) {
        this.currentPlayer.next(this.players[e]);
      }
    });
  }

  setPlayersCount(count: number) {
    this.players = new Array<string>(count);
    this.count = new Array<number>(count);
    this.playersAbbr = new Array<string>(count);
    this.results.setCount(count);
  }

  async setTurn() { 
    const currentTurn = await this.persistence.getValue(this.results.PLAYER_TURN);
    if(currentTurn == null){
      this.currentPlayer.next(this.players[0]); // defaultTurn
    }else{
      this.currentPlayer.next(this.players[parseInt(currentTurn)]);
    }
  }

  setCountType(type: string) {
    this.countType = type;
    this.results.setCountType(this.countType);
  }

  getCountType(): string { return this.countType; }
  getCount(): number[] { return this.count; }
  getPlayers(): string[] { return this.players; }
  getPlayersAbbr(): string[] { return this.playersAbbr; }
  getResults(): number[][] { return this.results.getResults(); }
  getResultsTotal(): number[][] { return this.results.getResultsTotal(); }
  getClass(pos: number): string { return this.results.getClass(pos); }
  showTurn(): boolean { return this.results.showTurn(); }

  setPlayer(name: string, pos: number) {
    this.players[pos] = name;
    this.setPlayerAbbr(pos);
    this.setTurn();
  }

  setPlayers(names: string[]) {
    this.players = names;
    for (let x = 0; x < this.players.length; x++) {
      this.setPlayerAbbr(x);
    }
    this.setTurn();
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

  editResult(pos: number, value: number) {
    let result = this.results.editResult(pos, value);
    
    // Storage data
    this.persistence.saveObject(this.persistence.RESULTS_LIST, this.results.getResults());
    this.persistence.saveObject(this.persistence.RESULTS_TOTAL_LIST, this.results.getResultsTotal());
    this.results.persist();
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
    this.countType = undefined;
  }
}
