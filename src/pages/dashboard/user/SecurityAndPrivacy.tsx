import { useState, useEffect } from 'react';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { changePassword } from '../../../api/users/changePassword';
import { getUserByToken } from '../../../api/users/getUserByToken';
import { deleteAccount } from '../../../api/users/deleteAccount';

import './SecurityAndPrivacy.scss';

const SecurityAndPrivacy = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameConfirmation, setUsernameConfirmation] = useState('');
    const [username, setUsername] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Para mostrar el input de confirmación
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const user = await getUserByToken(token);
                    setUsername(user.username);
                } catch (error) {
                    console.error('Failed to fetch user information');
                }
            }
        };

        fetchUser();
    }, [token]);

    const handleShowDeleteConfirmation = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDeleteAccount = async () => {
        if (usernameConfirmation !== username) {
            toast.error('Username does not match', { duration: 3000 });
            return;
        }

        try {
            if (token) {
                await deleteAccount(token);
                toast.success("User account deleted successfully", { duration: 3000 });
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error deleting account';
            toast.error(errorMessage, { duration: 3000 });
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match', { duration: 3000 });
            return;
        }

        try {
            const data = await changePassword(currentPassword, newPassword);
            toast.success(data.message || 'Password changed successfully', { duration: 3000 });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error changing password';
            toast.error(errorMessage, { duration: 3000 });
        }
    };

    return (
        <div className="security-privacy">
            <h2>Security and Privacy Settings</h2>

            {/* Sección de cambio de contraseña */}
            <div className="password-section">
                <h2>Change Password</h2>
                <div className="security-privacy__section">
                    <label htmlFor="current-password">Current Password</label>
                    <Password
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        toggleMask
                        feedback={false}
                    />
                </div>

                <div className="security-privacy__section">
                    <label htmlFor="new-password">New Password</label>
                    <Password
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        toggleMask
                        feedback={true}
                    />
                </div>

                <div className="security-privacy__section">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <Password
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        toggleMask
                        feedback={false}
                    />
                </div>

                <div className="security-privacy__section">
                    <Button label="Change Password" icon="pi pi-check" onClick={handlePasswordChange} />
                </div>
            </div>

            {/* Nueva Sección: Eliminar Cuenta */}
            <div className="delete-account-section">
                <h2>Delete Account</h2>
                <p>Warning: This action is irreversible. Once deleted, your account cannot be recovered.</p>

                {/* Botón inicial para mostrar la confirmación */}
                {!showDeleteConfirmation ? (
                    <Button
                        label="Delete Account"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={handleShowDeleteConfirmation}
                    />
                ) : (
                    <>
                        <p>Please enter your username to confirm account deletion:</p>
                        <div className="security-privacy__section">
                            <InputText
                                value={usernameConfirmation}
                                onChange={(e) => setUsernameConfirmation(e.target.value)}
                                placeholder="Enter your username"
                                className="p-inputtext p-component"
                            />
                        </div>
                        <Button
                            label="Confirm Delete"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={handleDeleteAccount}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default SecurityAndPrivacy;
