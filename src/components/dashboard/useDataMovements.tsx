// import { useEffect, useState } from "react";
// import dataMovementsJson from "../../data/dataMovements.json";

// // Type definition for monthly transaction entries with category and amount
// type MonthlyTransactionEntry = {
//   Category: string;
//   Amount: number;
// };
// // Type definition for the months of the year
// type Months =
//   | "Jan"
//   | "Feb"
//   | "Mar"
//   | "Apr"
//   | "May"
//   | "Jun"
//   | "Jul"
//   | "Aug"
//   | "Sep"
//   | "Oct"
//   | "Nov"
//   | "Dec";
// // Object to map the number of the month to its corresponding name
// const monthMapping: Record<number, Months> = {
//   1: "Jan",
//   2: "Feb",
//   3: "Mar",
//   4: "Apr",
//   5: "May",
//   6: "Jun",
//   7: "Jul",
//   8: "Aug",
//   9: "Sep",
//   10: "Oct",
//   11: "Nov",
//   12: "Dec",
// };
// // Type definition for the monthly transactions, which is an object with keys of type Months and values that are an array of MonthlyTransactionEntry
// type MonthlyTransactions = {
//   [key in Months]?: MonthlyTransactionEntry[];
// };
// // Type definition for the annual data object, where each year is a key pointing to an array of MonthlyTransactions
// type YearData = {
//   [year: string]: MonthlyTransactions[];
// };
// // The data file is an array of YearData
// type DataMovementsFile = YearData[];
// const dataMovementsFile: DataMovementsFile =
//   dataMovementsJson as unknown as DataMovementsFile;

// const useDataMovements = (year: string, month: string) => {
//   // Status for chart data
//   const [dataGraph, setDataGraph] = useState<
//     {
//       month: string;
//       year: number;
//       Income: number;
//       Expenses: number;
//     }[]
//   >([]);
//   // Status to check if the data has been processed
//   const [dataProcessed, setDataProcessed] = useState(false);

//   // Effect to process data when the year and month have been selected
//   useEffect(() => {
//     if (!dataProcessed && year && month) {
//       // Search the data for the selected year
//       const selectedYearData = dataMovementsFile.find((data) =>
//         Object.prototype.hasOwnProperty.call(data, year)
//       );

//       if (selectedYearData) {
//         // Converts the month number to the corresponding name
//         const monthName: Months = monthMapping[parseInt(month, 10)];
//         // Search transactions for the selected month
//         const transactionsForMonth = selectedYearData[year].find(
//           (monthlyTransactions) =>
//             Object.prototype.hasOwnProperty.call(monthlyTransactions, monthName)
//         );

//         if (transactionsForMonth && transactionsForMonth[monthName]) {
//           const transactionsArray = transactionsForMonth[monthName];

//           if (transactionsArray && transactionsArray.length > 0) {
//             // Calculates total income and expenses
//             const totalIncome = transactionsArray.reduce((acc, transaction) => {
//               return transaction.Amount > 0 ? acc + transaction.Amount : acc;
//             }, 0);

//             const totalExpenses = transactionsArray.reduce(
//               (acc, transaction) => {
//                 return transaction.Amount < 0
//                   ? acc + Math.abs(transaction.Amount)
//                   : acc;
//               },
//               0
//             );

//             // Update the status with the data from the chart
//             setDataGraph([
//               {
//                 month: monthName,
//                 year: parseInt(year, 10),
//                 Income: totalIncome,
//                 Expenses: totalExpenses,
//               },
//             ]);
//           } else {
//             // Sets a status indicating that there is no data to show
//             setDataGraph([
//               {
//                 month: monthName,
//                 year: parseInt(year, 10),
//                 Income: 0,
//                 Expenses: 0,
//               },
//             ]);
//           }
//           // Mark data as processed
//           setDataProcessed(true);
//         } else {
//           console.error(
//             "No transactions found for the selected month:",
//             monthName
//           );
//         }
//       }
//     }
//   }, [year, month, dataProcessed]);

//   // Effect to reset dataProcessed when year or month change
//   useEffect(() => {
//     setDataProcessed(false);
//   }, [year, month]);

//   return { dataGraph };
// };

// export default useDataMovements;

import { useEffect, useState } from "react";
import dataMovementsJson from "../../data/dataMovements2.json";

// Actualización del tipo de transacción para reflejar la nueva estructura de datos
type Transaction = {
  date: string;
  category: string;
  description: string;
  amount: number;
  transactionId: string;
};

const useDataMovements = (year: string, month: string) => {
  const [dataGraph, setDataGraph] = useState<Array<{
    month: string;
    year: number;
    Income: number;
    Expenses: number;
  }>>([]);

  useEffect(() => {
    // Filtrar transacciones por año y mes seleccionados
    const filteredTransactions = dataMovementsJson.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear().toString() === year && (transactionDate.getMonth() + 1).toString() === month;
    });

    // Calcular ingresos y gastos totales
    const totalIncome = filteredTransactions.reduce((acc, transaction) => {
      return transaction.amount > 0 ? acc + transaction.amount : acc;
    }, 0);

    const totalExpenses = filteredTransactions.reduce((acc, transaction) => {
      return transaction.amount < 0 ? acc + Math.abs(transaction.amount) : acc;
    }, 0);

    // Actualizar dataGraph con los nuevos valores calculados
    setDataGraph([{
      month: month,
      year: parseInt(year),
      Income: totalIncome,
      Expenses: totalExpenses,
    }]);
  }, [year, month]);

  return { dataGraph };
};

export default useDataMovements;
