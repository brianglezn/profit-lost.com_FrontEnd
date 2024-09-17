import { useState } from 'react';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';

import { changePassword } from '../../../api/users/changePassword';

import './SecurityAndPrivacy.scss';

const SecurityAndPrivacy = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
    );
};

export default SecurityAndPrivacy;
