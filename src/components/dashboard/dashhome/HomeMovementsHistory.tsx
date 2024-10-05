import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../helpers/functions';

import './HomeMovementsHistory.scss';

type Transaction = {
    _id: string;
    description: string;
    amount: number;
    date: string;
};

interface MovementsHistoryHomeProps {
    data: Transaction[];
    isDataEmpty: boolean;
}

export default function HomeMovementsHistory({ data, isDataEmpty }: MovementsHistoryHomeProps) {
    const { i18n, t } = useTranslation();

    // Sort data by date in descending order and limit the result to 8 items
    const sortedData = data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

    return (
        <div className="movements-history-home">
            {isDataEmpty || sortedData.length === 0 ? (
                // If data is empty, display a message indicating no movements
                <p>{t('dashboard.movements.movements_table.no_movements')}</p>
            ) : (
                // Display a list of sorted transactions
                <ul>
                    {sortedData.map((transaction) => (
                        <li key={transaction._id} className="movement-item">
                            <div className="description-section">
                                {/* Display the description of the transaction */}
                                <div className="description">{transaction.description}</div>
                                {/* Format and display the date of the transaction */}
                                <div className="date">{formatDateTime(transaction.date, i18n.language)}</div>
                            </div>
                            {/* Display the transaction amount, with different styles for positive and negative values */}
                            <div className={`amount ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                                {transaction.amount.toFixed(2)} €
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
