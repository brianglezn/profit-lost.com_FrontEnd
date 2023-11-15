import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import dataMovementsJson from "../../data/dataMovements.json";

// Definición de tipo para las entradas de transacciones mensuales con categoría y monto
type MonthlyTransactionEntry = {
    Category: string;
    Amount: number;
};
// Definición de tipo para los meses del año
type Months =
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec";
// Objeto para mapear el número del mes a su correspondiente nombre
const monthMapping: Record<number, Months> = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
};
// Definición de tipo para las transacciones mensuales, que es un objeto con claves de tipo Months y valores que son un arreglo de MonthlyTransactionEntry
type MonthlyTransactions = {
    [key in Months]?: MonthlyTransactionEntry[];
};
// Definición de tipo para el objeto de datos anuales, donde cada año es una clave que apunta a un arreglo de MonthlyTransactions
type YearData = {
    [year: string]: MonthlyTransactions[];
};
// El archivo de datos es un arreglo de YearData
type DataMovementsFile = YearData[];
const dataMovementsFile: DataMovementsFile =
    dataMovementsJson as unknown as DataMovementsFile;
// Definir un tipo para el objeto que almacena los ingresos y gastos acumulados
type IncomeExpenses = {
    [category: string]: number;
};
// Definir un tipo para los pares de categoría y cantidad para los estados de ingresos y gastos
type CategoryAmountPair = {
    name: string;
    value: number;
};

// Propiedades del componente
interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

function MovementsPie(props: MovementsProps) {

    // Desestructuración de las propiedades para un acceso más fácil
    const { year, month, isDataEmpty } = props;

    // Estados para las categorías de ingresos y gastos con tipos específicos
    const [dataCategoryIncome, setDataCategoryIncome] = useState<CategoryAmountPair[]>([]);
    const [dataCategoryExpenses, setDataCategoryExpenses] = useState<CategoryAmountPair[]>([]);

    useEffect(() => {
        if (year && month) {
            // Buscar en dataMovementsFile el objeto que corresponde al año seleccionado.
            const yearDataWrapper = dataMovementsFile.find(
                (yearData) => Object.keys(yearData)[0] === year
            );

            if (yearDataWrapper) {
                // Acceder al arreglo de MonthlyTransactions para el año seleccionado.
                const monthlyTransactionsArray = yearDataWrapper[year];

                // Suponiendo que hay un solo objeto MonthlyTransactions por mes en el arreglo
                const transactionsForMonth = monthlyTransactionsArray.find(
                    (monthlyTransactions) => monthMapping[Number(month)] in monthlyTransactions
                );

                if (transactionsForMonth) {
                    // Acceder a las transacciones para el mes seleccionado
                    const transactions = transactionsForMonth[monthMapping[Number(month)]];

                    if (transactions) {
                        const income: IncomeExpenses = {}; // Inicializar aquí
                        const expenses: IncomeExpenses = {}; // Inicializar aquí

                        // Recorrer las transacciones y clasificar entre ingresos y gastos
                        transactions.forEach((transaction) => {
                            const category = transaction.Category;
                            const amount = transaction.Amount;

                            if (amount >= 0) {
                                income[category] = (income[category] || 0) + amount;
                            } else {
                                expenses[category] = (expenses[category] || 0) + Math.abs(amount);
                            }
                        });

                        // Transformar los objetos acumulados en arrays para los gráficos
                        setDataCategoryIncome(
                            Object.entries(income).map(([name, value]) => ({ name, value }))
                        );
                        setDataCategoryExpenses(
                            Object.entries(expenses).map(([name, value]) => ({ name, value }))
                        );
                    }
                }
            }
        }
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
                    <p>No income data available for this month.</p>
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
                    </ResponsiveContainer>)}
            </div>
            <div className="movements__containerMain-category">
                {isDataEmpty || dataCategoryExpenses.length === 0 ? (
                    <p>No expenses data available for this month.</p>
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
                    </ResponsiveContainer>)}
            </div>
        </>
    );
}

export default MovementsPie;
