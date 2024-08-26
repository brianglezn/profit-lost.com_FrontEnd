import { useEffect, useState, useCallback } from "react";
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';

import { formatCurrency } from "../../../helpers/functions";
import { getAllCategories } from "../../../api/categories/getAllCategories";
import { getMovementsByYear } from "../../../api/movements/getMovementsByYear";

import "./AnnualMovements.scss";
import FormCategoryEdit from "./FormCategoryEdit";

type Transaction = {
    category: string;
    amount: number;
};

type Category = {
    _id: string;
    name: string;
    color: string;
};

type CategoryBalance = {
    id: string;
    Category: string;
    color: string;
    Balance: number;
};

interface AnnualMovementsProps {
    year: string;
    reloadFlag: boolean;
}

const AnnualMovements: React.FC<AnnualMovementsProps> = ({ year, reloadFlag }) => {
    const [categories, setCategories] = useState<CategoryBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryBalance | null>(null);

    const fetchDataAndCalculateBalances = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const categoriesData: Category[] = await getAllCategories(token);
            const movementsData: Transaction[] = await getMovementsByYear(token, year);

            const categoryBalances = categoriesData.map(category => {
                const balance = movementsData.reduce((acc, movement) => {
                    if (movement.category === category.name) {
                        return acc + movement.amount;
                    }
                    return acc;
                }, 0);

                return {
                    id: category._id,
                    Category: category.name,
                    Balance: balance,
                    color: category.color
                };
            });

            // Ordenar las categorías por nombre
            categoryBalances.sort((a, b) => a.Category.localeCompare(b.Category));

            setCategories(categoryBalances);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [year]);

    useEffect(() => {
        fetchDataAndCalculateBalances();
    }, [fetchDataAndCalculateBalances, reloadFlag]);

    const editCategory = (category: CategoryBalance) => {
        setCategoryToEdit(category);
        setSidebarVisible(true);
    };

    return (
        <div className="annual__categories-table">
            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
            ) : (
                <div className="categories-list">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="category-item"
                            onClick={() => editCategory(category)}
                        >
                            <div className="category-color">
                                <div
                                    className="category-color-circle"
                                    style={{ backgroundColor: category.color }}
                                ></div>
                            </div>
                            <div className="category-name">{category.Category}</div>
                            <div className={`category-balance ${category.Balance >= 0 ? "positive" : "negative"}`}>
                                {formatCurrency(category.Balance)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Sidebar
                visible={sidebarVisible}
                onHide={() => setSidebarVisible(false)}
                position="right"
                style={{ width: '450px' }}
                className="custom_sidebar"
            >
                {categoryToEdit && (
                    <FormCategoryEdit
                        categoryId={categoryToEdit.id.toString()}
                        categoryName={categoryToEdit.Category}
                        categoryColor={categoryToEdit.color}
                        onUpdate={() => {
                            fetchDataAndCalculateBalances();
                            setSidebarVisible(false);
                        }}
                        onRemove={() => {
                            const updatedCategories = categories.filter(cat => cat.id !== categoryToEdit.id);
                            setCategories(updatedCategories);
                            setSidebarVisible(false);
                        }}
                        onClose={() => setSidebarVisible(false)}
                    />
                )}
            </Sidebar>
        </div>
    );
}

export default AnnualMovements;
