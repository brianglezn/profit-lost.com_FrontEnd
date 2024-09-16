import './SecurityAndPrivacy.scss';

const SecurityAndPrivacy = () => {
    return (
        <div className="security-privacy">
            <h2>Security and Privacy Settings</h2>
            <p>Configure your security settings here.</p>
            <div className="security-privacy__section">
                <label>Password</label>
                <button>Change Password</button>
            </div>
            <div className="security-privacy__section">
                <label>Two-Factor Authentication</label>
                <button>Enable 2FA</button>
            </div>
        </div>
    );
};

export default SecurityAndPrivacy;
