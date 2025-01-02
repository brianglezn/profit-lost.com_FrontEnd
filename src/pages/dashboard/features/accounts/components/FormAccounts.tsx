import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { ColorPicker, ColorPickerChangeEvent, ColorPickerRGBType } from 'primereact/colorpicker';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';

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

type DropdownOption = {
    label: string;
    value: number | 'add_year';
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
    const [showCustomYearInput, setShowCustomYearInput] = useState(false);
    const [customYear, setCustomYear] = useState('');

    const currentYear = new Date().getFullYear();

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
    
    // Initial effect to load the years
    useEffect(() => {
        if (mode === 'edit' && account) {
            const years = new Set(account.records.map(record => record.year));
            // Make sure that the current year is included.
            years.add(currentYear);
            const sortedYears = Array.from(years).sort((a, b) => a - b);
            setUniqueYears(sortedYears);
            
            // Initialize tempValues with existing records
            const initialTempValues: { [key: string]: string } = {};
            account.records.forEach(record => {
                const key = `${record.year}-${record.month}`;
                initialTempValues[key] = record.value?.toString() || '0';
            });
            
            // Add values for the current year if they do not exist
            if (!account.records.some(record => record.year === currentYear)) {
                monthNames.forEach(month => {
                    const key = `${currentYear}-${month.value}`;
                    initialTempValues[key] = '0';
                });
            }
            
            setTempValues(initialTempValues);
        }
    }, [mode, account, currentYear, monthNames]);

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

    const dropdownOptions = useMemo(() => {
        const options: DropdownOption[] = uniqueYears
            .slice()
            .sort((a, b) => b - a)
            .map(year => ({
                label: year.toString(),
                value: year
            }));

        options.push({
            label: t('dashboard.accounts.form_accounts_edit.add_year'),
            value: 'add_year' as const
        });

        return options;
    }, [uniqueYears, t]);

    const handleYearChange = (e: { value: number | 'add_year' }) => {
        if (e.value === 'add_year') {
            setShowCustomYearInput(true);
        } else {
            setShowCustomYearInput(false);
            setYear(e.value);
        }
    };

    const handleAddCustomYear = () => {
        const yearNumber = parseInt(customYear);

        if (yearNumber >= 1900 && yearNumber <= 2100) {
            if (!uniqueYears.includes(yearNumber)) {
                const newRecords = monthNames.map(month => ({
                    year: yearNumber,
                    month: month.value,
                    value: 0
                }));

                if (mode === 'edit' && account) {
                    account.records = [...account.records, ...newRecords];

                    const updatedYears = [...uniqueYears, yearNumber].sort((a, b) => a - b);
                    setUniqueYears(updatedYears);

                    const newTempValues = { ...tempValues };
                    monthNames.forEach(month => {
                        const key = `${yearNumber}-${month.value}`;
                        newTempValues[key] = '0';
                    });
                    setTempValues(newTempValues);

                    setYear(yearNumber);
                    setShowCustomYearInput(false);
                    setCustomYear('');

                    toast.success(t('dashboard.accounts.form_accounts_edit.year_added_success'));
                }
            } else {
                toast.error(t('dashboard.accounts.form_accounts_edit.year_already_exists'));
            }
        } else {
            toast.error(t('dashboard.accounts.form_accounts_edit.invalid_year'));
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setTempValues(prev => {
            const newValues = {
                ...prev,
                [key]: value
            };
            return newValues;
        });

        if (mode === 'edit' && account) {
            const [yearStr, month] = key.split('-');
            const year = parseInt(yearStr);
            const normalizedValue = parseFloat(value.replace(',', '.')) || 0;

            const recordIndex = account.records.findIndex(
                record => record.year === year && record.month === month
            );

            if (recordIndex >= 0) {
                account.records[recordIndex].value = normalizedValue;
            } else {
                account.records.push({
                    year,
                    month,
                    value: normalizedValue
                });
            }
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
                            value={showCustomYearInput ? 'add_year' : year}
                            options={dropdownOptions}
                            onChange={handleYearChange}
                        />

                        {showCustomYearInput && (
                            <div className="custom-year-input">
                                <InputText
                                    value={customYear}
                                    onChange={(e) => setCustomYear(e.target.value)}
                                    placeholder={t('dashboard.accounts.form_accounts_edit.year_placeholder')}
                                    type="number"
                                    min="1900"
                                    max="2100"
                                />
                                <Button
                                    label={t('dashboard.accounts.form_accounts_edit.add_year')}
                                    className="p-button-primary"
                                    onClick={handleAddCustomYear}
                                />
                            </div>
                        )}

                        {!showCustomYearInput && (
                            <div className='dataYear'>
                                {monthNames.map((month) => {
                                    const key = `${year}-${month.value}`;
                                    const value = tempValues[key] || '0';
                                    
                                    return (
                                        <div className='dataYear-row' key={month.value}>
                                            <span>{month.name}</span>
                                            <input
                                                type='text'
                                                value={value}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
