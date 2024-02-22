import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import dataMovementsJson from "../../data/dataMovements.json";

type Transaction = {
    date: string;
    category: string;
    description: string;
    amount: number;
    transactionId: string;
};

type DataMovementsFile = Transaction[];

const dataMovements: DataMovementsFile = dataMovementsJson as unknown as DataMovementsFile;

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
        if (!year || !month) return;

        const fullDate = `${year}-${month.toString().padStart(2, '0')}`;
        const transactionsForMonth = dataMovements.filter((t) => t.date.startsWith(fullDate));

        const income: { [key: string]: number } = {};
        const expenses: { [key: string]: number } = {};

        transactionsForMonth.forEach(({ category, amount }) => {
            if (amount >= 0) {
                income[category] = (income[category] || 0) + amount;
            } else {
                expenses[category] = (expenses[category] || 0) + Math.abs(amount);
            }
        });

        setDataCategoryIncome(Object.entries(income).map(([name, value]) => ({ name, value })));
        setDataCategoryExpenses(Object.entries(expenses).map(([name, value]) => ({ name, value })));
    }, [year, month]);

    const Colors = [
        "var(--color-orange-300)",
        "var(--color-orange)",
        "var(--color-orange-200)",
        "var(--color-orange-700)",
        "var(--color-orange-800)",
        "var(--color-orange-400)",
        "var(--color-orange-100)",
    ];

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
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={Colors[index % Colors.length]}
                                    />
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
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={Colors[index % Colors.length]}
                                    />
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
