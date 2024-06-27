import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getMovementsByYear } from "../../../api/movements/getMovementsByYear";
import { monthNames } from "../../../helpers/constants";

import "./AnnualChart.scss";
import CustomBarShape from "../../CustomBarShape";
import ChartLineIcon from "../../icons/CharLineIcon";

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
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            try {
                const data: Movement[] = await getMovementsByYear(token, year);
                const monthlyData: { [month: string]: { Income: number; Expenses: number } } = {};

                data.forEach(movement => {
                    const monthIndex = parseInt(movement.date.split("-")[1], 10) - 1;
                    const month = monthNames[monthIndex].value;
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
                    month: month.value,
                    Income: monthlyData[month.value] ? parseFloat(monthlyData[month.value].Income.toFixed(2)) : 0,
                    Expenses: monthlyData[month.value] ? parseFloat(monthlyData[month.value].Expenses.toFixed(2)) : 0
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [year]);

    return (
        <div className="annual__chart">
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
                        <Bar dataKey="Income" fill={"#ff8e38"} shape={<CustomBarShape />} />
                        <Bar dataKey="Expenses" fill={"#9d300f"} shape={<CustomBarShape />} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <ChartLineIcon className="custom-icon" />
            )}
        </div>
    );
}

export default AnnualChart;
