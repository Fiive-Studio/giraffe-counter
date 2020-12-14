import { Injectable } from '@angular/core';
import { IResults } from 'src/app/interfaces/iresult.interface';
import { PersistenceService } from '../persistence.service';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { ChinchonValidationsService } from './chinchon-validations.service';
import { BehaviorSubject } from 'rxjs';
import { GenericValidationsService } from './generic-validations.service';
import { PositiveNumbersService } from './positive-numbers.service';

export class PlayerStatus {
  posActual: number = 0;
  currentValue: number = 0;
  extras: {} = {};
}

export enum ResultClass {
  default,
  alert,
  miss
}

export class AddResultResponse {
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenericResultsService implements IResults {

  private count: number;
  private results: number[][];
  private resultsTotal: number[][];
  private playersStatus: PlayerStatus[];
  private validations: IResultsValidations;
  PLAYER_STATUS: string = 'gr-player-status';
  PLAYER_TURN: string = 'gr-player-turn';
  DEFAULT_CLASS = 'default';
  ALERT_CLASS = 'alert';
  MISS_CLASS = 'miss';

  private currentTurn = new BehaviorSubject<number>(0);
  currentTurn$ = this.currentTurn.asObservable();

  constructor(private persistence: PersistenceService) {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
  }

  getResults(): number[][] { return this.results; }
  getResultsTotal(): number[][] { return this.resultsTotal; }
  getClass(pos: number): string {
    let rClass = this.validations.getClass(this.playersStatus[pos])
    if (rClass == ResultClass.default) { return this.DEFAULT_CLASS; }
    else if (rClass == ResultClass.alert) { return this.ALERT_CLASS; }
    else if (rClass == ResultClass.miss) { return this.MISS_CLASS; }
  }

  showTurn(): boolean { return this.validations.showTurn(); }

  setCountType(type: string) {
    if (type == "0") { this.validations = new GenericValidationsService(); }
    else if (type == "1") { this.validations = new ChinchonValidationsService(); }
    else if (type == "2") { this.validations = new PositiveNumbersService(); }

    if (this.validations.currentTurn$ != undefined) {
      this.validations.currentTurn$.subscribe((e) => {
        if (e != -1) {
          this.persistTurn(e);
          this.currentTurn.next(e);
        }
      });
    }
  }
  setCount(count: number): void {
    this.count = count;
    this.playersStatus = new Array<PlayerStatus>(count);
  }

  addResult(pos: number, value: number): AddResultResponse {

    let validation = this.validations.isPossibleAddValue(this.playersStatus, pos);
    if (validation.status) {

      if (this.playersStatus[pos] == undefined) { this.playersStatus[pos] = new PlayerStatus(); }

      let posToValidate = this.playersStatus[pos].posActual;

      if (this.results[posToValidate] == undefined) {
        this.results.push(new Array<number>(this.count));
      }
      this.results[posToValidate][pos] = value;

      this.addResultTotal(pos, value);
      this.playersStatus[pos].posActual++;

      let updateValues = this.validations.validateReincarnate(this.playersStatus, true);
      if (updateValues != null) { this.updateReincarnate(updateValues); }

      return validation;
    }

    return validation;
  }

  addResultTotal(pos: number, value: number) {
    if (this.results.length > 0) {

      let posToValidate = this.playersStatus[pos].posActual;

      if (this.resultsTotal[posToValidate] == undefined) {
        this.resultsTotal.push(new Array<number>(this.count));
      }

      if (posToValidate > 0) {
        value = value + this.resultsTotal[posToValidate - 1][pos];
      }

      let newValue = this.validations.validateValue(value, this.playersStatus[pos]);
      this.resultsTotal[posToValidate][pos] = newValue;
      this.playersStatus[pos].currentValue = newValue;
    }
  }

  addResults(values: number[]): void {
    this.results.push(new Array<number>(this.count));
    this.results[this.results.length - 1] = values;

    this.addResultsTotal(values);
    for (let i = 0; i < this.playersStatus.length; i++) { this.playersStatus[i].posActual++; }

    let updateValues = this.validations.validateReincarnate(this.playersStatus, true);
    if (updateValues != null) { this.updateReincarnate(updateValues); }
  }

  addResultsTotal(values: number[]) {

    if (this.results.length > 0) {
      this.resultsTotal.push(new Array<number>(this.count));

      if (this.results.length > 1) {
        for (let x = 0; x < values.length; x++) {
          let newValue = parseInt(values[x].toString()) + parseInt(this.results[this.results.length - 2][x].toString());
          values[x] = this.validations.validateValue(newValue, this.playersStatus[x]);
        }
      }

      this.resultsTotal[this.results.length - 1] = values;
    }
  }

  editResult(pos: number, value: number): void {

    if(this.results[this.results.length - 1][pos] == undefined){ return; }
    this.results[this.results.length - 1][pos] += value;

    let newValue = this.validations.validateValue((this.resultsTotal[this.results.length - 1][pos] + value), this.playersStatus[pos]);
    this.resultsTotal[this.results.length - 1][pos] = newValue;
    this.playersStatus[pos].currentValue = newValue;

    let updateValues = this.validations.validateReincarnate(this.playersStatus, false);
    if (updateValues != null) { this.updateReincarnate(updateValues); }
  }

  updateReincarnate(values: number[]) {
    let newValue = values[0];
    if (newValue == -1) { return; }
    for (let i = 1; i < values.length; i++) {
      this.resultsTotal[this.resultsTotal.length - 1][values[i]] = newValue;
      this.playersStatus[i].currentValue = newValue;
    }
  }

  async loadResults(values: number[][], valuesTotal: number[][]): Promise<void> {
    this.results = values;
    this.resultsTotal = valuesTotal;
    this.playersStatus = await this.persistence.getObject(this.PLAYER_STATUS);

    const value = await this.persistence.getValue(this.PLAYER_TURN);
    if (value != null) {
      this.currentTurn.next(parseInt(value));
      this.validations.loadCurrentTurn(parseInt(value));
    }
  }

  persist(): void {
    this.persistence.saveObject(this.PLAYER_STATUS, this.playersStatus);
  }

  persistTurn(pos: number): void {
    this.persistence.saveValue(this.PLAYER_TURN, pos.toString());
  }

  resetValues(): void {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
    this.playersStatus = new Array<PlayerStatus>(this.count);
    this.validations.loadCurrentTurn(0);
  }

  removePersist(): void {
    this.persistence.removeItem(this.PLAYER_STATUS);
    this.persistence.removeItem(this.PLAYER_TURN);
  }
}
