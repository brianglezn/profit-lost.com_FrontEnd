import { useEffect, useState, useCallback } from "react";
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState<CategoryBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('name_asc');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryBalance | null>(null);

    const fetchDataAndCalculateBalances = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('landing.auth.common.error_token'));
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
            toast.error(t('dashboard.annual_report.annual_movements.error_loading'));
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [year, t]);

    useEffect(() => {
        fetchDataAndCalculateBalances();
    }, [fetchDataAndCalculateBalances, reloadFlag]);

    const editCategory = (category: CategoryBalance) => {
        setCategoryToEdit(category);
        setSidebarVisible(true);
    };

    const sortCategories = (categories: CategoryBalance[]) => {
        switch (sortOption) {
            case 'name_asc':
                return categories.sort((a, b) => a.Category.localeCompare(b.Category));
            case 'name_desc':
                return categories.sort((a, b) => b.Category.localeCompare(a.Category));
            case 'balance_asc':
                return categories.sort((a, b) => a.Balance - b.Balance);
            case 'balance_desc':
                return categories.sort((a, b) => b.Balance - a.Balance);
            default:
                return categories;
        }
    };

    const filteredCategories = categories.filter(category =>
        category.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCategories = sortCategories([...filteredCategories]);

    return (
        <div className="annual__categories">


            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
            ) : (
                <>
                    <div className="filter-bar">
                        <div className="search-dropdown-container">
                            <InputText
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('dashboard.annual_report.annual_movements.search_placeholder')}
                                className="p-inputtext-custom"
                            />
                            <Dropdown
                                value={sortOption}
                                options={[
                                    { label: t('dashboard.annual_report.annual_movements.name_asc'), value: 'name_asc' },
                                    { label: t('dashboard.annual_report.annual_movements.name_desc'), value: 'name_desc' },
                                    { label: t('dashboard.annual_report.annual_movements.balance_desc'), value: 'balance_desc' },
                                    { label: t('dashboard.annual_report.annual_movements.balance_asc'), value: 'balance_asc' }
                                ]}
                                onChange={(e) => setSortOption(e.value)}
                                placeholder={t('dashboard.annual_report.annual_movements.sort_by')}
                                className="p-dropdown-custom"
                            />
                        </div>
                    </div>
                    <div className="categories-list">
                        {sortedCategories.length === 0 ? (
                            <p>{t('dashboard.annual_report.annual_movements.no_movements')}</p>
                        ) : (
                            sortedCategories.map((category) => (
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
                                        {formatCurrency(category.Balance, i18n.language)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

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
                            toast.success(t('dashboard.annual_report.form_cat_edit.success_message_edit'));
                        }}
                        onRemove={() => {
                            const updatedCategories = categories.filter(cat => cat.id !== categoryToEdit.id);
                            setCategories(updatedCategories);
                            setSidebarVisible(false);
                            toast.success(t('dashboard.annual_report.form_cat_edit.success_message_delete'));
                        }}
                        onClose={() => setSidebarVisible(false)}
                    />
                )}
            </Sidebar>
        </div>
    );
};

export default AnnualMovements;
