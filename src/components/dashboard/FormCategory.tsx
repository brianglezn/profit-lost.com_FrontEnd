import { useState } from "react";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import "./FormCategory.css";

function FormCategory() {
    const [newCategory, setNewCategory] = useState('');

    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    const handleSaveCategory = () => {
        console.log(newCategory);
        // Aquí iría la lógica para guardar la nueva categoría
    };

    return (
        <>
            <form className="annualReport__containerCategory-formCategory">
                <InputText
                    placeholder="New Category"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    className="w-full"
                />
                <Button
                    label="Save"
                    onClick={handleSaveCategory}
                    className="p-button-outlined p-button-warning"
                    style={{
                        borderColor: 'var(--color-orange-400)',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        width: '6rem',
                        margin:'1rem 0 0 0',
                    }}
                />
            </form>
        </>
    );
}

export default FormCategory;
