import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Transaction = {
    date: string;
    category: string;
    description: string;
    amount: number;
};

type CategoryAmountPair = {
    name: string;
    value: number;
};

interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

function MovementsPie({ year, month, isDataEmpty }: MovementsProps) {
    const [dataCategoryIncome, setDataCategoryIncome] = useState<CategoryAmountPair[]>([]);
    const [dataCategoryExpenses, setDataCategoryExpenses] = useState<CategoryAmountPair[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}/${month}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                const transactions: Transaction[] = await response.json();

                const income: { [key: string]: number } = {};
                const expenses: { [key: string]: number } = {};

                transactions.forEach(({ category, amount }) => {
                    if (amount > 0) {
                        income[category] = (income[category] || 0) + amount;
                    } else {
                        expenses[category] = (expenses[category] || 0) + Math.abs(amount);
                    }
                });

                setDataCategoryIncome(Object.entries(income).map(([name, value]) => ({
                    name,
                    value: parseFloat(value.toFixed(2))
                })));

                setDataCategoryExpenses(Object.entries(expenses).map(([name, value]) => ({
                    name,
                    value: parseFloat(value.toFixed(2))
                })));

            } catch (error) {
                console.error('Error fetching transactions data:', error);
            }
        };

        fetchData();
    }, [year, month]);

    interface LabelProps {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        name: string;
    }
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        name,
    }: LabelProps) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="none"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {name} ({(percent * 100).toFixed(0)}%)
            </text>
        );
    };

    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        // Función para obtener el color de las variables CSS
        const getColor = (colorVar: string) => getComputedStyle(document.documentElement).getPropertyValue(colorVar);

        // Define tus variables de color aquí y asegúrate de que coincidan con las definidas en tu CSS
        const colorVars = [
            '--primary-color-500',
            '--primary-color-700',
            '--primary-color-300',
            '--primary-color-900',
            '--primary-color-100',
            '--primary-color-600',
            '--primary-color-200',
            '--primary-color-800',
            '--primary-color-400',
            '--primary-color-950',
        ];

        // Mapea las variables de color a sus valores reales
        const mappedColors = colorVars.map(colorVar => getColor(colorVar).trim());

        setColors(mappedColors);
    }, []);

    return (
        <>
            <div className="movements__containerMain-category">
                {isDataEmpty || dataCategoryIncome.length === 0 ? (
                    <span className="material-symbols-rounded no-select">
                        mobiledata_off
                    </span>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={dataCategoryIncome}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="80%"
                                dataKey="value"
                            >
                                {dataCategoryIncome.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
            <div className="movements__containerMain-category">
                {isDataEmpty || dataCategoryExpenses.length === 0 ? (
                    <span className="material-symbols-rounded no-select">
                        mobiledata_off
                    </span>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={dataCategoryExpenses}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="80%"
                                dataKey="value"
                            >
                                {dataCategoryExpenses.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </>
    );
}

export default MovementsPie;
