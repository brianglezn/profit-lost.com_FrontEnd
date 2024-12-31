import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { ColorPicker, ColorPickerChangeEvent, ColorPickerRGBType } from 'primereact/colorpicker';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

import { addAccount } from '../../../../../api/accounts/addAccount';
import { editAccount } from '../../../../../api/accounts/editAccount';
import { removeAccount } from '../../../../../api/accounts/removeAccount';
import { rgbToHex } from '../../../../../helpers/functions';
import { Account, AccountRecord } from '../../../../../helpers/types';

import './FormAccounts.scss';

type FormAccountsProps = {
    mode: 'add' | 'edit';
    account?: Account;
    onSuccess: () => void;
    onClose: () => void;
    onRemove?: () => void;
};

export default function FormAccounts({ mode, account, onSuccess, onClose, onRemove }: FormAccountsProps) {
    const { t, i18n } = useTranslation();
    const [accountName, setAccountName] = useState<string>(account?.accountName || '');
    const [backgroundColor, setBackgroundColor] = useState<string>(account?.configuration.backgroundColor || '#7e2a10');
    const [fontColor, setFontColor] = useState<string>(account?.configuration.color || '#ffffff');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});
    const [isActive, setIsActive] = useState<boolean>(account?.configuration.isActive !== false);

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
                { name: 'Diciembre', value: 'Dec' },
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
                { name: 'December', value: 'Dec' },
            ];
    }, [i18n.language]);

    useEffect(() => {
        if (mode === 'edit' && account) {
            const years = Array.from(new Set(account.records.map((record) => record.year))).sort((a, b) => a - b);
            setUniqueYears(years);
            if (!years.includes(year)) {
                setYear(years.includes(new Date().getFullYear()) ? new Date().getFullYear() : years[0]);
            }

            const initialTempValues: { [key: string]: string } = {};
            account.records.forEach((record) => {
                initialTempValues[`${record.year}-${record.month}`] = record.value?.toString() || '0';
            });
            setTempValues(initialTempValues);
        }
    }, [mode, account, year]);

    const handleBackgroundColorChange = (e: ColorPickerChangeEvent) => {
        if (!e.value) return;

        let colorValue = '';
        if (typeof e.value === 'string') {
            colorValue = e.value.startsWith('#') ? e.value : `#${e.value}`;
        } else if ('r' in e.value) {
            colorValue = rgbToHex(e.value as ColorPickerRGBType);
        }
        setBackgroundColor(colorValue);
    };

    const handleFontColorChange = (e: ColorPickerChangeEvent) => {
        if (!e.value) return;

        let colorValue = '';
        if (typeof e.value === 'string') {
            colorValue = e.value.startsWith('#') ? e.value : `#${e.value}`;
        } else if ('r' in e.value) {
            colorValue = rgbToHex(e.value as ColorPickerRGBType);
        }
        setFontColor(colorValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (accountName.trim() === '') {
            toast.error(t('dashboard.accounts.form_accounts_add.error_message'));
            return;
        }

        if (mode === 'add') {
            try {
                await addAccount(accountName.trim());
                toast.success(t('dashboard.accounts.form_accounts_add.success_message'));
                onSuccess();
                onClose();
            } catch (error) {
                toast.error(t('dashboard.accounts.form_accounts_add.error_adding'));
            }
        } else if (mode === 'edit' && account) {
            const updatedRecords: AccountRecord[] = account.records.map((record) => {
                const key = `${record.year}-${record.month}`;
                const normalizedValue = parseFloat(tempValues[key]?.replace(',', '.') || '0');
                return { ...record, value: isNaN(normalizedValue) ? 0 : normalizedValue };
            });

            try {
                await editAccount({
                    _id: account._id,
                    accountName,
                    records: updatedRecords,
                    configuration: {
                        backgroundColor,
                        color: fontColor,
                        isActive,
                    },
                });
                toast.success(t('dashboard.accounts.form_accounts_edit.success_message'));
                onSuccess();
                onClose();
            } catch (error) {
                toast.error(t('dashboard.accounts.form_accounts_edit.error_message'));
                console.error('Error during account update:', error);
            }
        }
    };

    const handleRemoveAccount = () => {
        if (mode === 'edit' && account && onRemove) {
            confirmDialog({
                message: t('dashboard.accounts.form_accounts_edit.remove_confirm', { account: account.accountName }),
                header: t('dashboard.accounts.account_item.remove'),
                accept: async () => {
                    try {
                        await removeAccount(account._id);
                        toast.success(t('dashboard.accounts.form_accounts_edit.remove_success'));
                        onSuccess();
                        onClose();
                    } catch (error) {
                        toast.error('An unexpected error occurred.');
                    }
                },
                reject: () => { },
                position: 'bottom',
            });
        }
    };

    return (
        <>
            <ConfirmDialog />
            <form className='formAccount' onSubmit={handleSubmit}>
                <h2>{t(`dashboard.accounts.form_accounts_${mode}.title`)}</h2>
                <InputText
                    id='accountName'
                    className='custom-input'
                    placeholder={t(`dashboard.accounts.form_accounts_${mode}.placeholder`)}
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                />
                {mode === 'edit' && (
                    <>
                        <Dropdown
                            className='formDropdown'
                            value={year}
                            options={uniqueYears.slice().reverse().map((year) => ({ label: year.toString(), value: year }))}
                            onChange={(e) => setYear(e.value)}
                        />
                        <div className='dataYear'>
                            {monthNames.map((month) => {
                                const key = `${year}-${month.value}`;
                                return (
                                    <div className='dataYear-row' key={month.value}>
                                        <span>{month.name}</span>
                                        <input
                                            type='text'
                                            value={tempValues[key] || ''}
                                            onChange={(e) =>
                                                setTempValues((prevTempValues) => ({
                                                    ...prevTempValues,
                                                    [key]: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
                <div className='colorPiker'>
                    <p>{t('dashboard.accounts.form_accounts_edit.background')}</p>
                    <ColorPicker value={backgroundColor} onChange={handleBackgroundColorChange} />
                    <p>{t('dashboard.accounts.form_accounts_edit.font')}</p>
                    <ColorPicker value={fontColor} onChange={handleFontColorChange} />
                </div>
                {mode === 'edit' && (
                    <div className='form-field'>
                        <label className='switch'>
                            <span>{t('dashboard.accounts.form.active_account')}</span>
                            <input
                                type='checkbox'
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            <span className='slider'></span>
                        </label>
                    </div>
                )}
                <div className='formAccount-buttons'>
                    {mode === 'edit' && (
                        <button
                            type='button'
                            className='custom-btn-sec'
                            onClick={handleRemoveAccount}
                        >
                            {t('dashboard.accounts.account_item.remove')}
                        </button>
                    )}
                    <button type='submit' className='custom-btn'>
                        {t(`dashboard.accounts.account_item.${mode}`)}
                    </button>
                </div>
            </form>
        </>
    );
}
