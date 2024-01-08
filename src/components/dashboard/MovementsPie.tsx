import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import dataMovementsJson from "../../data/dataMovements.json";

// Type definition for monthly transaction entries with category and amount
type MonthlyTransactionEntry = {
    Category: string;
    Amount: number;
};
// Type definition for the months of the year
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
// Object to map the number of the month to its corresponding name
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
// Type definition for the monthly transactions, which is an object with keys of type Months and values that are an array of MonthlyTransactionEntry
type MonthlyTransactions = {
    [key in Months]?: MonthlyTransactionEntry[];
};
// Type definition for the annual data object, where each year is a key pointing to an array of MonthlyTransactions
type YearData = {
    [year: string]: MonthlyTransactions[];
};
// The data file is an array of YearData
type DataMovementsFile = YearData[];
const dataMovementsFile: DataMovementsFile =
    dataMovementsJson as unknown as DataMovementsFile;
// Define a type for the object storing the accumulated income and expenses
type IncomeExpenses = {
    [category: string]: number;
};
// Define a type for the category and amount pairs for the income and expense statements
type CategoryAmountPair = {
    name: string;
    value: number;
};

// Component properties
interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

function MovementsPie(props: MovementsProps) {

    // Destructuring of properties for easier access
    const { year, month, isDataEmpty } = props;

    // Statements for income and expense categories with specific rates
    const [dataCategoryIncome, setDataCategoryIncome] = useState<CategoryAmountPair[]>([]);
    const [dataCategoryExpenses, setDataCategoryExpenses] = useState<CategoryAmountPair[]>([]);

    useEffect(() => {
        if (year && month) {
            // Search in dataMovementsFile for the object corresponding to the selected year.
            const yearDataWrapper = dataMovementsFile.find(
                (yearData) => Object.keys(yearData)[0] === year
            );

            if (yearDataWrapper) {
                // Access the MonthlyTransactions array for the selected year.
                const monthlyTransactionsArray = yearDataWrapper[year];

                // Assuming that there is only one MonthlyTransactions object per month in the array
                const transactionsForMonth = monthlyTransactionsArray.find(
                    (monthlyTransactions) => monthMapping[Number(month)] in monthlyTransactions
                );

                if (transactionsForMonth) {
                    // Access to transactions for the selected month
                    const transactions = transactionsForMonth[monthMapping[Number(month)]];

                    if (transactions) {
                        const income: IncomeExpenses = {};
                        const expenses: IncomeExpenses = {};

                        // Go through the transactions and classify between income and expenses.
                        transactions.forEach((transaction) => {
                            const category = transaction.Category;
                            const amount = transaction.Amount;

                            if (amount >= 0) {
                                income[category] = (income[category] || 0) + amount;
                            } else {
                                expenses[category] = (expenses[category] || 0) + Math.abs(amount);
                            }
                        });

                        // Transform accumulated objects into arrays for graphics
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
