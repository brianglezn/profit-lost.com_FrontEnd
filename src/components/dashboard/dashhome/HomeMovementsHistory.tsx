import { useTranslation } from 'react-i18next';

import { formatDateTime, formatCurrency } from '../../../helpers/functions';

import './HomeMovementsHistory.scss';
import HomeMovementsHistorySkeleton from '../../skeletons/dashhome/HomeMovementsHistorySkeleton';

type Transaction = {
    _id: string;
    description: string;
    amount: number;
    date: string;
};

interface MovementsHistoryHomeProps {
    data: Transaction[];
    isDataEmpty: boolean;
    isLoading: boolean;
}

export default function HomeMovementsHistory({ data, isDataEmpty, isLoading }: MovementsHistoryHomeProps) {
    const { i18n } = useTranslation();

    // Sort the data by date in descending order and limit to the latest 8 transactions
    const sortedData = data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

    // Render a skeleton loading state if data is loading or empty
    if (isLoading || isDataEmpty) {
        return <HomeMovementsHistorySkeleton />;
    }

    // Render the transaction list
    return (
        <div className='movements-history-home'>
            <ul>
                {sortedData.map((transaction) => (
                    <li key={transaction._id} className='movement-item'>
                        <div className='description-section'>
                            <div className='description'>{transaction.description}</div>
                            <div className='date'>{formatDateTime(transaction.date, i18n.language)}</div>
                        </div>
                        <div className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(transaction.amount, i18n.language)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
