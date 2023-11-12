import { useEffect, useState } from "react";
import dataMovementsJson from "../../data/dataMovements.json";

// Definición de tipo para las entradas de transacciones mensuales con categoría y monto
type MonthlyTransactionEntry = {
  Category: string;
  Amount: number;
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
  const [dataProcessed, setDataProcessed] = useState(false);

  // Efecto para procesar datos cuando el año y mes han sido seleccionados
  useEffect(() => {
    if (!dataProcessed && year && month) {
      // Busca los datos del año seleccionado
      const selectedYearData = dataMovementsFile.find((data) =>
        Object.prototype.hasOwnProperty.call(data, year)
      );

      if (selectedYearData) {
        // Convierte el número del mes al nombre correspondiente
        const monthName: Months = monthMapping[parseInt(month, 10)];
        // Busca las transacciones para el mes seleccionado
        const transactionsForMonth = selectedYearData[year].find(
          (monthlyTransactions) =>
            Object.prototype.hasOwnProperty.call(monthlyTransactions, monthName)
        );

        if (transactionsForMonth && transactionsForMonth[monthName]) {
          const transactionsArray = transactionsForMonth[monthName];

          if (transactionsArray && transactionsArray.length > 0) {
            // Calcula el total de ingresos y gastos
            const totalIncome = transactionsArray.reduce((acc, transaction) => {
              return transaction.Amount > 0 ? acc + transaction.Amount : acc;
            }, 0);

            const totalExpenses = transactionsArray.reduce(
              (acc, transaction) => {
                return transaction.Amount < 0
                  ? acc + Math.abs(transaction.Amount)
                  : acc;
              },
              0
            );

            // Actualiza el estado con los datos del gráfico
            setDataGraph([
              {
                month: monthName,
                year: parseInt(year, 10),
                Income: totalIncome,
                Expenses: totalExpenses,
              },
            ]);
          } else {
            // Establece un estado que indica que no hay datos para mostrar
            setDataGraph([
              {
                month: monthName,
                year: parseInt(year, 10),
                Income: 0,
                Expenses: 0,
              },
            ]);
          }
          // Marca los datos como procesados
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

  // Efecto para restablecer dataProcessed cuando cambian el año o el mes
  useEffect(() => {
    setDataProcessed(false);
  }, [year, month]);

  return { dataGraph };
};

export default useDataMovements;
