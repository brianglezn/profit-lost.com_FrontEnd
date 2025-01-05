import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'primereact/skeleton';

import { useMonthOptions } from '../../../../../helpers/functions';

import CustomBarShape from '../../../../../components/CustomBarShape';

import './MovementsChart.scss';

interface MovementsProps {
    dataGraph: {
        month: string;
        year: number;
        Income: number;
        Expenses: number;
    }[];
    isDataEmpty: boolean;
}

export default function MovementsChart(props: MovementsProps) {
    const { isDataEmpty, dataGraph } = props;

    const { t } = useTranslation();

    // Get translated month options (used for chart X-axis and tooltips)
    const monthOptions = useMonthOptions();

    // Translate income and expense keys to the user's current language
    const translatedDataGraph = dataGraph.map(item => ({
        ...item,
        [t('dashboard.movements.movements_chart.income')]: item.Income,
        [t('dashboard.movements.movements_chart.expenses')]: item.Expenses,
    }));

    return (
        <div className='movements__chart'>
            {isDataEmpty && dataGraph.length === 0 ? (
                <Skeleton width="100%" height="100%" borderRadius="8px" />
            ) : (
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={translatedDataGraph}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />

                        <XAxis
                            dataKey='month'
                            tickFormatter={(value) => {
                                // Find the month label based on the month value
                                const monthOption = monthOptions.find(option => option.value === value);
                                return monthOption?.label || value;
                            }}
                        />

                        <YAxis />

                        <Tooltip
                            formatter={(value: number | string, name: string, props) => {
                                // Custom tooltip formatting to include translated labels for income and expenses
                                if (props.payload && props.payload.length > 0) {
                                    const firstPayload = props.payload[0];
                                    const monthOption = monthOptions.find(option => option.value === firstPayload.month);
                                    const monthName = monthOption?.label || firstPayload.month;

                                    const label = name === t('dashboard.movements.movements_chart.income')
                                        ? t('dashboard.movements.movements_chart.income', { month: monthName })
                                        : t('dashboard.movements.movements_chart.expenses', { month: monthName });

                                    return [value, label];
                                }
                                return [value, name];
                            }}
                            labelFormatter={(value) => {
                                // Format the tooltip label for months
                                const monthOption = monthOptions.find(option => option.value === value);
                                return monthOption?.label || value;
                            }}
                        />

                        <Legend />

                        <Bar dataKey={t('dashboard.movements.movements_chart.income')} fill={'#ff8e38'} shape={<CustomBarShape />} />

                        <Bar dataKey={t('dashboard.movements.movements_chart.expenses')} fill={'#9d300f'} shape={<CustomBarShape />} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}