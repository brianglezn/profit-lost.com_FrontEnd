import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { resetPassword } from '../../../api/auth/resetPassword';
import Footer from '../../../components/layout/Footer';

import './authForms.scss';

export default function ForgotPasswordToken() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords don't match!");
            setIsLoading(false);
            return;
        }

        const { success, error } = await resetPassword(token, newPassword);

        if (success) {
            toast.success("Password has been reset successfully.");
            navigate('/login');
        } else {
            toast.error(error || "Failed to reset password. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <div className='authForms'>
            <header className="auth__header">
                <a href="/" className="header__logo no-select">
                    <img
                        src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
                        alt="logo"
                    />
                </a>
            </header>

            <div className="container__form">
                <form className="form__box" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
                    <h2 className="form__title">Reset Password</h2>

                    <div className="form__input-container">
                        <InputText
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Verification Code"
                            className="auth-input"
                            required
                        />
                    </div>

                    <div className="form__input-container">
                        <Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            toggleMask
                            feedback={true}
                            className="auth-input"
                            required
                        />
                    </div>

                    <div className="form__input-container">
                        <Password
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            toggleMask
                            feedback={false}
                            className="auth-input"
                            required
                        />
                    </div>

                    <button className="custom-btn" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <span className="custom-loader"></span>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
}
