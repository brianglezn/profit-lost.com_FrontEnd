import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import FormMovementsEdit from "./FormMovementsEdit";
import FormMovementsRemove from "./FormMovementsRemove";

type Transaction = {
    _id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
};

interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

function formatCurrency(value: number): string {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function MovementsTable({ year, month, isDataEmpty }: MovementsProps) {
    const [tableRows, setTableRows] = useState<Transaction[]>([]);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}/${month}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let transactions: Transaction[] = await response.json();
    
                transactions = transactions.map(transaction => {
                    const normalizedDate = transaction.date.length === 7 ? `${transaction.date}-01` : transaction.date;
                    return { ...transaction, normalizedDate };
                }).sort((a, b) => b.normalizedDate.localeCompare(a.normalizedDate));
    
                setTableRows(transactions);
            } catch (error) {
                console.error('Error fetching transactions data:', error);
            }
        };
    
        fetchData();
    }, [year, month]);

    const amountBodyTemplate = (rowData: Transaction) => {
        const className = rowData.amount >= 0 ? "positive" : "negative";
        return (
            <span className={className}>
                {formatCurrency(rowData.amount)}
            </span>
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

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showDescriptionColumn = windowWidth > 768;

    return (
        <div className="movements__movements-table">
            {isDataEmpty || tableRows.length === 0 ? (
                <>
                    <p>No data available for this month.</p>
                    <ProgressBar mode="indeterminate" style={{ height: '6px', width: '100%' }} />
                </>
            ) : (
                <DataTable value={tableRows} className="p-datatable-gridlines" paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" rows={10} rowsPerPageOptions={[5, 10, 25, 50]}>
                    <Column field="category" header="Category" sortable style={{ width: '25%' }}></Column>
                    {showDescriptionColumn && <Column field="description" header="Description" sortable style={{ width: '50%' }} />}
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable style={{ width: '20%' }}></Column>
                    <Column body={(rowData: Transaction) => (
                        <div className="movements__table-options">
                            <span className="material-symbols-rounded no-select button-action" onClick={() => deleteMovement(rowData)}>
                                delete
                            </span>
                            <span className="material-symbols-rounded no-select button-action" onClick={() => editMovement(rowData)}>
                                edit
                            </span>
                        </div>
                    )} style={{ width: '5%', textAlign: 'center' }}></Column>
                </DataTable>
            )
            }
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                style={{ width: '50vw' }}
                header="Edit Transaction"
                modal
                draggable={false}>
                {selectedTransaction && (
                    <FormMovementsEdit
                        transaction={selectedTransaction}
                        onSave={() => {
                            setEditDialogVisible(false);
                        }}
                    />
                )}
            </Dialog>
            <Dialog
                visible={deleteDialogVisible}
                onHide={() => setDeleteDialogVisible(false)}
                style={{ width: '30vw' }}
                header="Delete Transaction"
                modal
                draggable={false}>
                {selectedTransaction && (
                    <FormMovementsRemove
                        transactionId={selectedTransaction._id}
                        onRemove={() => {
                            setTableRows(tableRows.filter(t => t._id !== selectedTransaction._id));
                            setDeleteDialogVisible(false);
                        }}
                    />
                )}
            </Dialog>
        </div >
    );
}

export default MovementsTable;