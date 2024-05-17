import { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';

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

function FormAccountsEdit({ account }: FormAccountsEditProps) {
    const [backgroundColor, setBackgroundColor] = useState<string | { r: number; g: number; b: number; a?: number }>("#ffffff");
    const [fontColor, setFontColor] = useState<string | { r: number; g: number; b: number; a?: number }>("#000000");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [records, setRecords] = useState<AccountRecord[]>(account.records);

    useEffect(() => {
        const years = Array.from(new Set(records.map(record => record.year))).sort((a, b) => a - b);
        setUniqueYears(years);
        setYear(years.includes(new Date().getFullYear()) ? new Date().getFullYear() : years[0]);
    }, [records]);

    const handleBackgroundColorChange = (e: ColorPickerChangeEvent) => {
        setBackgroundColor(e.value as string | { r: number; g: number; b: number; a?: number });
    };

    const handleFontColorChange = (e: ColorPickerChangeEvent) => {
        setFontColor(e.value as string | { r: number; g: number; b: number; a?: number });
    };

    const handleYearChange = (e: DropdownChangeEvent) => {
        setYear(e.value);
    };

    const handleValueChange = (month: string, value: number) => {
        setRecords(prevRecords =>
            prevRecords.map(record => {
                if (record.year === year && record.month === month) {
                    return { ...record, value };
                }
                return record;
            })
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement your update logic here
    };

    return (
        <form className="formAccount" onSubmit={handleSubmit}>
            <h2>Edit account</h2>
            <Dropdown
                className="formAccount-category"
                value={year}
                options={uniqueYears.map(year => ({ label: year.toString(), value: year }))}
                onChange={handleYearChange}
                placeholder="Select Year"
            />
            <div className="dataYear">
                {monthNames.map(month => {
                    const record = records.find(record => record.year === year && record.month === month.value) || { value: 0 } as AccountRecord;
                    return (
                        <div className="dataYear-row" key={month.value}>
                            <span>{month.name}</span>
                            <input
                                type="number"
                                value={record.value}
                                onChange={(e) => handleValueChange(month.value, parseFloat(e.target.value))}
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
            <button type="submit" className="custom-btn">Update</button>
        </form>
    );
}

export default FormAccountsEdit;
