import { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useTranslation } from 'react-i18next';

import type { Goal } from '../../../../helpers/types';

import CardGoal from './components/CardGoal';
import FormGoals from './components/FormGoals';

import './Goals.scss';

export default function Goals() {
    const { t } = useTranslation();
    const exampleGoals: Goal[] = [
        {
            id: '1',
            name: 'Save for a Car',
            type: 'Saving',
            targetAmount: 20000,
            currentAmount: 20000,
            deadline: '2025-12-31T23:59:59.999Z',
            history: [
                {
                    date: '2024-01-15T10:00:00.000Z',
                    amount: 5000
                },
                {
                    date: '2024-02-15T10:00:00.000Z',
                    amount: 5000
                },
                {
                    date: '2024-03-15T10:00:00.000Z',
                    amount: 10000
                }
            ]
        },
        {
            id: '2',
            name: 'Reduce Food Expenses',
            type: 'Reduction of expenses',
            targetAmount: 400,
            currentAmount: 350,
            deadline: '2024-06-30T23:59:59.999Z',
            history: [
                {
                    date: '2024-01-01T10:00:00.000Z',
                    amount: 50
                },
                {
                    date: '2024-02-01T10:00:00.000Z',
                    amount: 100
                },
                {
                    date: '2024-03-01T10:00:00.000Z',
                    amount: 50
                }
            ]
        },
        {
            id: '3',
            name: 'Emergency Fund',
            type: 'Saving',
            targetAmount: 10000,
            currentAmount: 1000,
            history: [
                {
                    date: '2024-01-01T10:00:00.000Z',
                    amount: 500
                },
                {
                    date: '2024-02-01T10:00:00.000Z',
                    amount: 500
                }
            ]
        },
        {
            id: '4',
            name: 'Investment Portfolio',
            type: 'Investment',
            targetAmount: 50000,
            currentAmount: 15000,
            deadline: '2025-12-30T23:59:59.999Z',
            history: [
                {
                    date: '2024-01-15T10:00:00.000Z',
                    amount: 5000
                },
                {
                    date: '2024-02-15T10:00:00.000Z',
                    amount: 5000
                },
                {
                    date: '2024-03-15T10:00:00.000Z',
                    amount: 5000
                }
            ]
        },
        {
            id: '5',
            name: 'Reduce Car Expenses',
            type: 'Reduction of expenses',
            targetAmount: 500,
            currentAmount: 450,
            deadline: '2025-06-30T23:59:59.999Z',
            history: [
                {
                    date: '2024-01-01T10:00:00.000Z',
                    amount: 50
                },
                {
                    date: '2024-02-01T10:00:00.000Z',
                    amount: 50
                },
                {
                    date: '2024-03-01T10:00:00.000Z',
                    amount: 350
                }
            ]
        }
    ];

    const [goals, setGoals] = useState<Goal[]>(exampleGoals);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    const handleSubmit = (goalData: Omit<Goal, 'id'>) => {
        if (selectedGoal) {
            // Actualizar meta existente
            setGoals(goals.map(goal => 
                goal.id === selectedGoal.id 
                    ? { ...goalData, id: goal.id }
                    : goal
            ));
        } else {
            // Crear nueva meta
            const newGoal: Goal = {
                ...goalData,
                id: Date.now().toString() // Temporal, en producción usaríamos un UUID
            };
            setGoals([...goals, newGoal]);
        }
        handleClose();
    };

    const handleClose = () => {
        setIsAddGoalOpen(false);
        setSelectedGoal(null);
    };

    return (
        <section className='goals'>
            <div className='goals__header'>
                <h2>{t('dashboard.goals.title')}</h2>
                <Button
                    label={t('dashboard.goals.add_goal')}
                    onClick={() => setIsAddGoalOpen(true)}
                />
            </div>

            <div className='goals__content'>
                {goals.map((goal) => (
                    <CardGoal
                        key={goal.id}
                        goal={goal}
                        onClick={() => setSelectedGoal(goal)}
                    />
                ))}
            </div>

            <Sidebar
                visible={isAddGoalOpen || !!selectedGoal}
                onHide={handleClose}
                position='right'
                style={{ width: '500px' }}
                className='custom_sidebar'
            >
                <FormGoals
                    selectedGoal={selectedGoal}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                />
            </Sidebar>
        </section>
    );
} 