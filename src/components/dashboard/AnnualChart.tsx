import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import dataMovementsFile from "../../data/dataMovements2.json";

type ChartDataItem = {
    month: string;
    Income: number;
    Expenses: number;
};

interface AnnualChartProps {
    year: string;
}

type AccumulatorType = {
    [key: string]: { Income: number; Expenses: number };
};


function AnnualChart({ year }: AnnualChartProps) {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    useEffect(() => {
        const processedData = dataMovementsFile
            .filter(transaction => new Date(transaction.date).getFullYear().toString() === year)
            .reduce((acc: AccumulatorType, { date, amount }) => {
                const month = new Date(date).getMonth(); // Obtener el índice del mes (0 para enero, 1 para febrero, etc.)
                const monthName = monthNames[month]; // Obtener el nombre completo del mes
                if (!acc[monthName]) {
                    acc[monthName] = { Income: 0, Expenses: 0 };
                }
                if (amount > 0) {
                    acc[monthName].Income += amount;
                } else {
                    acc[monthName].Expenses += Math.abs(amount);
                }
                return acc;
            }, {});

        const chartData = Object.entries(processedData).map(([month, { Income, Expenses }]) => ({
            month,
            Income: parseFloat(Income.toFixed(2)),
            Expenses: parseFloat(Expenses.toFixed(2)),
        }));

        setChartData(chartData);
    }, [year]);

    return (
        <div className="annualReport__containerMain-chart">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Income" fill="var(--color-orange-400)" />
                        <Bar dataKey="Expenses" fill="var(--color-orange-800)" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <span>No data available for {year}</span>
            )}
        </div>
    );
}

export default AnnualChart;

