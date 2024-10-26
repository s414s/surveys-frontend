export function rangeArray(min: number, max: number): number[] {
    if (min > max) {
        throw new Error("Start value must be less than or equal to end value");
    }

    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}