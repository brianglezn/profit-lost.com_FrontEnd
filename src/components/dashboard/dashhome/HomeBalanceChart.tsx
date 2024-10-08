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
    const { t } = useTranslation();

    // Fetch movements data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            try {
                const currentYear = new Date().getFullYear().toString();
                // Fetch movements for the current year
                const movements = await getMovementsByYear(token, currentYear);

                // Get data for the last six months from the fetched movements
                const lastSixMonthsData = getLastSixMonthsData(movements);
                setData(lastSixMonthsData);

            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        };

        fetchData();
    }, []);

    // Function to get data for the last six months
    const getLastSixMonthsData = (movements: Movement[]): DataPoint[] => {
        const today = new Date();
        const months = [];
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

        // Create an object for the last six months with initial income and expenses set to 0
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            monthlyData[monthName] = { income: 0, expenses: 0 };
        }

        // Iterate over each movement and add the amount to the respective month
        movements.forEach((movement) => {
            const movementDate = new Date(movement.date);
            const monthName = movementDate.toLocaleString('default', { month: 'short' });

            if (monthlyData[monthName]) {
                if (movement.amount > 0) {
                    // Add to income if amount is positive
                    monthlyData[monthName].income += movement.amount;
                } else {
                    // Add to expenses if amount is negative
                    monthlyData[monthName].expenses += Math.abs(movement.amount);
                }
            }
        });

        // Convert the monthlyData object into an array of DataPoint objects for the chart
        for (const [key, value] of Object.entries(monthlyData)) {
            months.push({
                name: key,
                income: parseFloat(value.income.toFixed(2)),
                expenses: parseFloat(value.expenses.toFixed(2)),
            });
        }

        return months;
    };

    // Check if the data is empty or all income and expenses are 0
    const isDataEmpty = data.length === 0 || data.every(item => item.income === 0 && item.expenses === 0);

    return (
        <div className='home-balance-chart'>
            {isDataEmpty ? (
                // If there is no data, display a placeholder icon
                <ChartLineIcon className='custom-icon' />
            ) : (
                // Display the LineChart if there is data
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
                        {/* Line for income values */}
                        <Line
                            type='monotone'
                            dataKey='income'
                            name={t('dashboard.dashhome.balances.earnings')}
                            stroke='#ff8e38'
                            activeDot={{ r: 8 }}
                        />
                        {/* Line for expenses values */}
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