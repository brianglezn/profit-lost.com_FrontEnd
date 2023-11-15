import { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';

import "./FormMovements.css";

import dataCategoriesJson from "../../data/dataCategories.json";

function FormMovements() {
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
        setBalance(event.target.value);
    };

    return (
        <>
            <form className="formMovements">

                <div className="formMovements-buttons">
                    <Button
                        variant={transactionType === 'Income' ? 'contained' : 'outlined'}
                        onClick={() => handleTransactionTypeChange('Income')}
                        sx={{
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
            </form>
        </>
    );
}

export default FormMovements;
