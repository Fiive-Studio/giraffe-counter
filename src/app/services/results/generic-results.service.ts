import { Injectable } from '@angular/core';
import { IResults } from 'src/app/interfaces/iresult.interface';
import { PersistenceService } from '../persistence.service';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { ChinchonValidationsService } from './chinchon-validations.service';

export class PlayerStatus {
  posActual: number = 0;
  currentValue: number = 0;
  extras: {} = {};
}

export enum ResultClass {
  default,
  alert
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
  PLAYER_STATUS: string = 'cc-player-status';
  DEFAULT_CLASS = 'default';
  ALERT_CLASS = 'alert';

  constructor(private persistence: PersistenceService) {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
    this.validations = new ChinchonValidationsService();
  }

  getResults(): number[][] { return this.results; }
  getResultsTotal(): number[][] { return this.resultsTotal; }
  getClass(pos: number): string {
    let rClass = this.validations.getClass(this.playersStatus[pos])
    if (rClass == ResultClass.default) { return this.DEFAULT_CLASS; }
    else if (rClass == ResultClass.alert) { return this.ALERT_CLASS; }
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

      let updateValues = this.validations.validateReincarnate(this.playersStatus);
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

    let updateValues = this.validations.validateReincarnate(this.playersStatus);
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

  updateReincarnate(values: number[]) {
    let newValue = values[0];
    for (let i = 1; i < values.length; i++) {
      this.resultsTotal[this.resultsTotal.length - 1][values[i]] = newValue;
    }
  }

  resetValues(): void {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
    this.playersStatus = new Array<PlayerStatus>(this.count);
  }

  async loadResults(values: number[][], valuesTotal: number[][]): Promise<void> {
    this.results = values;
    this.resultsTotal = valuesTotal;
    this.playersStatus = await this.persistence.getObject(this.PLAYER_STATUS);
  }

  showSplit(pos: number): boolean {
    return this.validations.showSplit(pos, this.count);
  }

  persist(): void {
    this.persistence.saveObject(this.PLAYER_STATUS, this.playersStatus);
  }

  removePersist(): void {
    this.persistence.removeItem(this.PLAYER_STATUS);
  }
}
