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
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

        // Inicializar los últimos 6 meses con ingresos y gastos en 0
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            monthlyData[monthName] = { income: 0, expenses: 0 };
        }

        // Agrupar movimientos por mes
        movements.forEach((movement) => {
            const movementDate = new Date(movement.date);
            const monthName = movementDate.toLocaleString('default', { month: 'short' });

            if (monthlyData[monthName]) {  // Solo considerar los meses dentro de los últimos 6 meses
                if (movement.amount > 0) {
                    monthlyData[monthName].income += movement.amount;
                } else {
                    monthlyData[monthName].expenses += Math.abs(movement.amount);
                }
            }
        });

        // Convertir el objeto monthlyData en un array de objetos para el gráfico
        for (const [key, value] of Object.entries(monthlyData)) {
            months.push({
                name: key,
                income: parseFloat(value.income.toFixed(2)),
                expenses: parseFloat(value.expenses.toFixed(2)),
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
