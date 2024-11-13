import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ColorPicker, ColorPickerChangeEvent, ColorPickerRGBType } from 'primereact/colorpicker';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import { editAccount } from '../../../../../api/accounts/editAccount';
import { removeAccount } from '../../../../../api/accounts/removeAccount';
import { rgbToHex } from '../../../../../helpers/functions';
import { Account, AccountRecord } from '../../../../../helpers/types';

import './FormAccounts.scss';

interface FormAccountsEditProps {
    account: Account;
    onUpdate: () => void;
    onClose: () => void;
    onRemove: () => void;
}

export default function FormAccountsEdit({ account, onUpdate, onClose, onRemove }: FormAccountsEditProps) {
    const [accountName, setAccountName] = useState<string>(account.accountName);
    const [backgroundColor, setBackgroundColor] = useState<string>(account.configuration.backgroundColor);
    const [fontColor, setFontColor] = useState<string>(account.configuration.color);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});
    const [showConfirm, setShowConfirm] = useState(false);

    const { t, i18n } = useTranslation();

    const monthNames = useMemo(() => {
        return i18n.language === 'es'
            ? [
                { name: 'Enero', value: 'Jan' },
                { name: 'Febrero', value: 'Feb' },
                { name: 'Marzo', value: 'Mar' },
                { name: 'Abril', value: 'Apr' },
                { name: 'Mayo', value: 'May' },
                { name: 'Junio', value: 'Jun' },
                { name: 'Julio', value: 'Jul' },
                { name: 'Agosto', value: 'Aug' },
                { name: 'Septiembre', value: 'Sep' },
                { name: 'Octubre', value: 'Oct' },
                { name: 'Noviembre', value: 'Nov' },
                { name: 'Diciembre', value: 'Dec' }
            ]
            : [
                { name: 'January', value: 'Jan' },
                { name: 'February', value: 'Feb' },
                { name: 'March', value: 'Mar' },
                { name: 'April', value: 'Apr' },
                { name: 'May', value: 'May' },
                { name: 'June', value: 'Jun' },
                { name: 'July', value: 'Jul' },
                { name: 'August', value: 'Aug' },
                { name: 'September', value: 'Sep' },
                { name: 'October', value: 'Oct' },
                { name: 'November', value: 'Nov' },
                { name: 'December', value: 'Dec' }
            ];
    }, [i18n.language]);


    useEffect(() => {
        const years = Array.from(new Set(account.records.map(record => record.year))).sort((a, b) => a - b);
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

    const handleBackgroundColorChange = (e: ColorPickerChangeEvent) => {
        if (!e.value) return;

        let colorValue = '';
        if (typeof e.value === 'string') {
            colorValue = e.value;
        } else if ('r' in e.value) {
            colorValue = rgbToHex(e.value as ColorPickerRGBType);
        }
        setBackgroundColor(colorValue);
    };

    const handleFontColorChange = (e: ColorPickerChangeEvent) => {
        if (!e.value) return;

        let colorValue = '';
        if (typeof e.value === 'string') {
            colorValue = e.value;
        } else if ('r' in e.value) {
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
        const updatedRecords: AccountRecord[] = account.records.map(record => {
            const key = `${record.year}-${record.month}`;
            const normalizedValue = parseFloat(tempValues[key]?.replace(',', '.') || '0');
            return { ...record, value: isNaN(normalizedValue) ? 0 : normalizedValue };
        });

        try {
            await editAccount({
                _id: account._id,
                accountName,
                records: updatedRecords,
                configuration: { backgroundColor, color: fontColor },
            });
            toast.success(t('dashboard.accounts.form_accounts_edit.success_message'));
            onClose();
            onUpdate();
        } catch (error) {
            toast.error(t('dashboard.accounts.form_accounts_edit.error_message'));
            console.error('Error during account update:', error);
        }
    };

    const handleRemoveAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmRemove = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await removeAccount(account._id);
            toast.success(t('dashboard.accounts.form_accounts_edit.remove_success'));
            onClose();
            onRemove();
        } catch (error) {
            toast.error('An unexpected error occurred.');
        }
    };

    return (
        <form className='formAccount' onSubmit={handleEditAccount}>
            <h2>{t('dashboard.accounts.form_accounts_edit.title')}</h2>
            <InputText
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className='custom-input'
                required
            />
            <Dropdown
                className='formDropdown'
                value={year}
                options={uniqueYears.slice().reverse().map(year => ({ label: year.toString(), value: year }))}
                onChange={handleYearChange}
            />
            <div className='dataYear'>
                {monthNames.map(month => {
                    const key = `${year}-${month.value}`;
                    return (
                        <div className='dataYear-row' key={month.value}>
                            <span>{month.name}</span>
                            <input
                                type='text'
                                value={tempValues[key] || ''}
                                onChange={(e) => handleValueChange(month.value, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className='colorPiker'>
                <p>{t('dashboard.accounts.form_accounts_edit.background')}</p>
                <ColorPicker value={backgroundColor} onChange={handleBackgroundColorChange} />
                <p>{t('dashboard.accounts.form_accounts_edit.font')}</p>
                <ColorPicker value={fontColor} onChange={handleFontColorChange} />
            </div>
            <div className='formAccount-buttons'>
                <button type='button' className='custom-btn-sec' onClick={handleRemoveAccount}>
                    {t('dashboard.accounts.account_item.remove')}
                </button>
                <button type='submit' className='custom-btn'>
                    {t('dashboard.accounts.account_item.submit')}
                </button>
            </div>
            {showConfirm && (
                <div className='form-confirmBtn'>
                    <p>
                        {t('dashboard.accounts.form_accounts_edit.remove_confirm')} <b>'{account.accountName}'</b>?
                    </p>
                    <button type='button' className='custom-btn' onClick={handleConfirmRemove}>
                        Confirmar
                    </button>
                </div>
            )}
        </form>
    );
}
