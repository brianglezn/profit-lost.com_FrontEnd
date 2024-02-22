import { useEffect, useState } from "react";
import dataMovementsJson from "../../data/dataMovements.json";

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
