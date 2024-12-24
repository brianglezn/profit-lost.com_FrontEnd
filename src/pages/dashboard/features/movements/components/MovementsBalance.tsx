import React, { useEffect, useState } from 'react';

import { formatCurrency2 } from '../../../../../helpers/functions';
import { getUserByToken } from '../../../../../api/users/getUserByToken';
import { User } from '../../../../../helpers/types';

import DownloadIcon from '../../../../../components/icons/DownloadIcon';
import UploadIcon from '../../../../../components/icons/UploadIcon';
import PigCoinIcon from '../../../../../components/icons/PigCoinIcon';

import './MovementsBalance.scss';

interface MovementsBalanceProps {
    income: number;
    expenses: number;
}

const MovementsBalance: React.FC<MovementsBalanceProps> = ({ income, expenses }) => {
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

    const formattedIncome = formatCurrency2(income, userCurrency);
    const formattedExpenses = formatCurrency2(expenses, userCurrency);
    const formattedBalance = formatCurrency2(income - expenses, userCurrency);

    return (
        <div className='movements__main-balance'>
            <div className='movements__balance income'>
                <DownloadIcon />
                <p>{formattedIncome}</p>
            </div>
            <div className='movements__balance expenses'>
                <UploadIcon />
                <p>-{formattedExpenses}</p>
            </div>
            <div className='movements__balance edbita'>
                <PigCoinIcon className={`no-select ${income - expenses < 0 ? 'negative' : 'positive'}`} />
                <p>{formattedBalance}</p>
            </div>
        </div>
    );
};

export default MovementsBalance;
