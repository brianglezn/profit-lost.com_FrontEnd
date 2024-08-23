import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getMovementsByYear } from "../../../api/movements/getMovementsByYear";
import { monthNames } from "../../../helpers/constants";

interface DataPoint {
    name: string;
    income: number;
    expenses: number;
}

interface Movement {
    date: string;
    amount: number;
    type: string;
}

const HomeBalanceChart: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            try {
                const currentYear = new Date().getFullYear().toString();
                const movements = await getMovementsByYear(token, currentYear);

                const lastSixMonthsData = getLastSixMonthsData(movements);
                setData(lastSixMonthsData);
            } catch (error) {
                console.error("Error fetching movements:", error);
            }
        };

        fetchData();
    }, []);

    const getLastSixMonthsData = (movements: Movement[]): DataPoint[] => {
        const today = new Date();
        const months = [];
        const monthlyData: { [month: string]: { income: number; expenses: number } } = {};

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });

            monthlyData[monthName] = { income: 0, expenses: 0 };

            movements.forEach((movement) => {
                const movementDate = new Date(movement.date);
                const movementMonthName = monthNames[movementDate.getMonth()].value;

                if (movementMonthName === monthName && movementDate.getFullYear() === date.getFullYear()) {
                    if (movement.amount > 0) {
                        monthlyData[monthName].income += movement.amount;
                    } else {
                        monthlyData[monthName].expenses += Math.abs(movement.amount);
                    }
                }
            });

            months.push({
                name: monthName,
                income: monthlyData[monthName].income,
                expenses: monthlyData[monthName].expenses,
            });
        }

        return months;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 25,
                    right: 30,
                    left: 10,
                    bottom: 15,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#ff8e38"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#9d300f"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HomeBalanceChart;
