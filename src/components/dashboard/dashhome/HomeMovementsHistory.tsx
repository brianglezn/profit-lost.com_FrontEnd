import { useTranslation } from 'react-i18next'; // Importamos el hook de i18n
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

function HomeMovementsHistory({ data, isDataEmpty }: MovementsHistoryHomeProps) {
    const { i18n, t } = useTranslation();

    const sortedData = data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

    return (
        <div className="movements-history-home">
            {isDataEmpty || sortedData.length === 0 ? (
                <p>{t('dashboard.movements.movements_table.no_movements')}</p>
            ) : (
                <ul>
                    {sortedData.map((transaction) => (
                        <li key={transaction._id} className="movement-item">
                            <div className="description-section">
                                <div className="description">{transaction.description}</div>
                                <div className="date">{formatDateTime(transaction.date, i18n.language)}</div>
                            </div>
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

export default HomeMovementsHistory;
