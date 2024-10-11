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
import { useTranslation } from 'react-i18next';

import { getMovementsByYear } from '../../../api/movements/getMovementsByYear';

import './HomeBalanceChart.scss'; // Importamos los estilos para el skeleton
import ChartLineIcon from '../../icons/CharLineIcon';

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

export default function HomeBalanceChart() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para controlar la carga
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            console.log('Iniciando la carga de datos'); // Log para verificar el inicio de carga
            setIsLoading(true);  // Se inicia el estado de carga
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                setIsLoading(false);
                return;
            }

            try {
                const currentYear = new Date().getFullYear().toString();
                const movements = await getMovementsByYear(token, currentYear);
                const lastSixMonthsData = getLastSixMonthsData(movements);
                setData(lastSixMonthsData);
                console.log('Datos cargados correctamente', lastSixMonthsData); // Log para verificar los datos
            } catch (error) {
                console.error('Error fetching movements:', error);
            } finally {
                setIsLoading(false); // Finaliza el estado de carga
                console.log('Carga finalizada'); // Log para verificar que la carga ha terminado
            }
        };

        fetchData();
    }, []);

    const getLastSixMonthsData = (movements: Movement[]): DataPoint[] => {
        const today = new Date();
        const months = [];
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            monthlyData[monthName] = { income: 0, expenses: 0 };
        }

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

        for (const [key, value] of Object.entries(monthlyData)) {
            months.push({
                name: key,
                income: parseFloat(value.income.toFixed(2)),
                expenses: parseFloat(value.expenses.toFixed(2)),
            });
        }

        return months;
    };

    const isDataEmpty = data.length === 0 || data.every(item => item.income === 0 && item.expenses === 0);

    return (
        <div className='home-balance-chart'>
            {isLoading ? (
                // Mostrar Skeleton mientras está cargando
                <div className="skeleton-chart-wrapper">
                    <div className="skeleton-chart"></div>
                </div>
            ) : isDataEmpty ? (
                // Si no hay datos, mostrar un ícono de marcador de posición
                <ChartLineIcon className='custom-icon' />
            ) : (
                // Mostrar la gráfica cuando hay datos
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
