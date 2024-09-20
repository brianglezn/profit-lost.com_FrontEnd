import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useTranslation } from 'react-i18next';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

function ForgotPasswordToken() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmNewPassword) {
            toast.error(t('landing.auth.resetPasw.token.password_mismatch'));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('https://profit-lost-backend.onrender.com/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            if (response.ok) {
                toast.success(t('landing.auth.resetPasw.token.success_message'));
                navigate('/login');
            } else {
                toast.error(t('landing.auth.resetPasw.error_message'));
            }
        } catch (error) {
            toast.error(t('common.error'));
            console.error('Error resetting password:', error);
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
                    <h2 className="form__title">{t('landing.auth.resetPasw.token.title')}</h2>

                    <div className="form__input-container">
                        <InputText
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder={t('landing.auth.resetPasw.token.verification_code_placeholder')}
                            className="auth-input"
                            required
                        />
                    </div>

                    <div className="form__input-container">
                        <Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t('landing.auth.resetPasw.token.new_password_placeholder')}
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
                            placeholder={t('landing.auth.resetPasw.token.confirm_new_password_placeholder')}
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
                            t('landing.auth.resetPasw.token.submit_button')
                        )}
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default ForgotPasswordToken;
