import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import FormMovementsEdit from './FormMovementsEdit';
import FormMovementsRemove from './FormMovementsRemove';

type Transaction = {
    _id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
};

interface MovementsTableProps {
    data: Transaction[];
    isDataEmpty: boolean;
}

function formatCurrency(value: number): string {
    return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function formatDateTime(value: string): string {
    const date = new Date(value);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function MovementsTable({ data, isDataEmpty }: MovementsTableProps) {
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [expandedRows, setExpandedRows] = useState({});

    const amountBodyTemplate = (rowData: Transaction) => {
        return <span className={rowData.amount >= 0 ? 'positive' : 'negative'}>{formatCurrency(rowData.amount)}</span>;
    };

    const rowExpansionTemplate = (rowData: Transaction) => {
        return (
            <div>
                <p><strong>Date:</strong> {formatDateTime(rowData.date)}</p>
                <p><strong>Description:</strong> {rowData.description}</p>
                <p><strong>Category:</strong> {rowData.category}</p>
                <p><strong>Amount:</strong> {formatCurrency(rowData.amount)}</p>
            </div>
        );
    };

    const editMovement = (rowData: Transaction) => {
        setSelectedTransaction(rowData);
        setEditDialogVisible(true);
    };

    const deleteMovement = (rowData: Transaction) => {
        setSelectedTransaction(rowData);
        setDeleteDialogVisible(true);
    };

    return (
        <div className="movements__movements-table">
            {isDataEmpty || data.length === 0 ? (
                <>
                    <p>No data available for this month.</p>
                    <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
                </>
            ) : (
                <DataTable
                    value={data}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="_id"
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                >
                    <Column expander style={{ width: '5%' }} />
                    <Column field="description" header="Description" sortable style={{ width: '50%' }} />
                    <Column field="amount" header="Amount" body={amountBodyTemplate} style={{ width: '40%' }} sortable />
                    <Column
                        body={(rowData) => (
                            <div className="movements__table-options">
                                <span className="material-symbols-rounded no-select button-action" onClick={() => deleteMovement(rowData)}>delete</span>
                                <span className="material-symbols-rounded no-select button-action" onClick={() => editMovement(rowData)}>edit</span>
                            </div>
                        )}
                        style={{ width: '5%', textAlign: 'center' }}
                    />
                </DataTable>
            )}
            <Dialog visible={editDialogVisible} onHide={() => setEditDialogVisible(false)} style={{ width: '50vw' }} header="Edit Transaction" modal draggable={false}>
                {selectedTransaction && <FormMovementsEdit transaction={selectedTransaction} onSave={() => setEditDialogVisible(false)} />}
            </Dialog>
            <Dialog visible={deleteDialogVisible} onHide={() => setDeleteDialogVisible(false)} style={{ width: '30vw' }} header="Delete Transaction" modal draggable={false}>
                {selectedTransaction && (
                    <FormMovementsRemove
                        transactionId={selectedTransaction._id}
                        onRemove={() => {
                            setDeleteDialogVisible(false);
                        }}
                    />
                )}
            </Dialog>
        </div>
    );
}

export default MovementsTable;
