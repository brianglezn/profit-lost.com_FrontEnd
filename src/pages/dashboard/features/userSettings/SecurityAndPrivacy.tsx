import { useState, useEffect } from 'react';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { changePassword } from '../../../../api/users/changePassword';
import { deleteAccount } from '../../../../api/users/deleteAccount';
import { useUser } from '../../../../context/useUser';

import './SecurityAndPrivacy.scss';

export default function SecurityAndPrivacy() {
    const { user, refreshUser } = useUser();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameConfirmation, setUsernameConfirmation] = useState('');
    const [username, setUsername] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
        }
    }, [user]);

    // Show the delete account confirmation form
    const handleShowDeleteConfirmation = () => {
        setShowDeleteConfirmation(true);
    };

    // Handle account deletion after confirming username
    const handleDeleteAccount = async () => {
        if (usernameConfirmation !== username) {
            toast.error(t('dashboard.dashboard.user.security_privacy.username_does_not_match'), { duration: 3000 });
            return;
        }

        try {
            if (token) {
                await deleteAccount(token);
                await refreshUser();
                toast.success(t('dashboard.dashboard.user.security_privacy.delete_account_success'), { duration: 3000 });
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('dashboard.dashboard.user.security_privacy.delete_account_error');
            toast.error(errorMessage, { duration: 3000 });
        }
    };

    // Handle password change process
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error(t('dashboard.dashboard.user.security_privacy.passwords_do_not_match'), { duration: 3000 });
            return;
        }

        try {
            const data = await changePassword(currentPassword, newPassword);
            await refreshUser();
            toast.success(data.message || t('dashboard.dashboard.user.security_privacy.password_changed_success'), { duration: 3000 });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t('dashboard.dashboard.user.security_privacy.password_changed_error');
            toast.error(errorMessage, { duration: 3000 });
        }
    };

    return (
        <div className='security-privacy'>
            <h2>{t('dashboard.dashboard.user.security_privacy.title')}</h2>

            <div className='password-section'>
                <h2>{t('dashboard.dashboard.user.security_privacy.change_password')}</h2>
                <div className='security-privacy__section'>
                    <label htmlFor='current-password'>{t('dashboard.dashboard.user.security_privacy.current_password')}</label>
                    <Password
                        id='current-password'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        toggleMask
                        feedback={false}
                    />
                </div>

                <div className='security-privacy__section'>
                    <label htmlFor='new-password'>{t('dashboard.dashboard.user.security_privacy.new_password')}</label>
                    <Password
                        id='new-password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        toggleMask
                        feedback={true}
                    />
                </div>

                <div className='security-privacy__section'>
                    <label htmlFor='confirm-password'>{t('dashboard.dashboard.user.security_privacy.confirm_password')}</label>
                    <Password
                        id='confirm-password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        toggleMask
                        feedback={false}
                    />
                </div>

                <div className='security-privacy__section'>
                    <Button label={t('dashboard.dashboard.user.security_privacy.change_password_button')} icon='pi pi-check' onClick={handlePasswordChange} />
                </div>
            </div>

            <div className='delete-account-section'>
                <h2>{t('dashboard.dashboard.user.security_privacy.delete_account')}</h2>
                <p>{t('dashboard.dashboard.user.security_privacy.delete_account_warning')}</p>

                {!showDeleteConfirmation ? (
                    <Button
                        label={t('dashboard.dashboard.user.security_privacy.delete_account')}
                        icon='pi pi-trash'
                        className='p-button-danger'
                        onClick={handleShowDeleteConfirmation}
                    />
                ) : (
                    <>
                        <p>{t('dashboard.dashboard.user.security_privacy.enter_username')}</p>
                        <div className='security-privacy__section'>
                            <InputText
                                value={usernameConfirmation}
                                onChange={(e) => setUsernameConfirmation(e.target.value)}
                                placeholder={t('dashboard.dashboard.user.security_privacy.username')}
                                className='p-inputtext p-component'
                            />
                        </div>
                        <Button
                            label={t('dashboard.dashboard.user.security_privacy.confirm_delete')}
                            icon='pi pi-trash'
                            className='p-button-danger'
                            onClick={handleDeleteAccount}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
