import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import "./MovementsPie.scss"

interface MovementData {
    name: string;
    value: number;
}

interface MovementsPieProps {
    data: MovementData[];
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

const MovementsPie = ({ data }: MovementsPieProps) => {

    const colorVars = [
        '#ffd5a8',
        '#ffb771',
        '#ef5107',
        '#7e2a10',
        '#ffecd4',
        '#c84f03',
        '#c63b08',
        '#fff7ed',
        '#9d300f',
        '#ff8e38',
    ];

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

    return (
        <div className="movements__pie-category">
            {isDataEmpty ? (
                <span className="material-symbols-rounded no-select">
                    mobiledata_off
                </span>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius="80%"
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colorVars[index % colorVars.length]} />
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
