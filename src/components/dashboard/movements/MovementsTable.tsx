import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';

import { formatCurrency, formatDateTime } from '../../../helpers/functions';

import "./MovementsTable.scss";
import FormMovementsEdit from './FormMovementsEdit';
import PencilIcon from '../../icons/PencilIcon';

type Transaction = {
    _id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
    color: string;
};

interface MovementsTableProps {
    data: Transaction[];
    isDataEmpty: boolean;
    reloadData: () => void;
}

function MovementsTable({ data, isDataEmpty, reloadData }: MovementsTableProps) {
    const [editSidebarVisible, setEditSidebarVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const editMovement = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditSidebarVisible(true);
    };

    return (
        <div className="movements__table">
            {isDataEmpty || data.length === 0 ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
            ) : (
                <div className="movements-list">
                    {data.map((transaction) => (
                        <div key={transaction._id} className="movement-item">
                            <div className="description-section">
                                <div className="description">{transaction.description}</div>
                                <div className="date">{formatDateTime(transaction.date)}</div>
                            </div>
                            <div className="category">
                                <span>{transaction.category}</span>
                            </div>
                            <div className={`amount ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                                {formatCurrency(transaction.amount)}
                            </div>
                            <div className="edit-icon">
                                <PencilIcon onClick={() => editMovement(transaction)} />
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
