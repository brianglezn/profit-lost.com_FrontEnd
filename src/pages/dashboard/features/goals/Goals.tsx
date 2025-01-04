import { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

import type { Goal } from '../../../../helpers/types';
import './Goals.scss';

export default function Goals() {
    // Datos de ejemplo actualizados
    const exampleGoals: Goal[] = [
        {
            id: '1',
            name: 'Save for a Car',
            type: 'Saving',
            targetAmount: 20000,
            currentAmount: 5000,
            deadline: '2025-12-31T23:59:59.999Z'
        },
        {
            id: '2',
            name: 'Reduce Food Expenses',
            type: 'Reduction of expenses',
            targetAmount: 400,
            currentAmount: 350,
            deadline: '2024-06-30T23:59:59.999Z'
        },
        {
            id: '3',
            name: 'Emergency Fund',
            type: 'Saving',
            targetAmount: 10000,
            currentAmount: 1000
            // Sin deadline
        },
        {
            id: '4',
            name: 'Investment Portfolio',
            type: 'Investment',
            targetAmount: 50000,
            currentAmount: 15000
            // Sin deadline
        }
    ];

    const [goals, setGoals] = useState<Goal[]>(exampleGoals);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    // Función para calcular el progreso de la meta
    const calculateProgress = (current: number, target: number): number => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    // Función para determinar el estado de la meta basado en progreso y fecha (si existe)
    const calculateGoalStatus = (progress: number, deadline?: string): 'In progress' | 'Almost done' | 'Done' => {
        if (progress >= 100) return 'Done';
        
        if (deadline) {
            const today = new Date();
            const deadlineDate = new Date(deadline);
            const timeLeft = deadlineDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

            if (daysLeft <= 30 && progress >= 80) return 'Almost done';
        } else {
            // Para metas sin deadline, consideramos "Almost done" si está cerca de completarse
            if (progress >= 80) return 'Almost done';
        }
        
        return 'In progress';
    };

    const getSeverity = (type: Goal['type']): 'success' | 'info' | 'warning' | 'danger' => {
        switch (type) {
            case 'Saving':
                return 'info';
            case 'Reduction of expenses':
                return 'danger';
            case 'Debt':
                return 'warning';
            case 'Investment':
                return 'success';
            default:
                return 'info';
        }
    };

    const getStatusSeverity = (status: 'In progress' | 'Almost done' | 'Done'): 'success' | 'info' | 'warning' => {
        switch (status) {
            case 'In progress':
                return 'info';
            case 'Almost done':
                return 'warning';
            case 'Done':
                return 'success';
            default:
                return 'info';
        }
    };

    const cardTemplate = (goal: Goal) => {
        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
        const status = calculateGoalStatus(progress, goal.deadline);

        return (
            <div className='goal-card__content'>
                <div className='goal-card__header'>
                    <h3>{goal.name}</h3>
                    <Tag
                        value={goal.type}
                        severity={getSeverity(goal.type)}
                        rounded
                    />
                </div>

                <div className='goal-card__progress'>
                    <ProgressBar
                        value={progress}
                        showValue={false}
                    />
                    <span className='progress-text'>
                        {progress}%
                    </span>
                </div>

                <div className='goal-card__amounts'>
                    <span className='current'>
                        <i className="pi pi-wallet"></i>
                        Current: {goal.currentAmount}€
                    </span>
                    <span className='target'>
                        <i className="pi pi-flag"></i>
                        Target: {goal.targetAmount}€
                    </span>
                </div>

                <div className='goal-card__footer'>
                    <span className='deadline'>
                        <i className="pi pi-calendar"></i>
                        {goal.deadline 
                            ? new Date(goal.deadline).toLocaleDateString()
                            : 'No deadline'
                        }
                    </span>
                    <Tag
                        value={status}
                        severity={getStatusSeverity(status)}
                        rounded
                    />
                </div>
            </div>
        );
    };

    return (
        <section className='goals'>
            <div className='goals__header'>
                <h2>Financial Goals</h2>
                <Button
                    label="Add Goal"
                    onClick={() => setIsAddGoalOpen(true)}
                />
            </div>

            <div className='goals__content'>
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className='goal-card'
                        onClick={() => setSelectedGoal(goal)}
                    >
                        {cardTemplate(goal)}
                    </div>
                ))}
            </div>

            <Sidebar
                visible={isAddGoalOpen || !!selectedGoal}
                onHide={() => {
                    setIsAddGoalOpen(false);
                    setSelectedGoal(null);
                }}
                position='right'
                style={{ width: '500px' }}
                className='custom_sidebar'
            >
                {/* Aquí irá el formulario de metas */}
            </Sidebar>
        </section>
    );
} 