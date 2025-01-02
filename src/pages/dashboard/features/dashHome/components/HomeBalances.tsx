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

interface BalanceConfig {
    translationKey: string;
    getPercentageClass: (value: number) => string;
}

export default function HomeBalances({ type, amount, percentage }: HomeBalancesProps) {
    const { t } = useTranslation();
    const { user } = useUser();

    // If there is no data, show skeleton loader
    if (amount === null || percentage === null) {
        return <HomeBalancesSkeleton type={type} />;
    }

    // Configuration for each type of balance
    const balanceConfigs: Record<HomeBalancesProps['type'], BalanceConfig> = {
        income: {
            translationKey: 'dashboard.dashhome.balances.earnings',
            getPercentageClass: (value) => value >= 0 ? 'positive' : 'negative'
        },
        expenses: {
            translationKey: 'dashboard.dashhome.balances.spendings',
            getPercentageClass: (value) => value >= 0 ? 'negative' : 'positive'
        },
        ebitda: {
            translationKey: 'dashboard.dashhome.balances.savings',
            getPercentageClass: (value) => value >= 0 ? 'positive' : 'negative'
        }
    };

    const config = balanceConfigs[type];
    const percentageClass = config.getPercentageClass(percentage);

    return (
        <div className={`balances-container ${type}`}>
            <div className='header-container'>
                <span>{t(config.translationKey)}</span>
            </div>
            <div className='amount'>
                <span className='value'>
                    {formatCurrency(amount, user?.currency || 'USD')}
                </span>
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
