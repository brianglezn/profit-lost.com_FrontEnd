import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

interface Movement {
    date: string;
    description: string;
    amount: number;
    category: string;
}

interface ChartDataItem {
    month: string;
    Income: number;
    Expenses: number;
}

function AnnualChart({ year }: { year: string }) {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        const apiUrl = `https://profit-lost-backend.onrender.com/movements/${year}`;
        const token = localStorage.getItem('token');

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Movement[]) => {
                const monthlyData: { [month: string]: { Income: number; Expenses: number } } = {};
                data.forEach(movement => {
                    const month = movement.date.split("-")[1];
                    if (!monthlyData[month]) {
                        monthlyData[month] = { Income: 0, Expenses: 0 };
                    }
                    if (movement.amount > 0) {
                        monthlyData[month].Income += movement.amount;
                    } else {
                        monthlyData[month].Expenses += Math.abs(movement.amount);
                    }
                });
                const formattedData: ChartDataItem[] = Object.keys(monthlyData).map(month => ({
                    month,
                    Income: monthlyData[month].Income,
                    Expenses: monthlyData[month].Expenses
                }));
                setChartData(formattedData);
            })
            .catch(error => console.error("Error fetching data:", error));
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