import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../../../../helpers/functions';
import HomeBalancesSkeleton from './HomeBalancesSkeleton';
import { useUser } from '../../../../../context/useUser';

import './HomeBalances.scss';

interface HomeBalancesProps {
    type: 'income' | 'expenses' | 'ebitda';
    amount: number | null;
    percentage: number | null;
}

export default function HomeBalances({ type, amount, percentage }: HomeBalancesProps) {
    const { t } = useTranslation();
    const { user } = useUser();

    // If no data (amount or percentage), show the skeleton loader
    if (amount === null || percentage === null) {
        return <HomeBalancesSkeleton type={type} />;
    }

    // Translate balance type names based on the type of balance (income, expenses, or ebitda)
    const balanceName = {
        income: t('dashboard.dashhome.balances.earnings'),
        expenses: t('dashboard.dashhome.balances.spendings'),
        ebitda: t('dashboard.dashhome.balances.savings'),
    }[type];

    // Set CSS class based on custom logic for positive/negative appearance:
    const percentageClass = (() => {
        if (type === 'income') {
            return percentage >= 0 ? 'positive' : 'negative';
        } else if (type === 'expenses') {
            return percentage >= 0 ? 'negative' : 'positive';
        } else if (type === 'ebitda') {
            return percentage >= 0 ? 'positive' : 'negative';
        }
        return '';
    })();

    return (
        <div className={`balances-container ${type}`}>
            <div className='header-container'>
                <span>{balanceName}</span>
            </div>
            <div className='amount'>
                <span className='value'>{formatCurrency(amount, user?.currency || 'USD')}</span>
            </div>
            <div className='comparison'>
                <span className={`percentage ${percentageClass}`}>
                    {percentage.toFixed(1)}%
                </span>{' '}
                {t('dashboard.dashhome.balances.comparison')}
            </div>
        </div>
    );
}
