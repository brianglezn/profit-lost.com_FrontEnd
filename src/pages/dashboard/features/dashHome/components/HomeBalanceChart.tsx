import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Skeleton } from 'primereact/skeleton';
import { useTranslation } from 'react-i18next';

import { Movements } from '../../../../../helpers/types';

import './HomeBalanceChart.scss';

interface DataPoint {
    name: string;
    income: number;
    expenses: number;
}

interface HomeBalanceChartProps {
    movements: Movements[];
    isLoading: boolean;
}

export default function HomeBalanceChart({ movements, isLoading }: HomeBalanceChartProps) {
    const [data, setData] = useState<DataPoint[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (!movements.length) return;
        
        const lastSixMonthsData = getLastSixMonthsData(movements);
        setData(lastSixMonthsData);
    }, [movements]);

    const getLastSixMonthsData = (movements: Movements[]): DataPoint[] => {
        const today = new Date();
        const months: DataPoint[] = [];
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

        // Generar los últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            monthlyData[monthName] = { income: 0, expenses: 0 };
        }

        // Procesar movimientos
        movements.forEach((movement) => {
            const movementDate = new Date(movement.date);
            const monthName = movementDate.toLocaleString('default', { month: 'short' });
            
            if (monthlyData[monthName]) {
                if (movement.amount > 0) {
                    monthlyData[monthName].income += movement.amount;
                } else {
                    monthlyData[monthName].expenses += Math.abs(movement.amount);
                }
            }
        });

        // Convertir a array manteniendo el orden correcto
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            months.push({
                name: monthName,
                income: parseFloat(monthlyData[monthName].income.toFixed(2)),
                expenses: parseFloat(monthlyData[monthName].expenses.toFixed(2)),
            });
        }

        return months;
    };

    const isDataEmpty = data.length === 0 || data.every(item => item.income === 0 && item.expenses === 0);

    return (
        <div className='home-balance-chart'>
            {isLoading || isDataEmpty ? (
                <Skeleton width="100%" height="300px" borderRadius="8px" />
            ) : (
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 25,
                            right: 30,
                            left: 10,
                            bottom: 15,
                        }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='income'
                            name={t('dashboard.dashhome.balances.earnings')}
                            stroke='#ff8e38'
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type='monotone'
                            dataKey='expenses'
                            name={t('dashboard.dashhome.balances.spendings')}
                            stroke='#9d300f'
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
