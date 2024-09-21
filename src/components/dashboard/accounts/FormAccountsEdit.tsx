import React, { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { ColorPicker, ColorPickerChangeEvent, ColorPickerRGBType } from 'primereact/colorpicker';
import { toast } from 'react-hot-toast';
import { InputText } from "primereact/inputtext";
import { useTranslation } from 'react-i18next';

import { editAccount } from '../../../api/accounts/editAccount';
import { removeAccount } from '../../../api/accounts/removeAccount';

import { rgbToHex } from "../../../helpers/functions";
import { monthNames } from "../../../helpers/constants";

import "./FormAccounts.scss";

interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

interface AccountConfiguration {
    backgroundColor: string;
    color: string;
}

interface DataAccount {
    accountName: string;
    records: AccountRecord[];
    configuration: AccountConfiguration;
    AccountId: string;
}

interface FormAccountsEditProps {
    account: DataAccount;
    onUpdate: () => void;
    onClose: () => void;
    onRemove: () => void;
}

function FormAccountsEdit({ account, onUpdate, onClose, onRemove }: FormAccountsEditProps) {
    const { t } = useTranslation();
    const [accountName, setAccountName] = useState<string>(account.accountName);
    const [backgroundColor, setBackgroundColor] = useState<string>(account.configuration.backgroundColor);
    const [fontColor, setFontColor] = useState<string>(account.configuration.color);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const years = Array.from(new Set(account.records.map(record => record.year).filter(year => year !== null && year !== undefined))).sort((a, b) => a - b);
        setUniqueYears(years);
        if (!years.includes(year)) {
            setYear(years.includes(new Date().getFullYear()) ? new Date().getFullYear() : years[0]);
        }

        const initialTempValues: { [key: string]: string } = {};
        account.records.forEach(record => {
            initialTempValues[`${record.year}-${record.month}`] = record.value?.toString() || '0';
        });
        setTempValues(initialTempValues);
    }, [account.records, year]);

    const ensureHexColor = (color: string) => {
        return color.startsWith('#') ? color : `#${color}`;
    };

    const handleBackgroundColorChange = (e: ColorPickerChangeEvent) => {
        let colorValue = "";
        if (e.value !== undefined && typeof e.value === 'string') {
            colorValue = ensureHexColor(e.value);
        } else if (e.value !== undefined && e.value !== null && 'r' in e.value) {
            colorValue = rgbToHex(e.value as ColorPickerRGBType);
        }
        setBackgroundColor(colorValue);
    };

    const handleFontColorChange = (e: ColorPickerChangeEvent) => {
        let colorValue = "";
        if (e.value !== undefined && typeof e.value === 'string') {
            colorValue = ensureHexColor(e.value);
        } else if (e.value !== undefined && e.value !== null && 'r' in e.value) {
            colorValue = rgbToHex(e.value as ColorPickerRGBType);
        }
        setFontColor(colorValue);
    };

    const handleYearChange = (e: DropdownChangeEvent) => {
        setYear(e.value);
    };

    const handleValueChange = (month: string, value: string) => {
        const key = `${year}-${month}`;
        setTempValues(prevTempValues => ({
            ...prevTempValues,
            [key]: value
        }));
    };

    const handleEditAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedRecords = account.records.map(record => {
            const key = `${record.year}-${record.month}`;
            const normalizedValue = tempValues[key]?.replace(',', '.') || '0';
            const parsedValue = parseFloat(normalizedValue);
            return {
                ...record,
                value: isNaN(parsedValue) ? 0 : parsedValue
            };
        });

        try {
            await editAccount({
                accountId: account.AccountId,
                accountName,
                records: updatedRecords,
                configuration: { backgroundColor, color: fontColor },
            });
            toast.success(t('dashboard.accounts.form_accounts_edit.success_message'), { duration: 3000 });
            onClose();
            onUpdate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('dashboard.accounts.form_accounts_edit.error_message');
            console.error('Error during account update:', errorMessage);
            toast.error(errorMessage, { duration: 5000 });
        }
    };

    const handleRemoveAccount = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmRemove = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await removeAccount(account.AccountId);
            toast.success(t('dashboard.accounts.form_accounts_edit.remove_success', { accountName: account.accountName }), { duration: 3000 });
            onClose();
            onRemove();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            console.error('Error during account deletion:', errorMessage);
            toast.error(errorMessage, { duration: 5000 });
        }
    };

    return (
        <form className="formAccount" onSubmit={handleEditAccount}>
            <h2>{t('dashboard.accounts.form_accounts_edit.title')}</h2>
            <InputText
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="custom-input"
                required
            />
            <Dropdown
                className="formDropdown"
                value={year}
                options={uniqueYears.slice().reverse().map(year => ({ label: year.toString(), value: year }))}
                onChange={handleYearChange}
            />
            <div className="dataYear">
                {monthNames.map(month => {
                    const key = `${year}-${month.value}`;
                    return (
                        <div className="dataYear-row" key={month.value}>
                            <span>{month.name}</span>
                            <input
                                type="text"
                                value={tempValues[key] || ""}
                                onChange={(e) => handleValueChange(month.value, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="colorPiker">
                <p>{t('dashboard.accounts.form_accounts_edit.background')}</p>
                <ColorPicker value={backgroundColor} onChange={handleBackgroundColorChange} />
                <p>{t('dashboard.accounts.form_accounts_edit.font')}</p>
                <ColorPicker value={fontColor} onChange={handleFontColorChange} />
            </div>
            <div className="formAccount-buttons">
                <button type="button" className="custom-btn-sec" onClick={handleRemoveAccount}>{t('dashboard.accounts.account_item.remove')}</button>
                <button type="submit" className="custom-btn">{t('dashboard.accounts.account_item.submit')}</button>
            </div>
            {showConfirm && (
                <div className="form-confirmBtn">
                    <p>{t('dashboard.accounts.form_accounts_edit.remove_confirm')} <b>"{account.accountName}"</b>?</p>
                    <button type="button" className="custom-btn" onClick={handleConfirmRemove}>Confirmar</button>
                </div>
            )}
        </form>
    );
}

export default FormAccountsEdit;
