import { Injectable } from '@angular/core';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { Observable } from 'rxjs';
import { ResultClass, PlayerStatus, AddResultResponse } from './generic-results.service';

@Injectable({
  providedIn: 'root'
})
export class GenericValidationsService implements IResultsValidations {

  constructor() { }

  currentTurn$: Observable<number>;

  getClass(player: PlayerStatus): ResultClass {
    return ResultClass.default;
  }
  validateValue(value: number, player: PlayerStatus): number {
    return value;
  }
  isPossibleAddValue(playersStatus: PlayerStatus[], currentPos: number): AddResultResponse {
    return { status: true, message: null };
  }
  validateReincarnate(playersStatus: PlayerStatus[]): number[] {
    return null;
  }
  loadCurrentTurn(pos: number): void { }
  showTurn(): boolean { return false; }
}
