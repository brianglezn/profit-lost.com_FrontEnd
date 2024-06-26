import { useEffect, useState, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';

import { formatCurrency } from "../../../helpers/functions";

import "./AnnualMovements.scss";
import FormCategoryEdit from "./FormCategoryEdit";
import PencilIcon from "../../icons/PencilIcon";

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
    }, [year]);

    useEffect(() => {
        fetchDataAndCalculateBalances();
    }, [fetchDataAndCalculateBalances, reloadFlag]);

    const balanceTemplate = (rowData: CategoryBalance) => {
        return (
            <span className={rowData.Balance >= 0 ? "positive" : "negative"}>
                {formatCurrency(rowData.Balance)}
            </span>
        );
    };

    const editCategory = (category: CategoryBalance) => {
        setCategoryToEdit(category);
        setSidebarVisible(true);
    };

    return (
        <div className="annual__categories-table">
            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            ) : (
                <>
                    <DataTable value={categories} className="p-datatable-gridlines" sortField="Category" sortOrder={1}>
                        <Column field="Category" header="Category" sortable style={{ width: '55%' }}></Column>
                        <Column field="Balance" header="Balance" body={balanceTemplate} sortable style={{ width: '40%' }}></Column>
                        <Column body={(rowData: CategoryBalance) => (
                            <div className="annual__categories-options">
                                <PencilIcon onClick={() => editCategory(rowData)} />
                            </div>
                        )} style={{ width: '5%', textAlign: 'center' }}></Column>
                    </DataTable>
                    <Sidebar
                        visible={sidebarVisible}
                        onHide={() => setSidebarVisible(false)}
                        position="right"
                        style={{ width: '500px' }}
                        className="custom_sidebar"
                    >
                        {categoryToEdit && (
                            <FormCategoryEdit
                                categoryId={categoryToEdit.id.toString()}
                                categoryName={categoryToEdit.Category}
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
                </>
            )}
        </div>
    );
}

export default AnnualMovements;