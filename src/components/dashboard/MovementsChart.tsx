import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Definición de la interfaz para las propiedades que recibe el componente
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

    // Desestructuración de las propiedades recibidas
    const { isDataEmpty, dataGraph } = props;

    return (
        <>
            <div className="movements__containerMain-chart">
                {isDataEmpty ? (
                    <p>No data available for this month.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            width={500}
                            height={300}
                            data={dataGraph}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Income" fill="var(--color-orange-400)" />
                            <Bar dataKey="Expenses" fill="var(--color-orange-800)" />
                        </BarChart>
                    </ResponsiveContainer>)}
            </div>
        </>
    );
}

export default MovementsChart;