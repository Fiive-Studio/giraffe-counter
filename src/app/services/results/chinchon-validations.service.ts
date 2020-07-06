import { Injectable } from '@angular/core';
import { IResultsValidations } from 'src/app/interfaces/iresult-validations.interface';
import { PlayerStatus, ResultClass } from './generic-results.service';

export enum PlayerState {
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

  validateValue(value: number, player: PlayerStatus): number {
    if (player.extras[this.PLAYER_STATE] == undefined) { player.extras[this.PLAYER_STATE] = PlayerState.active; };

    if (value < this.minValue) { return this.minValue; }
    if (value > this.maxValue) { player.extras[this.PLAYER_STATE] = PlayerState.reincarnate; }

    return value;
  }

  showSplit(pos: number, count: number): boolean {
    return ((pos + 1) % count) == 0;
  }

  getClass(player: PlayerStatus): ResultClass {
    if (player == undefined) { return ResultClass.default; }

    if (player.extras[this.PLAYER_STATE] == PlayerState.active) {
      return ResultClass.default;
    }
    else if (player.extras[this.PLAYER_STATE] != PlayerState.active) {
      return ResultClass.alert;
    }
  }
}
