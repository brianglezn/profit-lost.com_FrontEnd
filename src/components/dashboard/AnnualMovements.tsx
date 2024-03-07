// import { useEffect, useMemo, useState } from "react";
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { ProgressBar } from 'primereact/progressbar';

// import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
// import LinearProgress from "@mui/material/LinearProgress";

// type Transaction = {
//     date: string;
//     category: string;
//     description: string;
//     amount: number;
// };

// type CategoryBalance = {
//     id: number;
//     Category: string;
//     Balance: number;
//     InOut: string;
// };

// interface AnnualMovementsProps {
//     year: string;
// }

// function formatCurrency(value: number) {
//     return value.toLocaleString("es-ES", {
//         style: "currency",
//         currency: "EUR",
//         minimumFractionDigits: 2,
//         useGrouping: true,
//     });
// }

// function AnnualMovements({ year }: AnnualMovementsProps) {
//     const [tableRows, setTableRows] = useState<GridRowsProp>([]);

//     useEffect(() => {
//         const token = localStorage.getItem('token');

//         const fetchData = async () => {
//             const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const dataMovements: Transaction[] = await response.json();

//             const categoryBalances = dataMovements.reduce((acc: { [category: string]: CategoryBalance }, transaction, index) => {
//                 const { category, amount } = transaction;
//                 if (!acc[category]) {
//                     acc[category] = { id: index, Category: category, Balance: 0, InOut: amount >= 0 ? "IN" : "OUT" };
//                 }
//                 acc[category].Balance += amount;
//                 return acc;
//             }, {});

//             setTableRows(Object.values(categoryBalances));
//         };

//         fetchData().catch(console.error);
//     }, [year]);

//     const balanceBodyTemplate = (rowData) => {
//         return formatCurrency(rowData.Balance);
//     };

//     const textEditor = (options) => {
//         return (
//             <InputText
//                 type="text"
//                 value={options.rowData['Category']}
//                 onChange={(e) => onEditorValueChange(options, e.target.value)}
//             />
//         );
//     };

//     const balanceEditor = (options) => {
//         return (
//             <InputNumber
//                 value={options.rowData['Balance']}
//                 onValueChange={(e) => onEditorValueChange(options, e.value)}
//                 mode="currency"
//                 currency="EUR"
//                 locale="es-ES"
//             />
//         );
//     };

//     const onEditorValueChange = (options, value) => {
//         let updatedCategories = [...categories];
//         updatedCategories[options.rowIndex][options.field] = value;
//         setCategories(updatedCategories);
//     };

//     const onRowEditComplete = (e) => {
//         // Actualizar el estado y/o backend aquí
//     };

//     return (
//         <>
//             <ProgressBar mode="indeterminate" style={{ height: '6px' }} />

//             <div className="annualReport__category-table">
//                 {categories.length > 0 ? (
//                     <DataTable
//                         value={categories}
//                         editMode="row"
//                         onRowEditComplete={onRowEditComplete}
//                     >
//                         <Column field="Category" header="Category" editor={textEditor} />
//                         <Column
//                             field="Balance"
//                             header="Balance"
//                             body={balanceBodyTemplate}
//                             editor={balanceEditor}
//                         />
//                         <Column
//                             rowEditor
//                             headerStyle={{ width: '7rem' }}
//                             bodyStyle={{ textAlign: 'center' }}
//                         />
//                     </DataTable>
//                 ) : (
//                     <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
//                 )}
//             </div>
//         </>
//     );
// }

// export default AnnualMovements;
