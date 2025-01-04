import { ColorPickerRGBType } from 'primereact/colorpicker';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { enUS, es } from 'date-fns/locale';

// Mapping of locales to the corresponding date-fns locale object
const localeMap = {
    en: enUS,
    es: es,
};

// Function to format a currency value based on currency
export function formatCurrency(value: number, currency: string = 'USD'): string {
    const locale = currency === 'EUR' ? 'es-ES' : 'en-US';
    return value.toLocaleString(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

// Function to get the current date formatted according to the locale
export function getCurrentDate(locale: string = 'en', dateFormat: string = 'MM/DD/YYYY', timeFormat: string = '12h'): string {
    const today = new Date();
    const currentLocale = localeMap[locale as 'en' | 'es'] || enUS;

    // Determine date format according to user preference
    let formatString = '';
    if (dateFormat === 'DD/MM/YYYY') {
        formatString = 'EEE, dd MMM yyyy';
    } else {
        formatString = 'EEE, MMM dd yyyy';
    }

    // Add time format if necessary
    if (timeFormat === '12h') {
        formatString += ' hh:mm a';
    } else {
        formatString += ' HH:mm';
    }

    return format(today, formatString, { locale: currentLocale });
}

// Function to format a given date-time value in UTC to locale-specific format
export const formatDateTime = (
    isoDate: string,
    locale: string,
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY',
    timeFormat: '12h' | '24h'
): string => {
    const date = new Date(isoDate);
    const utcDate = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );

    const currentLocale = localeMap[locale as 'en' | 'es'] || enUS;
    let formatString = dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
    formatString += timeFormat === '12h' ? ', hh:mm:ss a' : ', HH:mm:ss';

    return format(utcDate, formatString, { locale: currentLocale });
};

// Function to convert RGB values to hexadecimal format
export function rgbToHex({ r, g, b }: ColorPickerRGBType): string {
    // Convert RGB values to a single hex string
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Hook to get translated month names, useful for dropdowns or labels
export const useMonthNames = () => {
    const { t } = useTranslation();

    // Return an array of translated month names and their short values
    return [
        { name: t('dashboard.common.months.january'), value: t('dashboard.common.months.jan') },
        { name: t('dashboard.common.months.february'), value: t('dashboard.common.months.feb') },
        { name: t('dashboard.common.months.march'), value: t('dashboard.common.months.mar') },
        { name: t('dashboard.common.months.april'), value: t('dashboard.common.months.apr') },
        { name: t('dashboard.common.months.may'), value: t('dashboard.common.months.may_short') },
        { name: t('dashboard.common.months.june'), value: t('dashboard.common.months.jun') },
        { name: t('dashboard.common.months.july'), value: t('dashboard.common.months.jul') },
        { name: t('dashboard.common.months.august'), value: t('dashboard.common.months.aug') },
        { name: t('dashboard.common.months.september'), value: t('dashboard.common.months.sep') },
        { name: t('dashboard.common.months.october'), value: t('dashboard.common.months.oct') },
        { name: t('dashboard.common.months.november'), value: t('dashboard.common.months.nov') },
        { name: t('dashboard.common.months.december'), value: t('dashboard.common.months.dec') }
    ];
};

// Hook to get translated month options for dropdowns
export const useMonthOptions = () => {
    const { t } = useTranslation(); // Translation function

    // Return an array of translated month names with corresponding values for selection options
    return [
        { value: '01', label: t('dashboard.common.months.january') },
        { value: '02', label: t('dashboard.common.months.february') },
        { value: '03', label: t('dashboard.common.months.march') },
        { value: '04', label: t('dashboard.common.months.april') },
        { value: '05', label: t('dashboard.common.months.may') },
        { value: '06', label: t('dashboard.common.months.june') },
        { value: '07', label: t('dashboard.common.months.july') },
        { value: '08', label: t('dashboard.common.months.august') },
        { value: '09', label: t('dashboard.common.months.september') },
        { value: '10', label: t('dashboard.common.months.october') },
        { value: '11', label: t('dashboard.common.months.november') },
        { value: '12', label: t('dashboard.common.months.december') }
    ];
};
