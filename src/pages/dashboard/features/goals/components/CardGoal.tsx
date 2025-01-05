import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../../context/useUser';
import { formatCurrency, formatDateTime } from '../../../../../helpers/functions';
import type { Goal } from '../../../../../helpers/types';

import './CardGoal.scss';

interface CardGoalProps {
    goal: Goal;
    onClick: () => void;
}

type GoalStatus = 'in_progress' | 'almost_done' | 'done' | 'overdue';

export default function CardGoal({ goal, onClick }: CardGoalProps) {
    const { t } = useTranslation();
    const { user } = useUser();

    const calculateProgress = (current: number, target: number): number => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    const calculateGoalStatus = (progress: number, deadline?: string): GoalStatus => {
        if (progress >= 100) return 'done';

        if (deadline) {
            const today = new Date();
            const deadlineDate = new Date(deadline);

            if (today > deadlineDate && progress < 100) {
                return 'overdue';
            }

            const timeLeft = deadlineDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

            if (progress >= 80 || (daysLeft <= 30 && progress >= 60)) {
                return 'almost_done';
            }
        } else {
            if (progress >= 80) {
                return 'almost_done';
            }
        }

        return 'in_progress';
    };

    const getStatusSeverity = (status: GoalStatus): 'success' | 'info' | 'warning' | 'danger' => {
        switch (status) {
            case 'in_progress':
                return 'info';
            case 'almost_done':
                return 'warning';
            case 'done':
                return 'success';
            case 'overdue':
                return 'danger';
            default:
                return 'info';
        }
    };

    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const status = calculateGoalStatus(progress, goal.deadline);

    return (
        <div className='goal-card' onClick={onClick}>
            <div className='goal-card__content'>
                <div className='goal-card__header'>
                    <h3>{goal.name}</h3>
                    <span>{goal.type}</span>
                </div>

                <div className='goal-card__progress-container'>
                    <div className='progress-info'>
                        <span className='amount'>{formatCurrency(goal.currentAmount, user?.currency)}</span>
                        <span className='target'>of {formatCurrency(goal.targetAmount, user?.currency)}</span>
                    </div>
                    <ProgressBar
                        value={progress}
                        showValue={false}
                    />
                    <div className='progress-percentage'>
                        {progress}%
                    </div>
                </div>

                <div className='goal-card__footer'>
                    <div className='status-container'>
                        <Tag
                            value={t(`dashboard.goals.status.${status}`)}
                            severity={getStatusSeverity(status)}
                            rounded
                        />
                    </div>
                    {goal.deadline && (
                        <div className={`deadline-container ${status === 'overdue' ? 'overdue' : ''}`}>
                            <i className="pi pi-calendar"></i>
                            <span>
                                {formatDateTime(
                                    goal.deadline,
                                    user?.language || 'en',
                                    user?.dateFormat || 'MM/DD/YYYY'
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 