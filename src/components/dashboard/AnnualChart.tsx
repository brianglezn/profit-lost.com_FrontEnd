import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

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
            .then((data: ChartDataItem[]) => {
                setChartData(data);
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