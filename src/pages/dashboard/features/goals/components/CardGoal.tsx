import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

import type { Goal } from '../../../../../helpers/types';
import './CardGoal.scss';

interface CardGoalProps {
    goal: Goal;
    onClick: () => void;
}

export default function CardGoal({ goal, onClick }: CardGoalProps) {
    // Function to calculate the progress of the goal
    const calculateProgress = (current: number, target: number): number => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    // Function to determine the status of the goal based on progress and deadline
    const calculateGoalStatus = (progress: number, deadline?: string): 'In progress' | 'Almost done' | 'Done' | 'Overdue' => {
        if (progress >= 100) return 'Done';
        
        if (deadline) {
            const today = new Date();
            const deadlineDate = new Date(deadline);
            
            if (today > deadlineDate && progress < 100) {
                return 'Overdue';
            }

            const timeLeft = deadlineDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

            if (progress >= 80 || (daysLeft <= 30 && progress >= 60)) {
                return 'Almost done';
            }
        } else {
            if (progress >= 80) {
                return 'Almost done';
            }
        }
        
        return 'In progress';
    };

    const getStatusSeverity = (status: 'In progress' | 'Almost done' | 'Done' | 'Overdue'): 'success' | 'info' | 'warning' | 'danger' => {
        switch (status) {
            case 'In progress':
                return 'info';
            case 'Almost done':
                return 'warning';
            case 'Done':
                return 'success';
            case 'Overdue':
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
                        <span className='amount'>{goal.currentAmount}€</span>
                        <span className='target'>of {goal.targetAmount}€</span>
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
                            value={status}
                            severity={getStatusSeverity(status)}
                            rounded
                        />
                    </div>
                    {goal.deadline && (
                        <div className={`deadline-container ${status === 'Overdue' ? 'overdue' : ''}`}>
                            <i className="pi pi-calendar"></i>
                            <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 