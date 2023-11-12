import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import dataMovementsFile from "../../data/dataMovements.json";
import { useEffect, useState } from "react";

// Definimos los tipos para las transacciones mensuales y la estructura de los datos.
type MonthlyTransaction = {
    Category: string;
    Amount: number;
}[];
type Month =
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

type DataMovement = {
    [key: string]: {
        [month in Month]?: MonthlyTransaction;
    }[];
};
type ChartDataItem = {
    month: string;
    Income: number;
    Expenses: number;
    hasData: boolean;
};
interface AnnualChartProps {
    year: string;
}


function AnnualChart(props: AnnualChartProps) {

    const { year } = props;

    // Estado para almacenar los datos del gráfico.
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    useEffect(() => {
        // Calculamos los datos para el gráfico cuando el año cambia.
        const selectedYearData = dataMovementsFile.find(
            (y) => Object.keys(y)[0] === year.toString()
        ) as DataMovement | undefined;

        // Si hay datos para el año seleccionado, los procesamos para el gráfico.
        if (selectedYearData && year.toString() in selectedYearData) {
            const monthlyDataArray = selectedYearData[year.toString()];

            if (Array.isArray(monthlyDataArray)) {
                const incomeExpensesByMonth = monthlyDataArray.map((monthEntry) => {
                    const [month, transactions] = Object.entries(monthEntry)[0];

                    let monthlyIncome = 0;
                    let monthlyExpenses = 0;
                    const hasData = transactions && transactions.length > 0;

                    // Sumamos los ingresos y restamos los gastos para cada mes.
                    if (Array.isArray(transactions)) {
                        transactions.forEach((transaction) => {
                            if (transaction.Amount > 0) {
                                monthlyIncome += transaction.Amount;
                            } else {
                                monthlyExpenses += Math.abs(transaction.Amount);
                            }
                        });
                    }

                    // Hacemos que el resutado solo tenga 2 decimales
                    monthlyIncome = +monthlyIncome.toFixed(2);
                    monthlyExpenses = +monthlyExpenses.toFixed(2);

                    // Retornamos un objeto con los datos del mes para el gráfico.
                    return {
                        month,
                        Income: monthlyIncome,
                        Expenses: monthlyExpenses,
                        hasData,
                    };
                });
                setChartData(incomeExpensesByMonth);
            }
        }
    }, [year]);

    return (
        <>
            <div className="annualReport__containerMain-chart">
                {chartData.some((data) => data.hasData) ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Income" fill="var(--color-orange-400)" />
                            <Bar dataKey="Expenses" fill="var(--color-orange-800)" />
                        </BarChart>
                    </ResponsiveContainer>) : (
                    <p>No data available for this year.</p>
                )}
            </div>
        </>
    );
}

export default AnnualChart;
