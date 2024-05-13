import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import FormCategoryRemove from "./FormCategoryRemove";
import FormCategoryEdit from "./FormCategoryEdit";

import "./AnnualMovements.scss";

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

const AnnualMovements: React.FC<AnnualMovementsProps> = ({ year, reloadFlag }) => {
    const [categories, setCategories] = useState<CategoryBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryBalance | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryBalance | null>(null);


    const fetchDataAndCalculateBalances = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            setIsLoading(false);
            return;
        }

        try {
            const categoriesResponse = await fetch('https://profit-lost-backend.onrender.com/categories/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
            const categoriesData: Category[] = await categoriesResponse.json();

            const movementsResponse = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!movementsResponse.ok) throw new Error('Failed to fetch movements');
            const movementsData: Transaction[] = await movementsResponse.json();

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
                };
            });

            setCategories(categoryBalances);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAndCalculateBalances();
    }, [year, reloadFlag]);

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
    const editCategory = (category: CategoryBalance) => {
        setCategoryToEdit(category);
        setEditDialogVisible(true);
    };

    return (
        <div className="annual__categories-table">
            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            ) : (
                <>
                    <DataTable value={categories} className="p-datatable-gridlines">
                        <Column field="Category" header="Category" sortable style={{ width: '55%' }}></Column>
                        <Column field="Balance" header="Balance" body={balanceTemplate} sortable style={{ width: '40%' }}></Column>
                        <Column body={(rowData: CategoryBalance) => (
                            <div className="annual__categories-options">
                                <span className="material-symbols-rounded no-select button-action" onClick={() => deleteCategory(rowData)}>
                                    delete
                                </span>
                                <span className="material-symbols-rounded no-select button-action" onClick={() => editCategory(rowData)}>
                                    edit
                                </span>
                            </div>
                        )} style={{ width: '5%', textAlign: 'center' }}></Column>
                    </DataTable>
                    <Dialog
                        visible={deleteDialogVisible}
                        onHide={() => setDeleteDialogVisible(false)}
                        style={{ width: '40vw' }}
                        header="Remove Category"
                        className="custom_dialog"
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
                    <Dialog
                        visible={editDialogVisible}
                        onHide={() => setEditDialogVisible(false)}
                        style={{ width: '40vw' }}
                        header="Edit Category Name"
                        className="custom_dialog"
                        modal
                        draggable={false}>
                        {categoryToEdit && (
                            <FormCategoryEdit
                                categoryId={categoryToEdit.id.toString()}
                                categoryName={categoryToEdit.Category}
                                onUpdate={() => {
                                    fetchDataAndCalculateBalances();
                                }}
                                onClose={() => setEditDialogVisible(false)}
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