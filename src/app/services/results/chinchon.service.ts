import { Injectable } from '@angular/core';
import { IResults } from 'src/app/interfaces/iresult.interface';

export class PlayerStatus {
  posActual: number = -1;
}

@Injectable({
  providedIn: 'root'
})
export class ChinchonService implements IResults {

  private count: number;
  private results: number[][];
  private resultsTotal: number[][];
  private playersStatus: PlayerStatus[];

  constructor() {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
  }

  getResults(): number[][] { return this.results; }
  getResultsTotal(): number[][] { return this.resultsTotal; }
  setCount(count: number): void {
    this.count = count;
    this.playersStatus = new Array<PlayerStatus>(count);
  }

  addResult(pos: number, value: number): void {
    if (this.playersStatus[pos] == undefined) { this.playersStatus[pos] = new PlayerStatus(); }

    let posToValidate = this.playersStatus[pos].posActual == -1 ? 0 : this.playersStatus[pos].posActual;

    if (this.results[posToValidate] == undefined) {
      this.results.push(new Array<number>(this.count));
    }
    this.results[posToValidate][pos] = value;

    this.addResultTotal(pos, value);
    this.playersStatus[pos].posActual++;

    console.table(this.results);
    console.table(this.resultsTotal);
  }

  addResultTotal(pos: number, value: number) {
    if (this.results.length > 0) {
      let posToValidate = this.playersStatus[pos].posActual == -1 ? 0 : this.playersStatus[pos].posActual;

      if (this.resultsTotal[posToValidate] == undefined) {
        this.resultsTotal.push(new Array<number>(this.count));
      }

      if (posToValidate > 0) {
        value = value + this.results[posToValidate][pos];
      }

      this.resultsTotal[posToValidate][pos] = value;
    }
  }

  addResults(values: number[]): void {
    this.results.push(new Array<number>(this.count));
    this.results[this.results.length - 1] = values;

    this.addResultsTotal(values);
    for (let i = 0; i < this.playersStatus.length; i++) { this.playersStatus[i].posActual++; }
  }

  addResultsTotal(values: number[]) {

    if (this.results.length > 0) {
      this.resultsTotal.push(new Array<number>(this.count));

      if (this.results.length > 1) {
        for (let x = 0; x < values.length; x++) {
          values[x] = parseInt(values[x].toString()) + parseInt(this.results[this.results.length - 2][x].toString());
        }
      }

      this.resultsTotal[this.results.length - 1] = values;
    }
  }

  resetValues(): void {
    this.results = new Array<number[]>();
    this.resultsTotal = new Array<number[]>();
  }

  loadResults(values: number[][], valuesTotal: number[][]): void {
    this.results = values;
    this.resultsTotal = valuesTotal;
  }

  showSplit(pos: number): boolean {
    return ((pos + 1) % this.count) == 0;
  }
}
