import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { ColorPicker } from "primereact/colorpicker";
import { Accordion, AccordionTab } from "primereact/accordion";

import { editCategory } from "../../../api/categories/editCategory";
import { removeCategory } from "../../../api/categories/removeCategory";
import { getAllMovements } from "../../../api/movements/getAllMovements";
import { formatCurrency, formatDateTime } from "../../../helpers/functions";

import './FormCategory.scss';

interface FormCategoryEditProps {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    onUpdate: () => void;
    onClose: () => void;
    onRemove: () => void;
}

interface Movement {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
}

const FormCategoryEdit: React.FC<FormCategoryEditProps> = ({ categoryId, categoryName, categoryColor, onUpdate, onClose, onRemove }) => {
    const [name, setName] = useState(categoryName);
    const [color, setColor] = useState(categoryColor);
    const [showConfirm, setShowConfirm] = useState(false);
    const [movementsByYear, setMovementsByYear] = useState<{ [key: string]: Movement[] }>({});

    useEffect(() => {
        const fetchMovements = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Authentication token not found');
                return;
            }

            try {
                const movements: Movement[] = await getAllMovements(token);

                const filteredMovements = movements.filter((movement) => movement.category === categoryName);

                const groupedMovements = filteredMovements.reduce<{ [key: string]: Movement[] }>((acc, movement) => {
                    const year = new Date(movement.date).getFullYear().toString();
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(movement);
                    return acc;
                }, {});

                setMovementsByYear(groupedMovements);
            } catch (error) {
                console.error('Error fetching movements:', error);
                toast.error('Failed to fetch movements.');
            }
        };

        fetchMovements();
    }, [categoryId, categoryName]);

    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication token not found. Please log in.', { duration: 3000 });
            return;
        }

        try {
            await editCategory(token, categoryId, name, color);
            toast.success('Category edited successfully', { duration: 3000 });
            setTimeout(() => {
                onClose();
                onUpdate();
            }, 500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
        }
    };

    const handleRemoveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmRemove = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication token not found. Please log in.', { duration: 3000 });
            return;
        }

        try {
            await removeCategory(token, categoryId);
            toast.success(`The category "${name}" has been successfully removed.`);
            setTimeout(() => {
                onClose();
                onRemove();
            }, 500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
        }
    };

    return (
        <form className="formCategories" onSubmit={handleEditCategory}>
            <h2>Edit category</h2>
            <div className="formCategoriesContainer">
                <div className="formCategoriesContainer-colorPicker">
                    <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                </div>
                <input
                    className="custom-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="formCategories-buttons">
                <button type="button" className="custom-btn-sec" onClick={handleRemoveCategory}>Remove</button>
                <button type="submit" className="custom-btn">Save</button>
            </div>

            {showConfirm && (
                <div className="form-confirmBtn">
                    <p>Are you sure you want to delete <b>"{name}"</b>?</p>
                    <button type="button" className="custom-btn" onClick={handleConfirmRemove}>Confirm</button>
                </div>
            )}

            <div className="movementsByCategory">
                <Accordion multiple className="movementsByCategory-container">
                    {Object.keys(movementsByYear)
                        .sort((a, b) => Number(b) - Number(a))
                        .map((year) => (
                            <AccordionTab key={year} header={year}>
                                <ul className="movementsByCategory-list">
                                    {movementsByYear[year].map((movement) => (
                                        <li key={movement.id} className="movementsByCategory-item">
                                            <span className="movementsByCategory-description">{movement.description}</span>
                                            <span className="movementsByCategory-date">{formatDateTime(movement.date)}</span>
                                            <span className={`movementsByCategory-amount ${movement.amount < 0 ? 'negative' : 'positive'}`}>
                                                {formatCurrency(movement.amount)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionTab>
                        ))}
                </Accordion>
            </div>

        </form>
    );
};

export default FormCategoryEdit;
