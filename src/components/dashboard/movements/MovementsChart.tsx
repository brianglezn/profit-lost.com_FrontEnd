import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from 'react-i18next';

import { useMonthOptions } from '../../../helpers/functions';

import "./MovementsChart.scss";
import CustomBarShape from "../../CustomBarShape";
import ChartLineIcon from "../../icons/CharLineIcon";

interface MovementsProps {
    dataGraph: {
        month: string;
        year: number;
        Income: number;
        Expenses: number;
    }[];
    isDataEmpty: boolean;
}

function MovementsChart(props: MovementsProps) {
    const { t } = useTranslation();
    const { isDataEmpty, dataGraph } = props;

    const monthOptions = useMonthOptions();

    const translatedDataGraph = dataGraph.map(item => ({
        ...item,
        [t('dashboard.movements.movements_chart.income')]: item.Income,
        [t('dashboard.movements.movements_chart.expenses')]: item.Expenses,
    }));

    return (
        <>
            <div className="movements__chart">
                {isDataEmpty ? (
                    <ChartLineIcon className="custom-icon" />
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(value) => {
                                    const monthOption = monthOptions.find(option => option.value === value);
                                    return monthOption?.label || value;
                                }}
                            />
                            <YAxis />
                            <Tooltip
                                formatter={(value: number | string, name: string, props) => {
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
                                    const monthOption = monthOptions.find(option => option.value === value);
                                    return monthOption?.label || value;
                                }}
                            />
                            <Legend />
                            <Bar dataKey={t('dashboard.movements.movements_chart.income')} fill={"#ff8e38"} shape={<CustomBarShape />} />
                            <Bar dataKey={t('dashboard.movements.movements_chart.expenses')} fill={"#9d300f"} shape={<CustomBarShape />} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </>
    );
}

export default MovementsChart;
