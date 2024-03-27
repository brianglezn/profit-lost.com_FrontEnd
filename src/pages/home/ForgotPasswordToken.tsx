import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Link } from 'react-router-dom';

import Footer from '../../components/landing/Footer';

import './authForms.css';

function ForgotPasswordToken() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmNewPassword) {
            alert("Passwords don't match!");
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
                console.log('Password has been reset successfully');
                navigate('/login');
            } else {
                console.error('Failed to reset password');
            }
        } catch (error) {
            console.error('There was an error resetting the password', error);
        }

        setIsLoading(false);
    };

    return (
        <>
            <header className="header">
                <div className="header__container_register">
                    <Link to="/" className="header__logo no-select">
                        <img
                            src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
                            alt="logo"
                            style={{ maxWidth: '150px' }}
                        />
                    </Link>
                </div>
            </header>

            <div className="container__form">
                <form className="form__box" onSubmit={handleSubmit}>
                    <h2 className="form__title">Reset Password</h2>

                    <input
                        className="form__input"
                        type="text"
                        placeholder="Verification Code"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />

                    <input
                        className="form__input"
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                        className="form__input"
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />

                    <button className="form__submit" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="6" animationDuration=".5s" />
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default ForgotPasswordToken;
