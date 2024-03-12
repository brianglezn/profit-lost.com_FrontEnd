import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const incomeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-400').trim();
const expensesColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-800').trim();

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
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                data.forEach(movement => {
                    const month = monthNames[parseInt(movement.date.split("-")[1], 10) - 1];
                    if (!monthlyData[month]) {
                        monthlyData[month] = { Income: 0, Expenses: 0 };
                    }
                    if (movement.amount > 0) {
                        monthlyData[month].Income += movement.amount;
                    } else {
                        monthlyData[month].Expenses += Math.abs(movement.amount);
                    }
                });
                const formattedData: ChartDataItem[] = monthNames.map(month => ({
                    month,
                    Income: monthlyData[month] ? parseFloat(monthlyData[month].Income.toFixed(2)) : 0,
                    Expenses: monthlyData[month] ? parseFloat(monthlyData[month].Expenses.toFixed(2)) : 0
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
                        <Bar dataKey="Income" fill={incomeColor} />
                        <Bar dataKey="Expenses" fill={expensesColor} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <span>No data available for {year}</span>
            )}
        </div>
    );
}

export default AnnualChart;