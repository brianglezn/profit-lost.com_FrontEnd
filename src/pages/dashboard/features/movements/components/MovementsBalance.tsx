import React from 'react';

import { formatCurrency } from '../../../../../helpers/functions';
import { useUser } from '../../../../../context/useUser';

import DownloadIcon from '../../../../../components/icons/DownloadIcon';
import UploadIcon from '../../../../../components/icons/UploadIcon';
import PigCoinIcon from '../../../../../components/icons/PigCoinIcon';

import './MovementsBalance.scss';

interface MovementsBalanceProps {
    income: number;
    expenses: number;
}

const MovementsBalance: React.FC<MovementsBalanceProps> = ({ income, expenses }) => {
    const { user } = useUser();

    const formattedIncome = formatCurrency(income, user?.currency || 'USD');
    const formattedExpenses = formatCurrency(expenses, user?.currency || 'USD');
    const formattedBalance = formatCurrency(income - expenses, user?.currency || 'USD');

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
