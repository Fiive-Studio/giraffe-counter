import { ResultClass, PlayerStatus } from '../services/results/generic-results.service';

export interface IResultsValidations {
    showSplit(pos: number, count: number): boolean;
    getClass(player: PlayerStatus): ResultClass
    validateValue(value: number, player: PlayerStatus): number;
}