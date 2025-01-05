import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../../context/useUser';
import type { Goal, GoalHistory } from '../../../../../helpers/types';
import PlusIcon from '../../../../../components/icons/PlusIcon';

import './FormGoals.scss';

interface FormGoalsProps {
    selectedGoal?: Goal | null;
    onSubmit: (goal: Omit<Goal, 'id'>) => void;
    onCancel: () => void;
}

interface GoalTypeOption {
    label: string;
    value: Goal['type'];
}

export default function FormGoals({ selectedGoal, onSubmit, onCancel }: FormGoalsProps) {
    const { t } = useTranslation();
    const { user } = useUser();
    const [name, setName] = useState('');
    const [type, setType] = useState<Goal['type']>('Saving');
    const [targetAmount, setTargetAmount] = useState<number>(0);
    const [currentAmount, setCurrentAmount] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [hasDeadline, setHasDeadline] = useState(false);
    const [history, setHistory] = useState<GoalHistory[]>([]);

    const goalTypes: GoalTypeOption[] = [
        { label: t('dashboard.goals.types.saving'), value: 'Saving' },
        { label: t('dashboard.goals.types.reduction'), value: 'Reduction of expenses' },
        { label: t('dashboard.goals.types.debt'), value: 'Debt' },
        { label: t('dashboard.goals.types.investment'), value: 'Investment' }
    ];

    useEffect(() => {
        if (selectedGoal) {
            setName(selectedGoal.name);
            setType(selectedGoal.type);
            setTargetAmount(selectedGoal.targetAmount);
            setCurrentAmount(selectedGoal.currentAmount);
            if (selectedGoal.deadline) {
                const deadlineDate = new Date(selectedGoal.deadline);
                setDeadline(deadlineDate);
                setHasDeadline(true);
            } else {
                setDeadline(null);
                setHasDeadline(false);
            }
        } else {
            // Limpiar el formulario cuando no hay meta seleccionada
            setName('');
            setType('Saving');
            setTargetAmount(0);
            setCurrentAmount(0);
            setDeadline(null);
            setHasDeadline(false);
        }
    }, [selectedGoal]);

    useEffect(() => {
        if (selectedGoal?.history) {
            setHistory(selectedGoal.history);
        } else {
            setHistory([]);
        }
    }, [selectedGoal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (targetAmount <= 0) {
            // Aquí podrías usar un toast o mensaje de error
            return;
        }

        if (currentAmount > targetAmount) {
            // Aquí podrías usar un toast o mensaje de error
            return;
        }

        onSubmit({
            name,
            type,
            targetAmount,
            currentAmount,
            deadline: hasDeadline && deadline ? deadline.toISOString() : undefined,
            history: []
        });
    };

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const addHistoryEntry = () => {
        setHistory([
            ...history,
            {
                date: new Date().toISOString(),
                amount: 0
            }
        ]);
    };

    const updateHistoryEntry = (index: number, field: keyof GoalHistory, value: string | number) => {
        const updatedHistory = [...history];
        if (field === 'date') {
            updatedHistory[index] = {
                ...updatedHistory[index],
                date: new Date(value as string).toISOString()
            };
        } else {
            updatedHistory[index] = {
                ...updatedHistory[index],
                [field]: Number(value)
            };
        }
        setHistory(updatedHistory);
    };

    const removeHistoryEntry = (index: number) => {
        setHistory(history.filter((_, i) => i !== index));
    };

    return (
        <form className='formGoals' onSubmit={handleSubmit}>
            <h2>{selectedGoal ? t('dashboard.goals.form.edit_goal') : t('dashboard.goals.form.new_goal')}</h2>

            <InputText
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('dashboard.goals.form.name')}
                className='custom-input'
            />
            <Dropdown
                id='type'
                value={type}
                options={goalTypes}
                onChange={(e) => setType(e.value)}
                optionLabel="label"
                className='formDropdown'
                placeholder={t('dashboard.goals.form.type')}
                required
            />
            <InputNumber
                id='targetAmount'
                value={targetAmount}
                onValueChange={(e) => setTargetAmount(e.value ?? 0)}
                required
                placeholder={t('dashboard.goals.form.target_amount')}
                className='custom-input'
                mode="currency"
                currency={user?.currency}
                locale="es-ES"
            />
            <InputNumber
                id='currentAmount'
                value={currentAmount}
                onValueChange={(e) => setCurrentAmount(e.value ?? 0)}
                required
                placeholder={t('dashboard.goals.form.current_amount')}
                className='custom-input'
                mode="currency"
                currency={user?.currency}
                locale="es-ES"
            />

            <div className='form-field'>
                <div className='deadline-header'>
                    <label>{t('dashboard.goals.form.set_deadline')}</label>
                    <label className='switch'>
                        <input
                            type='checkbox'
                            checked={hasDeadline}
                            onChange={(e) => {
                                setHasDeadline(e.target.checked);
                                if (!e.target.checked) {
                                    setDeadline(null);
                                }
                            }}
                        />
                        <span className='slider'></span>
                    </label>
                </div>

                {hasDeadline && (
                    <div className='deadline-field'>
                        <input
                            type='date'
                            className='custom-input'
                            value={deadline ? formatDateForInput(deadline) : ''}
                            onChange={(e) => setDeadline(new Date(e.target.value))}
                            min={formatDateForInput(new Date())}
                            required
                        />
                    </div>
                )}
            </div>

            {selectedGoal && (
                <div className='form-field'>
                    <div className='history-header'>
                        <p className='form-field-title'>{t('dashboard.goals.form.history')}</p>
                        <button
                            type='button'
                            className='add-history-btn'
                            onClick={addHistoryEntry}
                        >
                            <PlusIcon width={20} height={20} />
                        </button>
                    </div>
                    <div className='history-list'>
                        {history.map((record, index) => (
                            <div key={index} className='history-item'>
                                <input
                                    type='date'
                                    className='history-date custom-input'
                                    value={formatDateForInput(new Date(record.date))}
                                    onChange={(e) => updateHistoryEntry(index, 'date', e.target.value)}
                                />
                                <InputNumber
                                    value={record.amount}
                                    onValueChange={(e) => updateHistoryEntry(index, 'amount', e.value || 0)}
                                    mode="currency"
                                    currency={user?.currency}
                                    locale="es-ES"
                                    className='custom-input'
                                />
                                <button
                                    type='button'
                                    className='remove-history-btn'
                                    onClick={() => removeHistoryEntry(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className='formGoals-buttons'>
                {selectedGoal && (
                    <button
                        type='button'
                        className='custom-btn-sec'
                        onClick={onCancel}
                    >
                        {t('dashboard.goals.form.delete')}
                    </button>
                )}
                <button
                    type='submit'
                    className='custom-btn'
                >
                    {selectedGoal ? t('dashboard.goals.form.update') : t('dashboard.goals.form.create')}
                </button>
            </div>
        </form>
    );
} 