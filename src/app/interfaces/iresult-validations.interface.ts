import { ResultClass, PlayerStatus, AddResultResponse } from '../services/results/generic-results.service';
import { Observable } from 'rxjs';

export interface IResultsValidations {
    currentTurn$: Observable<number>;

    getClass(player: PlayerStatus): ResultClass
    validateValue(value: number, player: PlayerStatus): number;
    isPossibleAddValue(playersStatus: PlayerStatus[], currentPos: number): AddResultResponse;
    validateReincarnate(playersStatus: PlayerStatus[]): number[]
    loadCurrentTurn(pos: number): void
}