import { ColorPickerRGBType } from "primereact/colorpicker";
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
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

    const utcDate = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes()
    );

    const currentLocale = localeMap[locale as 'en' | 'es'] || enUS;
    const dateFormat = locale === 'en' ? 'MM/dd/yyyy, HH:mm' : 'dd/MM/yyyy, HH:mm';

    return format(utcDate, dateFormat, { locale: currentLocale });
}

export function rgbToHex({ r, g, b }: ColorPickerRGBType): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export const useMonthNames = () => {
    const { t } = useTranslation();

    return [
        { name: t("dashboard.common.months.january"), value: t("dashboard.common.months.jan") },
        { name: t("dashboard.common.months.february"), value: t("dashboard.common.months.feb") },
        { name: t("dashboard.common.months.march"), value: t("dashboard.common.months.mar") },
        { name: t("dashboard.common.months.april"), value: t("dashboard.common.months.apr") },
        { name: t("dashboard.common.months.may"), value: t("dashboard.common.months.may_short") },
        { name: t("dashboard.common.months.june"), value: t("dashboard.common.months.jun") },
        { name: t("dashboard.common.months.july"), value: t("dashboard.common.months.jul") },
        { name: t("dashboard.common.months.august"), value: t("dashboard.common.months.aug") },
        { name: t("dashboard.common.months.september"), value: t("dashboard.common.months.sep") },
        { name: t("dashboard.common.months.october"), value: t("dashboard.common.months.oct") },
        { name: t("dashboard.common.months.november"), value: t("dashboard.common.months.nov") },
        { name: t("dashboard.common.months.december"), value: t("dashboard.common.months.dec") }
    ];
};

export const useMonthOptions = () => {
    const { t } = useTranslation();

    return [
        { value: "01", label: t("dashboard.common.months.january") },
        { value: "02", label: t("dashboard.common.months.february") },
        { value: "03", label: t("dashboard.common.months.march") },
        { value: "04", label: t("dashboard.common.months.april") },
        { value: "05", label: t("dashboard.common.months.may") },
        { value: "06", label: t("dashboard.common.months.june") },
        { value: "07", label: t("dashboard.common.months.july") },
        { value: "08", label: t("dashboard.common.months.august") },
        { value: "09", label: t("dashboard.common.months.september") },
        { value: "10", label: t("dashboard.common.months.october") },
        { value: "11", label: t("dashboard.common.months.november") },
        { value: "12", label: t("dashboard.common.months.december") }
    ];
};