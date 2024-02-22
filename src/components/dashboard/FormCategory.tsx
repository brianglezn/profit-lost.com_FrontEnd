import { useState } from "react";
import { Button, TextField } from "@mui/material";

import "./FormCategory.css";
// import dataCategoriesJson from "../../data/dataCategories.json";

interface FormCategoryProps {
    onClose: () => void;
}

function FormCategory({ onClose }: FormCategoryProps) {
    const [newCategory, setNewCategory] = useState('');

    const handleNewCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(event.target.value);
    };

    const handleSaveCategory = () => {
        console.log(newCategory);
    };
    return (
        <>
            <form className="formCategory">
                <span className="material-symbols-rounded no-select formCategory-closeButton" onClick={onClose}>
                    close
                </span>

                <TextField
                    label="New Category"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                />

                <Button
                    className="formCategory-send"
                    onClick={handleSaveCategory}
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
            </form>
        </>
    );
}

export default FormCategory;
