import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import './MovementsPie.scss'
import ChartLineIcon from '../../icons/CharLineIcon';

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

export default function MovementsPie({ data, categories }: MovementsPieProps) {
    // Create a mapping from category names to their respective colors
    const categoryColorMap = categories.reduce((acc, category) => {
        acc[category.name] = category.color;
        return acc;
    }, {} as { [key: string]: string });

    // Function to render custom labels on each pie slice
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        name,
    }: LabelProps) => {
        const RADIAN = Math.PI / 180; // Convert degrees to radians
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Calculate label radius between inner and outer radius
        const x = cx + radius * Math.cos(-midAngle * RADIAN); // Calculate x coordinate for label
        const y = cy + radius * Math.sin(-midAngle * RADIAN); // Calculate y coordinate for label

        return (
            <text
                x={x}
                y={y}
                fill='none'
                textAnchor={x > cx ? 'start' : 'end'} // Align label depending on position relative to center
                dominantBaseline='central'
            >
                {name} ({(percent * 100).toFixed(0)}%)
            </text>
        );
    };

    // Check if data is empty
    const isDataEmpty = data.length === 0;

    // Round data values to 2 decimal places
    const roundedData = data.map(item => ({
        ...item,
        value: parseFloat(item.value.toFixed(2))
    }));

    return (
        <div className='movements__pie-category'>
            {isDataEmpty ? (
                // Show an icon if there is no data
                <ChartLineIcon className='custom-icon' />
            ) : (
                // Responsive container to handle resizing
                <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                        {/* Define the pie chart with customized labels */}
                        <Pie
                            data={roundedData}
                            cx='50%'
                            cy='50%'
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius='80%'
                            dataKey='value'
                        >
                            {roundedData.map((entry, index) => (
                                // Render each cell with the respective color from categoryColorMap
                                <Cell
                                    key={`cell-${index}`}
                                    fill={categoryColorMap[entry.name] || '#c84f03'}
                                />
                            ))}
                        </Pie>
                        <Tooltip /> {/* Add tooltip for displaying information on hover */}
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}