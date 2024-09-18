import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

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
            toast.error("Passwords don't match!");
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
                toast.success('Password has been reset successfully');
                navigate('/login');
            } else {
                toast.error('Failed to reset password. Please try again.');
                console.error('Failed to reset password');
            }
        } catch (error) {
            toast.error('There was an error resetting the password. Please try again.');
            console.error('There was an error resetting the password', error);
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
                        style={{ maxWidth: '150px' }}
                    />
                </a>
            </header>

            <div className="container__form">
                <form className="form__box" onSubmit={handleSubmit}>
                    <h2 className="form__title">Reset Password</h2>

                    <input
                        className="form__input auth-input"
                        type="text"
                        placeholder="Verification Code"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />

                    <input
                        className="form__input auth-input"
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                        className="form__input auth-input"
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />

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

export default ForgotPasswordToken;
