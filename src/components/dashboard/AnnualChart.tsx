import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import dataMovementsFile from "../../data/dataMovements.json";
import { useEffect, useState } from "react";

// We define the types for the monthly transactions and the data structure.
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

    // State to store the chart data.
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    useEffect(() => {
        // We calculate the data for the graph when the year changes.
        const selectedYearData = dataMovementsFile.find(
            (y) => Object.keys(y)[0] === year.toString()
        ) as DataMovement | undefined;

        // If there is data for the selected year, we process it for the chart.
        if (selectedYearData && year.toString() in selectedYearData) {
            const monthlyDataArray = selectedYearData[year.toString()];

            if (Array.isArray(monthlyDataArray)) {
                const incomeExpensesByMonth = monthlyDataArray.map((monthEntry) => {
                    const [month, transactions] = Object.entries(monthEntry)[0];

                    let monthlyIncome = 0;
                    let monthlyExpenses = 0;
                    const hasData = transactions && transactions.length > 0;

                    // We add the income and subtract the expenses for each month.
                    if (Array.isArray(transactions)) {
                        transactions.forEach((transaction) => {
                            if (transaction.Amount > 0) {
                                monthlyIncome += transaction.Amount;
                            } else {
                                monthlyExpenses += Math.abs(transaction.Amount);
                            }
                        });
                    }

                    // We make the result only have 2 decimal places
                    monthlyIncome = +monthlyIncome.toFixed(2);
                    monthlyExpenses = +monthlyExpenses.toFixed(2);

                    // We return an object with the month's data for the chart.
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
                    <span className="material-symbols-rounded no-select">
                        mobiledata_off
                    </span>
                )}
            </div>
        </>
    );
}

export default AnnualChart;
