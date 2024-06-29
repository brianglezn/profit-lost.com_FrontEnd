import { useEffect, useState, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';

import { formatCurrency } from "../../../helpers/functions";
import { getAllCategories } from "../../../api/categories/getAllCategories";
import { getMovementsByYear } from "../../../api/movements/getMovementsByYear";

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

    const colorTemplate = (rowData: CategoryBalance) => {
        return (
            <div
                style={{
                    backgroundColor: rowData.color,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    margin: 'auto'
                }}
            ></div>
        );
    };

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
                        <Column field="color" body={colorTemplate} style={{ width: '2%' }} />
                        <Column field="Category" header="Category" sortable style={{ width: '45%' }}></Column>
                        <Column field="Balance" header="Balance" body={balanceTemplate} sortable style={{ width: '38%' }}></Column>
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

                </>
            )}
        </div>
    );
}

export default AnnualMovements;