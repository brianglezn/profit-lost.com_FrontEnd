import { useEffect, useState, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'primereact/skeleton';

import { getMovementsByYear } from '../../../../../api/movements/getMovementsByYear';
import { useMonthNames } from '../../../../../helpers/functions';
import { Movements } from '../../../../../helpers/types';

import CustomBarShape from '../../../../../components/CustomBarShape';

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
    const previousYear = useRef<string | null>(null);

    useEffect(() => {
        if (previousYear.current === year) {
            return;
        }

        previousYear.current = year;

        const fetchData = async () => {
            setIsDataLoaded(false);
            const token = localStorage.getItem('token');

            if (!token) {
                console.error(t('dashboard.common.error_token'));
                return;
            }

            try {
                const data: Movements[] = await getMovementsByYear(token, year);

                const monthlyData: { [month: string]: { Income: number; Expenses: number } } = {};

                data.forEach(movement => {
                    const monthIndex = parseInt(movement.date.split('-')[1], 10) - 1;
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
                setIsDataLoaded(true);
            } catch (error) {
                console.error(t('dashboard.common.error_movements_fetch'));
            }
        };

        fetchData();
    }, [year, t, monthNames]);

    const incomeKey = t('dashboard.annual_report.annual_chart.income');
    const expensesKey = t('dashboard.annual_report.annual_chart.expenses');

    return (
        <>
            {!isDataLoaded ? (
                <Skeleton width="100%" height="100%" borderRadius="8px" />
            ) : (
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='month' />
                        <YAxis />
                        <Tooltip formatter={(value, name, props) => {
                            const month = props.payload.month;
                            const label = name === incomeKey ? t('dashboard.annual_report.annual_chart.income', { month }) : t('dashboard.annual_report.annual_chart.expenses', { month });
                            return [value, label];
                        }} />
                        <Legend />
                        <Bar dataKey='Income' name={incomeKey} fill={'#ff8e38'} shape={<CustomBarShape />} />
                        <Bar dataKey='Expenses' name={expensesKey} fill={'#9d300f'} shape={<CustomBarShape />} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </>
    );
}
