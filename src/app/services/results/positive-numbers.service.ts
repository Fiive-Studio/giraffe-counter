import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { PlayerStatus, ResultClass, AddResultResponse } from './generic-results.service';

@Injectable({
  providedIn: 'root'
})
export class PositiveNumbersService implements IResultsValidations {

  constructor() { }

  currentTurn$: Observable<number>;

  getClass(player: PlayerStatus): ResultClass {
    return ResultClass.default;
  }
  validateValue(value: number, player: PlayerStatus): number {
    if (value < 0) { return 0; }
    return value;
  }
  isPossibleAddValue(playersStatus: PlayerStatus[], currentPos: number): AddResultResponse {
    return { status: true, message: null };
  }
  validateReincarnate(playersStatus: PlayerStatus[], changeTurn: boolean): number[] {
    return null;
  }
  loadCurrentTurn(pos: number): void { }
  showTurn(): boolean { return false; }
}
