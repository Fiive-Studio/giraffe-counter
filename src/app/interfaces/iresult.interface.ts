import { AddResultResponse } from '../services/results/generic-results.service';
import { Observable } from 'rxjs';

export interface IResults {
    currentTurn$: Observable<number>;

    setCount(count: number): void;
    addResult(pos: number, value: number): AddResultResponse;
    addResults(values: number[]): void;
    loadResults(values: number[][], valuesTotal: number[][]): void;
    resetValues(): void;
    getResults(): number[][];
    getResultsTotal(): number[][];
    persist(): void;
    removePersist(): void;
    getClass(pos: number): string;
    showTurn(): boolean;
    setCountType(type: string);
}