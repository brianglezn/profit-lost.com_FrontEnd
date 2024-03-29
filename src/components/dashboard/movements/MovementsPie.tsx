import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface MovementData {
    name: string;
    value: number;
}

interface MovementsPieProps {
    incomeData: MovementData[];
    expensesData: MovementData[];
    isDataEmpty: boolean;
}

interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
}

const MovementsPie = ({ incomeData, expensesData, isDataEmpty }: MovementsPieProps) => {
    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        const colorVars = [
            '--primary-color-200',
            '--primary-color-300',
            '--primary-color-500',
            '--primary-color-900',
            '--primary-color-100',
            '--primary-color-600',
            '--primary-color-700',
            '--primary-color-800',
            '--primary-color-400',
        ];

        const fetchColors = () => {
            const root = document.documentElement;
            const newColors = colorVars.map(varName => getComputedStyle(root).getPropertyValue(varName).trim());
            setColors(newColors);
        };

        fetchColors();
    }, []);

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
                {isDataEmpty ? (
                    <span className="material-symbols-rounded no-select">
                        mobiledata_off
                    </span>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={incomeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="80%"
                                dataKey="value"
                            >
                                {incomeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
            <div className="movements__containerMain-category">
                {isDataEmpty ? (
                    <span className="material-symbols-rounded no-select">
                        mobiledata_off
                    </span>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expensesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius="80%"
                                dataKey="value"
                                nameKey="name"
                            >
                                {expensesData.map((_, index) => (
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
