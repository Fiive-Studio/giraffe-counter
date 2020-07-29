import { Injectable } from '@angular/core';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { PlayerStatus, ResultClass, AddResultResponse } from './generic-results.service';
import { BehaviorSubject } from 'rxjs';

export enum ChinchonPlayerState {
  active,
  reincarnate,
  miss
}

@Injectable({
  providedIn: 'root'
})
export class ChinchonValidationsService implements IResultsValidations {

  private minValue = 0;
  private maxValue = 100;
  private PLAYER_STATE = "player-state";
  private currentTurn = new BehaviorSubject<number>(-1);
  currentTurn$ = this.currentTurn.asObservable();
  private currentTurnPos: number = 0;

  constructor() { }

  isPossibleAddValue(playersStatus: PlayerStatus[], currentPos: number): AddResultResponse {

    let pos = 0;
    let currentPlayer = playersStatus[currentPos];
    if (currentPlayer == undefined) { return { status: true, message: null }; }
    if (currentPlayer.extras[this.PLAYER_STATE] == ChinchonPlayerState.miss) { return { status: false, message: "El jugador ya perdió" }; }

    const message = "Debe digitar los resultados de los demás jugadores";
    for (let x = 0; x < playersStatus.length; x++) {
      if (pos != currentPos) {
        let player = playersStatus[x];
        if (player == null) { return { status: false, message: message }; }

        if (player.extras[this.PLAYER_STATE] != ChinchonPlayerState.miss) {
          if (player.posActual != currentPlayer.posActual && player.posActual < currentPlayer.posActual) { return { status: false, message: message }; }
        }
      }
      pos++;
    }

    return { status: true, message: null };
  }

  validateValue(value: number, player: PlayerStatus): number {
    if (player.extras[this.PLAYER_STATE] == undefined) { player.extras[this.PLAYER_STATE] = ChinchonPlayerState.active; };

    if (value < this.minValue) { return this.minValue; }
    if (value > this.maxValue) {
      if (player.extras[this.PLAYER_STATE] == ChinchonPlayerState.reincarnate) { player.extras[this.PLAYER_STATE] = ChinchonPlayerState.miss; }
      else { player.extras[this.PLAYER_STATE] = ChinchonPlayerState.reincarnate; }
    }

    return value;
  }

  validateReincarnate(playersStatus: PlayerStatus[], changeTurn: boolean): number[] {
    let currentPos = -1;
    let biggerNumber = -1;
    let posToUpdate: number[] = [];
    let missPosition = -1;

    for (let x = 0; x < playersStatus.length; x++) {
      let player = playersStatus[x];
      if (player == null) { return null; }

      if (player.extras[this.PLAYER_STATE] != ChinchonPlayerState.miss) {
        if (currentPos == -1) { currentPos = player.posActual; }
        else if (currentPos != player.posActual) { return null; }

        if (biggerNumber < player.currentValue && player.currentValue <= this.maxValue) { biggerNumber = player.currentValue; }
        if (player.currentValue > this.maxValue) { posToUpdate.push(x); }
      } else {
        if (player.posActual > missPosition) { missPosition = player.posActual; }
      }
    }

    if (missPosition > currentPos) { return null; }
    if (changeTurn) { this.setTurn(playersStatus); }
    if (posToUpdate.length == 0) { return null; }
    posToUpdate.unshift(biggerNumber);
    return posToUpdate;
  }

  loadCurrentTurn(pos: number): void {
    this.currentTurnPos = pos;
    this.currentTurn.next(pos);
  }

  showTurn(): boolean { return true; }

  setTurn(playersStatus: PlayerStatus[]): void {
    do {
      this.currentTurnPos++;
      if (this.currentTurnPos == playersStatus.length) { this.currentTurnPos = 0; }
      if (playersStatus[this.currentTurnPos].extras[this.PLAYER_STATE] != ChinchonPlayerState.miss) { break; }
    } while (true);

    this.currentTurn.next(this.currentTurnPos);
  }

  getClass(player: PlayerStatus): ResultClass {
    if (player == undefined) { return ResultClass.default; }

    if (player.extras[this.PLAYER_STATE] == ChinchonPlayerState.active) {
      return ResultClass.default;
    }
    else if (player.extras[this.PLAYER_STATE] == ChinchonPlayerState.reincarnate) {
      return ResultClass.alert;
    }
    else { return ResultClass.miss; }
  }
}
