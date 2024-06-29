import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import "./MovementsPie.scss"
import ChartLineIcon from "../../icons/CharLineIcon";

interface MovementData {
    name: string;
    value: number;
}

interface Category {
    _id: string;
    name: string;
    color: string;
}

interface MovementsPieProps {
    data: MovementData[];
    categories: Category[];
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

const MovementsPie = ({ data, categories }: MovementsPieProps) => {

    const categoryColorMap = categories.reduce((acc, category) => {
        acc[category.name] = category.color;
        return acc;
    }, {} as { [key: string]: string });

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

    const isDataEmpty = data.length === 0;
    const roundedData = data.map(item => ({
        ...item,
        value: parseFloat(item.value.toFixed(2))
    }));

    return (
        <div className="movements__pie-category">
            {isDataEmpty ? (
                <ChartLineIcon className="custom-icon" />
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={roundedData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius="80%"
                            dataKey="value"
                        >
                            {roundedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={categoryColorMap[entry.name] || '#c84f03'}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default MovementsPie;

