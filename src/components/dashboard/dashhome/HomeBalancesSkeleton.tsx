import { useTranslation } from 'react-i18next';
import './HomeBalancesSkeleton.scss';

interface HomeBalancesSkeletonProps {
    type: 'income' | 'expenses' | 'ebitda';
}

export default function HomeBalancesSkeleton({ type }: HomeBalancesSkeletonProps) {
    const { t } = useTranslation();

    const balanceName = {
        income: t('dashboard.dashhome.balances.earnings'),
        expenses: t('dashboard.dashhome.balances.spendings'),
        ebitda: t('dashboard.dashhome.balances.savings'),
    }[type];

    return (
        <div className='balances-container-skeleton'>
            <div className='header-skeleton header-container'>{balanceName}</div>
            <div className='amount-skeleton'></div>
            <div className='comparison-skeleton'>
                <div className='percentage-skeleton'></div>
            </div>
        </div>
    );
}
