import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

import { formatCurrency, formatDateTime } from '../../../helpers/functions';

import "./MovementsTable.scss";
import FormMovementsEdit from './FormMovementsEdit';

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

function MovementsTable({ data, isDataEmpty, reloadData, categories }: MovementsTableProps) {
    const { t, i18n } = useTranslation();
    const [editSidebarVisible, setEditSidebarVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('date_desc');

    const editMovement = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditSidebarVisible(true);
    };

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.color : '#000';
    };

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

    const filteredMovements = data.filter(movement =>
        movement.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedMovements = sortMovements([...filteredMovements]);

    return (
        <div className="movements__table">
            <div className="filter-bar">
                <div className="search-dropdown-container">
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('dashboard.movements.movements_table.search_placeholder')}
                        className="p-inputtext-custom"
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
                        className="p-dropdown-custom"
                    />
                </div>
            </div>

            {isDataEmpty || sortedMovements.length === 0 ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
            ) : (
                <div className="movements-list">
                    {sortedMovements.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="movement-item"
                            onClick={() => editMovement(transaction)}
                        >
                            <div className="category-mobile">
                                <div
                                    className="category-color-circle"
                                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                                ></div>
                            </div>
                            <div className="description-section">
                                <div className="description">{transaction.description}</div>
                                <div className="date">{formatDateTime(transaction.date, i18n.language)}</div>
                            </div>
                            <div className="category">
                                <div
                                    className="category-color-circle"
                                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                                ></div>
                                <span>{transaction.category}</span>
                            </div>

                            <div className={`amount ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                                {formatCurrency(transaction.amount, i18n.language)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Sidebar
                visible={editSidebarVisible}
                onHide={() => setEditSidebarVisible(false)}
                style={{ width: '500px' }}
                className="custom_sidebar"
                position="right"
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

export default MovementsTable;
