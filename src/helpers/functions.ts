import { ColorPickerRGBType } from "primereact/colorpicker";
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

const localeMap = {
    en: enUS,
    es: es,
};

export function formatCurrency(value: number, locale: string = 'en-US'): string {
    const currency = locale === 'es' ? 'EUR' : 'USD';
    return value.toLocaleString(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

export function getCurrentDate(locale: string = 'en'): string {
    const today = new Date();
    const currentLocale = localeMap[locale as 'en' | 'es'] || enUS;

    const dateFormat = locale === 'en' ? 'EEE, MMM do, yyyy' : 'EEE, d MMM yyyy';

    return format(today, dateFormat, { locale: currentLocale });
}

export function formatDateTime(value: string, locale: string = 'en'): string {
    const date = new Date(value);
    const currentLocale = localeMap[locale as 'en' | 'es'] || enUS;
    return format(date, 'Pp', { locale: currentLocale });
}

export function rgbToHex({ r, g, b }: ColorPickerRGBType): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
