import { useState, useEffect } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

import { formatDateTime, formatCurrency } from '../../../../../helpers/functions';
import { getUserByToken } from '../../../../../api/users/getUserByToken';
import { Movements, Category, User } from '../../../../../helpers/types';

import FormMovementsEdit from './FormMovementsEdit';

import './MovementsTable.scss';

interface MovementsTableProps {
    data: Movements[];
    isDataEmpty: boolean;
    reloadData: () => void;
    categories: Category[];
}

export default function MovementsTable({ data, isDataEmpty, reloadData, categories }: MovementsTableProps) {
    const [editSidebarVisible, setEditSidebarVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Movements | null>(null);
    const [hoveredTransactionId, setHoveredTransactionId] = useState<string | null>(null);
    const [touchedTransactionId, setTouchedTransactionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('date_desc');
    const [userCurrency, setUserCurrency] = useState<string>('USD');

    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchUserCurrency = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const user: User = await getUserByToken(token);
                setUserCurrency(user.currency || 'USD');
            } catch (error) {
                console.error('Error fetching user currency:', error);
            }
        };

        fetchUserCurrency();
    }, []);

    // Function to open the edit sidebar and select the transaction to edit
    const editMovement = (transaction: Movements) => {
        setSelectedTransaction(transaction);
        setEditSidebarVisible(true);
    };

    // Get the color for a category by matching its name
    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.color : '#000'; // Default to black if no match is found
    };

    // Helper function to add opacity to a hex color
    const colorWithOpacity = (hexColor: string, opacity: number) => {
        const rgb = hexColor.replace('#', '').match(/.{1,2}/g)?.map(x => parseInt(x, 16));
        if (!rgb) return `rgba(0, 0, 0, ${opacity})`; // Default to black with opacity if parsing fails

        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`; // Convert to rgba format
    };

    // Sort movements based on the selected sorting option
    const sortMovements = (movements: Movements[]) => {
        switch (sortOption) {
            case 'date_asc':
                return movements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            case 'date_desc':
                return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            case 'amount_asc':
                return movements.sort((a, b) => a.amount - b.amount);
            case 'amount_desc':
                return movements.sort((a, b) => b.amount - a.amount);
            default:
                return movements;
        }
    };

    // Filter transactions by description or quantity
    const filteredMovements = data.filter((movement) => {
        const searchTermLower = searchTerm.toLowerCase();

        const searchAmount = parseFloat(searchTerm.replace(',', '.'));

        return (
            movement.description.toLowerCase().includes(searchTermLower) ||
            (!isNaN(searchAmount) && (
                movement.amount === searchAmount ||
                movement.amount.toString().includes(searchTerm)
            ))
        );
    });

    // Sort the filtered movements
    const sortedMovements = sortMovements([...filteredMovements]);

    return (
        <div className='movements__table'>
            <div className='filter-bar'>
                <div className='search-dropdown-container'>
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('dashboard.movements.movements_table.search_placeholder')}
                        className='p-inputtext-custom'
                    />
                    <Dropdown
                        value={sortOption}
                        options={[
                            { label: t('dashboard.movements.movements_table.date_new'), value: 'date_desc' },
                            { label: t('dashboard.movements.movements_table.date_old'), value: 'date_asc' },
                            { label: t('dashboard.movements.movements_table.amount_desc'), value: 'amount_desc' },
                            { label: t('dashboard.movements.movements_table.amount_asc'), value: 'amount_asc' }
                        ]}
                        onChange={(e) => setSortOption(e.value)}
                        placeholder={t('dashboard.movements.movements_table.sort_by')}
                        className='p-dropdown-custom'
                    />
                </div>
            </div>

            {isDataEmpty || sortedMovements.length === 0 ? (
                <ProgressBar mode='indeterminate' style={{ height: '0.375rem', width: '100%' }} />
            ) : (
                <div className='movements-list'>
                    {sortedMovements.map((transaction) => (
                        <div
                            key={transaction._id}
                            className='movement-item'
                            onClick={() => editMovement(transaction)}
                            onMouseEnter={() => setHoveredTransactionId(transaction._id)}
                            onMouseLeave={() => setHoveredTransactionId(null)}
                            onTouchStart={() => setTouchedTransactionId(transaction._id)}
                            style={{
                                backgroundColor:
                                    hoveredTransactionId === transaction._id || touchedTransactionId === transaction._id
                                        ? colorWithOpacity(getCategoryColor(transaction.category), 0.15)
                                        : 'transparent'
                            }}
                        >
                            <div className='category-mobile'>
                                <div
                                    className='category-color-circle'
                                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                                ></div>
                            </div>
                            <div className='description-section'>
                                <div className='description'>{transaction.description}</div>
                                <div className='date'>{formatDateTime(transaction.date, i18n.language)}</div>
                            </div>
                            <div className='category'>
                                <div
                                    className='category-color-circle'
                                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                                ></div>
                                <span>{transaction.category}</span>
                            </div>
                            <div className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                                {formatCurrency(transaction.amount, userCurrency)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Sidebar
                visible={editSidebarVisible}
                onHide={() => setEditSidebarVisible(false)}
                style={{ width: '500px' }}
                className='custom_sidebar'
                position='right'
                modal>
                {selectedTransaction && <FormMovementsEdit
                    transaction={selectedTransaction}
                    onEdit={() => {
                        reloadData();
                        setEditSidebarVisible(false);
                    }}
                    onRemove={() => {
                        reloadData();
                        setEditSidebarVisible(false);
                    }}
                />}
            </Sidebar>
        </div>
    );
}
