import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';

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
    const [editSidebarVisible, setEditSidebarVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const editMovement = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditSidebarVisible(true);
    };

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.color : '#000';
    };

    return (
        <div className="movements__table">
            {isDataEmpty || data.length === 0 ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
            ) : (
                <div className="movements-list">
                    {data.map((transaction) => (
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
                                <div className="date">{formatDateTime(transaction.date)}</div>
                            </div>
                            <div className="category">
                                <div
                                    className="category-color-circle"
                                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                                ></div>
                                <span>{transaction.category}</span>
                            </div>

                            <div className={`amount ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                                {formatCurrency(transaction.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Sidebar
                visible={editSidebarVisible}
                onHide={() => setEditSidebarVisible(false)}
                style={{ width: '450px' }}
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
