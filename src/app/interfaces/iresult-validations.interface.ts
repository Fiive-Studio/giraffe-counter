import { ResultClass, PlayerStatus, AddResultResponse } from '../services/results/generic-results.service';

export interface IResultsValidations {
    showSplit(pos: number, count: number): boolean;
    getClass(player: PlayerStatus): ResultClass
    validateValue(value: number, player: PlayerStatus): number;
    isPossibleAddValue(playersStatus: PlayerStatus[], currentPos: number): AddResultResponse;
    validateReincarnate(playersStatus: PlayerStatus[]): number[]
}