import { useEffect, useState, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

import { getMovementsByYear } from '../../../api/movements/getMovementsByYear';
import { useMonthNames } from '../../../helpers/functions';

import './AnnualChart.scss';
import CustomBarShape from '../../CustomBarShape';
import ChartLineIcon from '../../icons/CharLineIcon';
import AnnualChartSkeleton from './AnnualChartSkeleton';

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

export default function AnnualChart({ year }: { year: string }) {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const monthNames = useMonthNames();
    const { t } = useTranslation();
    const hasFetched = useRef(false);
    
    // Fetch data when the component mounts or when `year` changes
    useEffect(() => {
        const fetchData = async () => {
            console.log("Iniciando fetchData para el año:", year);

            const token = localStorage.getItem('token');
            if (!token) {
                console.error(t('dashboard.common.error_token'));
                return;
            }

            try {
                // Fetch movement data for the given year
                const data: Movement[] = await getMovementsByYear(token, year);
                console.log("Datos obtenidos del servidor:", data);

                const monthlyData: { [month: string]: { Income: number; Expenses: number } } = {};

                // Loop through each movement and aggregate data by month
                data.forEach(movement => {
                    const monthIndex = parseInt(movement.date.split('-')[1], 10) - 1; // Get the month index from the date string
                    const month = monthNames[monthIndex].value; // Get the month's short name
                    if (!monthlyData[month]) {
                        monthlyData[month] = { Income: 0, Expenses: 0 }; // Initialize if not already set
                    }
                    // Add income or expense to the corresponding month
                    if (movement.amount > 0) {
                        monthlyData[month].Income += movement.amount;
                    } else {
                        monthlyData[month].Expenses += Math.abs(movement.amount);
                    }
                });

                // Format the data to be compatible with the chart
                const formattedData: ChartDataItem[] = monthNames.map(month => ({
                    month: month.value,
                    Income: monthlyData[month.value] ? parseFloat(monthlyData[month.value].Income.toFixed(2)) : 0,
                    Expenses: monthlyData[month.value] ? parseFloat(monthlyData[month.value].Expenses.toFixed(2)) : 0
                }));

                console.log("Datos formateados para el gráfico:", formattedData);

                setChartData(formattedData); // Set the chart data state
                setIsDataLoaded(true); // Mark that data has been loaded
            } catch (error) {
                console.error(t('dashboard.common.error_movements_fetch'));
            }
        };

        if (!hasFetched.current) {
            fetchData(); // Solo realiza el fetch si no se ha hecho antes
            hasFetched.current = true; // Marca como que ya se ha hecho la petición
        }
    }, [year, t, monthNames]);

    const incomeKey = t('dashboard.annual_report.annual_chart.income'); // Translation key for income
    const expensesKey = t('dashboard.annual_report.annual_chart.expenses'); // Translation key for expenses

    // Check if all chart data values are zero to determine if the chart is empty
    const isChartDataEmpty = chartData.every(item => item.Income === 0 && item.Expenses === 0);

    // Renderizamos el Skeleton si los datos no están cargados
    if (!isDataLoaded) {
        return <AnnualChartSkeleton />;
    }

    return (
        <div className='annual__chart'>
            {isDataLoaded && isChartDataEmpty ? (
                // Show an icon if data is loaded but there is no data to display
                <ChartLineIcon className='custom-icon' />
            ) : (
                // Display the bar chart
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='month' />
                        <YAxis />
                        {/* Tooltip formatter to customize the tooltip text based on income/expense */}
                        <Tooltip formatter={(value, name, props) => {
                            const month = props.payload.month;
                            const label = name === incomeKey ? t('dashboard.annual_report.annual_chart.income', { month }) : t('dashboard.annual_report.annual_chart.expenses', { month });
                            return [value, label];
                        }} />
                        <Legend />
                        {/* Bars for Income and Expenses with customized color and shape */}
                        <Bar dataKey='Income' name={incomeKey} fill={'#ff8e38'} shape={<CustomBarShape />} />
                        <Bar dataKey='Expenses' name={expensesKey} fill={'#9d300f'} shape={<CustomBarShape />} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
