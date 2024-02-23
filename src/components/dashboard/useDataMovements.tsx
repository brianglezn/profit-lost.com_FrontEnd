import { useEffect, useState } from "react";
import dataMovementsJson from "../../data/dataMovements.json";

type Transaction = {
  date: string;
  category: string;
  description: string;
  amount: number;
};

const useDataMovements = (year: string, month: string) => {
  const [dataGraph, setDataGraph] = useState<Array<{
    month: string;
    year: number;
    Income: number;
    Expenses: number;
  }>>([]);

  useEffect(() => {
    const filteredTransactions = dataMovementsJson.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear().toString() === year && (transactionDate.getMonth() + 1).toString() === month;
    });

    const totalIncome = filteredTransactions.reduce((acc, transaction) => {
      return transaction.amount > 0 ? acc + transaction.amount : acc;
    }, 0);

    const totalExpenses = filteredTransactions.reduce((acc, transaction) => {
      return transaction.amount < 0 ? acc + Math.abs(transaction.amount) : acc;
    }, 0);

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
