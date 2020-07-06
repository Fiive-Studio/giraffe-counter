export interface IResults {
    setCount(count: number): void;
    showSplit(pos: number): boolean;
    addResult(pos: number, value: number): boolean;
    addResults(values: number[]): void;
    loadResults(values: number[][], valuesTotal: number[][]): void;
    resetValues(): void;
    getResults(): number[][];
    getResultsTotal(): number[][];
    persist(): void;
    removePersist(): void;
    getClass(pos: number): string;
}