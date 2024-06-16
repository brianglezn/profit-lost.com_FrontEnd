import React, { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { ColorPicker, ColorPickerChangeEvent, ColorPickerRGBType } from 'primereact/colorpicker';
import { toast } from 'react-hot-toast';

import { editAccount } from '../../../api/accounts/editAccount';
import { removeAccount } from '../../../api/accounts/removeAccount';

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

const monthNames = [
    { name: "January", value: "Jan" },
    { name: "February", value: "Feb" },
    { name: "March", value: "Mar" },
    { name: "April", value: "Apr" },
    { name: "May", value: "May" },
    { name: "June", value: "Jun" },
    { name: "July", value: "Jul" },
    { name: "August", value: "Aug" },
    { name: "September", value: "Sep" },
    { name: "October", value: "Oct" },
    { name: "November", value: "Nov" },
    { name: "December", value: "Dec" }
];

function rgbToHex({ r, g, b }: ColorPickerRGBType): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function FormAccountsEdit({ account, onUpdate, onClose, onRemove }: FormAccountsEditProps) {
    const [accountName, setAccountName] = useState<string>(account.accountName);
    const [backgroundColor, setBackgroundColor] = useState<string>(account.configuration.backgroundColor);
    const [fontColor, setFontColor] = useState<string>(account.configuration.color);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const years = Array.from(new Set(account.records.map(record => record.year))).sort((a, b) => a - b);
        setUniqueYears(years);
        if (!years.includes(year)) {
            setYear(years.includes(new Date().getFullYear()) ? new Date().getFullYear() : years[0]);
        }

        const initialTempValues: { [key: string]: string } = {};
        account.records.forEach(record => {
            initialTempValues[`${record.year}-${record.month}`] = record.value.toString();
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
            toast.success('Account updated successfully', { duration: 3000 });
            onClose();
            onUpdate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
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
            toast.success(`The account "${account.accountName}" has been successfully removed.`, { duration: 3000 });
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
            <h2>Edit account</h2>
            <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Account Name"
                className="custom-input"
                required
            />
            <Dropdown
                className="formAccount-dropdown"
                value={year}
                options={uniqueYears.slice().reverse().map(year => ({ label: year.toString(), value: year }))}
                onChange={handleYearChange}
                placeholder="Select Year"
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
                <p>Background</p>
                <ColorPicker value={backgroundColor} onChange={handleBackgroundColorChange} />
                <p>Font</p>
                <ColorPicker value={fontColor} onChange={handleFontColorChange} />
            </div>
            <div className="formAccount-buttons">
                <button type="submit" className="custom-btn">Save</button>
                <button type="button" className="custom-btn" onClick={handleRemoveAccount}>Remove</button>
            </div>
            {showConfirm && (
                <div className="form-confirmBtn">
                    <p>Are you sure you want to delete <b>"{account.accountName}"</b>?</p>
                    <button type="button" className="custom-btn" onClick={handleConfirmRemove}>Confirm</button>
                </div>
            )}
        </form>
    );
}

export default FormAccountsEdit;
