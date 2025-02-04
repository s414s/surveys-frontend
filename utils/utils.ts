export function rangeArray(min: number, max: number): number[] {
    if (min > max) {
        throw new Error("Start value must be less than or equal to end value");
    }

    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

export const capitalizeWord = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});

export function numberFormatter(minDigits: number, maxDigits: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: minDigits,
        maximumFractionDigits: maxDigits,
    });
}