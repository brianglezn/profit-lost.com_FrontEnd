import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

import { formatCurrency, formatDateTime } from '../../../../../helpers/functions';

import FormMovementsEdit from './FormMovementsEdit';

import './MovementsTable.scss';

type Transaction = {
    _id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
};

interface Category {
    _id: string;
    name: string;
    color: string;
}

interface MovementsTableProps {
    data: Transaction[];
    isDataEmpty: boolean;
    reloadData: () => void;
    categories: Category[];
}

export default function MovementsTable({ data, isDataEmpty, reloadData, categories }: MovementsTableProps) {
    const [editSidebarVisible, setEditSidebarVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [hoveredTransactionId, setHoveredTransactionId] = useState<string | null>(null);
    const [touchedTransactionId, setTouchedTransactionId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('date_desc');

    const { t, i18n } = useTranslation();

    // Function to open the edit sidebar and select the transaction to edit
    const editMovement = (transaction: Transaction) => {
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
    const sortMovements = (movements: Transaction[]) => {
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

    // Filter movements based on the search term
    const filteredMovements = data.filter(movement =>
        movement.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered movements
    const sortedMovements = sortMovements([...filteredMovements]);

    return (
        <div className='movements__table'>
            {/* Search bar and sorting dropdown */}
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

            {/* Show loading bar if data is empty or being loaded */}
            {isDataEmpty || sortedMovements.length === 0 ? (
                <ProgressBar mode='indeterminate' style={{ height: '0.375rem', width: '100%' }} />
            ) : (
                // List of transactions
                <div className='movements-list'>
                    {sortedMovements.map((transaction) => (
                        <div
                            key={transaction._id}
                            className='movement-item'
                            onClick={() => editMovement(transaction)}
                            onMouseEnter={() => setHoveredTransactionId(transaction._id)} // For hover on PC
                            onMouseLeave={() => setHoveredTransactionId(null)} // Remove hover effect
                            onTouchStart={() => setTouchedTransactionId(transaction._id)} // For touch on mobile
                            style={{
                                // Change background color if the item is hovered or touched
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

                            {/* Show amount with appropriate color for positive/negative values */}
                            <div className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                                {formatCurrency(transaction.amount, i18n.language)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sidebar for editing a transaction */}
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
