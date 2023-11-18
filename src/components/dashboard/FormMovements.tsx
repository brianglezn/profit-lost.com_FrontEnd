import { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';

import "./FormMovements.css";

import dataCategoriesJson from "../../data/dataCategories.json";

interface FormMovementsProps {
    onClose: () => void;
}

function FormMovements({ onClose }: FormMovementsProps) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [transactionType, setTransactionType] = useState('Income');
    const [balance, setBalance] = useState('');

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value as string);
    };

    const handleTransactionTypeChange = (type: string) => {
        setTransactionType(type);
    };

    const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        value = value.replace(/,/g, '.');
        const regex = /^\d*\.?\d{0,2}$/;
        if (value === '' || regex.test(value)) {
            setBalance(value);
        }
    };

    return (
        <>
            <form className="formMovements">
                <span className="material-symbols-rounded formMovements-closeButton" onClick={onClose}>
                    close
                </span>

                <div className="formMovements-buttons">

                    <Button
                        variant={transactionType === 'Income' ? 'contained' : 'outlined'}
                        onClick={() => handleTransactionTypeChange('Income')}
                        sx={{
                            color: transactionType === 'Income' ? 'white' : 'var(--color-orange-500)',
                            ...(transactionType !== 'Income' && {
                                '&:hover': {
                                    color: 'var(--color-orange-500)',
                                },
                            }),
                        }}
                    >
                        Income
                    </Button>
                    <Button
                        variant={transactionType === 'Expense' ? 'contained' : 'outlined'}
                        onClick={() => handleTransactionTypeChange('Expense')}
                        sx={{
                            color: transactionType === 'Expense' ? 'white' : 'var(--color-orange-500)',
                            ...(transactionType !== 'Expense' && {
                                '&:hover': {
                                    color: 'var(--color-orange-500)',
                                },
                            }),
                        }}
                    >
                        Expense
                    </Button>

                </div>

                <FormControl className="formMovements-category" >

                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={selectedCategory}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        {dataCategoriesJson.map((category) => (
                            <MenuItem key={category.name} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    className="formMovements-balance"
                    label="Balance"
                    value={balance}
                    onChange={handleBalanceChange}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    className="formMovements-send"
                    sx={{
                        borderColor: 'var(--color-orange-400)',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        '&:hover': {
                            color: 'var(--color-white)',
                            backgroundColor: 'var(--color-orange)',
                        },
                    }}
                >
                    Save
                </Button>
            </form >
        </>
    );
}

export default FormMovements;
