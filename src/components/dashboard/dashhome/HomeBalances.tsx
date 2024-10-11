import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../../helpers/functions';

import './HomeBalances.scss';
import HomeBalancesSkeleton from './HomeBalancesSkeleton';

interface HomeBalancesProps {
    type: 'income' | 'expenses' | 'ebitda';
    amount: number | null;
    percentage: number | null;
}

export default function HomeBalances({ type, amount, percentage }: HomeBalancesProps) {
    const { t, i18n } = useTranslation();

    // If no data (amount or percentage), show the skeleton loader
    if (amount === null || percentage === null) {
        return <HomeBalancesSkeleton type={type} />;
    }

    // Determine if the percentage should be styled as positive or negative
    const isPositive = (type === 'income' && percentage >= 0) || (type !== 'income' && percentage < 0);

    // Translate balance type names based on the type of balance (income, expenses, or ebitda)
    const balanceName = {
        income: t('dashboard.dashhome.balances.earnings'),
        expenses: t('dashboard.dashhome.balances.spendings'),
        ebitda: t('dashboard.dashhome.balances.savings'),
    }[type];

    // Set the CSS class for the percentage based on whether it's positive or negative
    const percentageClass = isPositive ? 'positive' : 'negative';

    return (
        <div className={`balances-container ${type}`}>
            <div className='header-container'>
                <span>{balanceName}</span>
            </div>
            <div className='amount'>
                <span className='value'>{formatCurrency(amount, i18n.language)}</span>
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
