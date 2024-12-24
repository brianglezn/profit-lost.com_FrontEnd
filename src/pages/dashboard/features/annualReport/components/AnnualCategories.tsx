import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { getAllCategories } from '../../../../../api/categories/getAllCategories';
import { getMovementsByYear } from '../../../../../api/movements/getMovementsByYear';
import { getUserByToken } from '../../../../../api/users/getUserByToken';
import { formatCurrency } from '../../../../../helpers/functions';
import { Category, Movements, User } from '../../../../../helpers/types';

import FormCategoryEdit from './FormCategoryEdit';
import AnnualCategoriesSkeleton from './AnnualCategoriesSkeleton';

import './AnnualCategories.scss';

type CategoryBalance = {
    id: string;
    Category: string;
    color: string;
    Balance: number;
};

interface AnnualCategoriesProps {
    year: string;
    reloadFlag: boolean;
}

export default function AnnualCategories({ year, reloadFlag }: AnnualCategoriesProps) {
    const [categories, setCategories] = useState<CategoryBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('name_asc');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<CategoryBalance | null>(null);
    const [userCurrency, setUserCurrency] = useState<string>('USD');

    const { t } = useTranslation();

    // Function to fetch data and calculate the category balances
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
            const movementsData: Movements[] = await getMovementsByYear(token, year);
            const user: User = await getUserByToken(token);
            
            setUserCurrency(user.currency || 'USD');

            // Calculate the balance for each category
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
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [year, t]);

    // useEffect hook to fetch data whenever the year or reloadFlag changes
    useEffect(() => {
        fetchDataAndCalculateBalances();
    }, [fetchDataAndCalculateBalances, reloadFlag]);

    // Function to handle editing a category
    const editCategory = (category: CategoryBalance) => {
        setCategoryToEdit(category);
        setSidebarVisible(true);
    };

    // Function to sort the categories based on the selected sort option
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

    // Filter and sort the categories based on search term and sort option
    const filteredCategories = categories.filter(category =>
        category.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCategories = sortCategories([...filteredCategories]);

    return (
        <div className='annual__categories'>
            <div className='filter-bar'>
                <div className='search-dropdown-container'>
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('dashboard.annual_report.annual_movements.search_placeholder')}
                        className='p-inputtext-custom'
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
                        className='p-dropdown-custom'
                    />
                </div>
            </div>

            {isLoading ? (
                <AnnualCategoriesSkeleton />
            ) : (
                <div className='categories-list'>
                    {sortedCategories.map((category) => (
                        <div
                            key={category.id}
                            className='category-item'
                            onClick={() => editCategory(category)}
                        >
                            <div className='category-color'>
                                <div
                                    className='category-color-circle'
                                    style={{ backgroundColor: category.color }}
                                ></div>
                            </div>
                            <div className='category-name'>{category.Category}</div>
                            <div className={`category-balance ${category.Balance >= 0 ? 'positive' : 'negative'}`}>
                                {formatCurrency(category.Balance, userCurrency)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Sidebar
                visible={sidebarVisible}
                onHide={() => setSidebarVisible(false)}
                position='right'
                style={{ width: '500px' }}
                className='custom_sidebar'
            >
                {categoryToEdit && (
                    <FormCategoryEdit
                        categoryId={categoryToEdit.id}
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
}
