import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDateTime, formatCurrency } from '../../../../../helpers/functions';
import { getUserByToken } from '../../../../../api/users/getUserByToken';
import { Movements, User } from '../../../../../helpers/types';

import HomeMovementsHistorySkeleton from './HomeMovementsHistorySkeleton';

import './HomeMovementsHistory.scss';

interface MovementsHistoryHomeProps {
    data: Movements[];
    isDataEmpty: boolean;
    isLoading: boolean;
}

export default function HomeMovementsHistory({ data, isDataEmpty, isLoading }: MovementsHistoryHomeProps) {
    const { i18n } = useTranslation();
    const [userCurrency, setUserCurrency] = useState<string>('USD');

    useEffect(() => {
        const fetchUserCurrency = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const user: User = await getUserByToken(token);
                setUserCurrency(user.currency || 'USD');
            } catch (error) {
                console.error('Error fetching user currency:', error);
            }
        };

        fetchUserCurrency();
    }, []);

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
                            {formatCurrency(transaction.amount, userCurrency)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
