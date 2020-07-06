import { Injectable } from '@angular/core';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { PlayerStatus, ResultClass } from './generic-results.service';

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

  constructor() { }

  isPossibleAddValue(playersStatus: PlayerStatus[], currentPos: number): boolean {
    let pos = 0;
    let currentPlayer = playersStatus[currentPos];
    if (currentPlayer == undefined) { return true; }

    for (let x = 0; x < playersStatus.length; x++) {
      if (pos != currentPos) {
        let player = playersStatus[x];
        if (player == null) { return false; }

        if (player.extras[this.PLAYER_STATE] != ChinchonPlayerState.miss) {
          if (player.posActual != currentPlayer.posActual && player.posActual < currentPlayer.posActual) { return false; }
        }
      }
      pos++;
    }

    return true;
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

  validateReincarnate(playersStatus: PlayerStatus[]): number[] {
    let currentPos = -1;
    let biggerNumber = 0;
    let posToUpdate: number[] = [];

    for (let x = 0; x < playersStatus.length; x++) {
      let player = playersStatus[x];
      if (player == null) { return null; }

      if (player.extras[this.PLAYER_STATE] != ChinchonPlayerState.miss) {
        if (currentPos == -1) { currentPos = player.posActual; }
        else if (currentPos != player.posActual) { return null; }

        if (biggerNumber < player.currentValue && player.currentValue <= this.maxValue) { biggerNumber = player.currentValue; }
        if (player.currentValue > this.maxValue) { posToUpdate.push(x); }
      }
    }

    console.log("---");
    console.log(posToUpdate);

    return posToUpdate;
  }

  showSplit(pos: number, count: number): boolean {
    return ((pos + 1) % count) == 0;
  }

  getClass(player: PlayerStatus): ResultClass {
    if (player == undefined) { return ResultClass.default; }

    if (player.extras[this.PLAYER_STATE] == ChinchonPlayerState.active) {
      return ResultClass.default;
    }
    else if (player.extras[this.PLAYER_STATE] != ChinchonPlayerState.active) {
      return ResultClass.alert;
    }
  }
}
