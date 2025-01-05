import { useState } from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import type { Goal } from '../../../../helpers/types';
import CardGoal from './components/CardGoal';
import './Goals.scss';

export default function Goals() {
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
        },
        {
            id: '4',
            name: 'Investment Portfolio',
            type: 'Investment',
            targetAmount: 50000,
            currentAmount: 15000,
            deadline: '2025-12-30T23:59:59.999Z'
        }
    ];

    const [goals, setGoals] = useState<Goal[]>(exampleGoals);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

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
                    <CardGoal
                        key={goal.id}
                        goal={goal}
                        onClick={() => setSelectedGoal(goal)}
                    />
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