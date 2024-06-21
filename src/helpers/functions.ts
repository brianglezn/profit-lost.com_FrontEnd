import { ColorPickerRGBType } from "primereact/colorpicker";

export function formatCurrency(value: number): string {
    return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

export function getCurrentDate() {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    const today = new Date().toLocaleDateString("es-ES", options);
    return today;
}

export function formatDateTime(value: string): string {
    const date = new Date(value);
    return date.toLocaleString('es-ES', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

export function rgbToHex({ r, g, b }: ColorPickerRGBType): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
