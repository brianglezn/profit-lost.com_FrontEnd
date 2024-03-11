import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import FormCategoryRemove from "./FormCategoryRemove";

type Transaction = {
    category: string;
    amount: number;
};

type Category = {
    _id: string;
    name: string;
};

type CategoryBalance = {
    id: string;
    Category: string;
    Balance: number;
};

interface AnnualMovementsProps {
    year: string;
    reloadFlag: boolean;
}

function formatCurrency(value: number) {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function AnnualMovements({ year, reloadFlag }: AnnualMovementsProps) {
    const [categories, setCategories] = useState<CategoryBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryBalance | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return;
        }

        const fetchCategories = async () => {
            try {
                const response = await fetch('https://profit-lost-backend.onrender.com/categories/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const categoriesData: Category[] = await response.json();
                const initialCategories = categoriesData.map(category => ({
                    id: category._id,
                    Category: category.name,
                    Balance: 0,
                }));

                setCategories(initialCategories);
                setIsLoading(false);
            } catch (error) {
                console.error("Error retrieving categories:", error);
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [year, reloadFlag]);

    useEffect(() => {
        if (!isLoading) {
            fetchMovements();
        }
    }, [isLoading, year]);

    const fetchMovements = async () => {
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const dataMovements: Transaction[] = await response.json();

            const updatedCategories = [...categories];
            dataMovements.forEach(transaction => {
                const categoryIndex = updatedCategories.findIndex(category => category.Category === transaction.category);
                if (categoryIndex !== -1) {
                    updatedCategories[categoryIndex].Balance += transaction.amount;
                }
            });

            setCategories(updatedCategories);
        };

        fetchData().catch(console.error);
    };

    const balanceTemplate = (rowData: CategoryBalance) => {
        return (
            <span className={rowData.Balance >= 0 ? "positive" : "negative"}>
                {formatCurrency(rowData.Balance)}
            </span>
        );
    };

    const deleteCategory = (category: CategoryBalance) => {
        setCategoryToDelete(category);
        setDeleteDialogVisible(true);
    };
    return (
        <div className="annualReport__category-table">
            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            ) : (
                <>
                    <DataTable value={categories} className="p-datatable-gridlines">
                        <Column field="Category" header="Category" sortable></Column>
                        <Column field="Balance" header="Balance" body={balanceTemplate} sortable></Column>
                        <Column body={(rowData: CategoryBalance) => (
                            <span className="material-symbols-rounded no-select button-action" onClick={() => deleteCategory(rowData)}>
                                delete
                            </span>
                        )} style={{ width: '5%', textAlign: 'center' }}></Column>
                    </DataTable>
                    <Dialog
                        visible={deleteDialogVisible}
                        onHide={() => setDeleteDialogVisible(false)}
                        style={{ width: '40vw' }}
                        header="Remove Category"
                        modal
                        draggable={false}>
                        {categoryToDelete && (
                            <FormCategoryRemove
                                categoryId={categoryToDelete.id.toString()}
                                categoryName={categoryToDelete.Category}
                                onRemove={() => {
                                    const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
                                    setCategories(updatedCategories);
                                }}
                                onClose={() => setDeleteDialogVisible(false)}
                            />
                        )}
                    </Dialog>
                </>
            )
            }
        </div >
    );
}

export default AnnualMovements;