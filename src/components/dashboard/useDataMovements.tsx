import { useEffect, useState } from "react";
import dataMovementsJson from "../../data/dataMovements.json";

// Definición de tipo para las entradas de transacciones mensuales con categoría y monto
type MonthlyTransactionEntry = {
  Category: string;
  Ammount: number;
};

// Definición de tipo para los meses del año
type Months =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";
// Objeto para mapear el número del mes a su correspondiente nombre
const monthMapping: Record<number, Months> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};
// Definición de tipo para las transacciones mensuales, que es un objeto con claves de tipo Months y valores que son un arreglo de MonthlyTransactionEntry
type MonthlyTransactions = {
  [key in Months]?: MonthlyTransactionEntry[];
};

// Definición de tipo para el objeto de datos anuales, donde cada año es una clave que apunta a un arreglo de MonthlyTransactions
type YearData = {
  [year: string]: MonthlyTransactions[];
};

// El archivo de datos es un arreglo de YearData
type DataMovementsFile = YearData[];
const dataMovementsFile: DataMovementsFile =
  dataMovementsJson as unknown as DataMovementsFile;

const useDataMovements = (year: string, month: string) => {
  // Estado para los datos del gráfico
  const [dataGraph, setDataGraph] = useState<
    {
      month: string;
      year: number;
      Income: number;
      Expenses: number;
    }[]
  >([]);
  // Estado para verificar si los datos han sido procesados
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dataProcessed, setDataProcessed] = useState(false);

  // Efecto para procesar datos cuando el año y mes han sido seleccionados
  useEffect(() => {
    if (!dataProcessed && year && month) {
      const selectedYearData = dataMovementsFile.find((data) =>
        Object.prototype.hasOwnProperty.call(data, year)
      );

      if (selectedYearData) {
        const monthName: Months = monthMapping[parseInt(month, 10)];
        const transactionsForMonth = selectedYearData[year].find(
          (monthlyTransactions) =>
            Object.prototype.hasOwnProperty.call(monthlyTransactions, monthName)
        );

        if (transactionsForMonth && transactionsForMonth[monthName]) {
          const transactionsArray = transactionsForMonth[monthName];

          if (transactionsArray && transactionsArray.length > 0) {
            const totalIncome = transactionsArray.reduce((acc, transaction) => {
              return transaction.Ammount > 0 ? acc + transaction.Ammount : acc;
            }, 0);

            const totalExpenses = transactionsArray.reduce(
              (acc, transaction) => {
                return transaction.Ammount < 0
                  ? acc + Math.abs(transaction.Ammount)
                  : acc;
              },
              0
            );

            setDataGraph([
              {
                month: monthName,
                year: parseInt(year, 10),
                Income: totalIncome,
                Expenses: totalExpenses,
              },
            ]);
          } else {
            // Establecer un estado que indica que no hay datos para mostrar
            setDataGraph([
              {
                month: monthName,
                year: parseInt(year, 10),
                Income: 0,
                Expenses: 0,
              },
            ]);
          }
          setDataProcessed(true);
        } else {
          console.error(
            "No transactions found for the selected month:",
            monthName
          );
        }
      }
    }
  }, [year, month, dataProcessed]);

  return { dataGraph };
};

export default useDataMovements;
