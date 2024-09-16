import './UserSettings.scss';

const UserSettings = () => {
    return (
        <div className="settings">
            <h2>settings Settings</h2>
            <p>Manage your settings details here.</p>
            <div className="settings__details">
                <div className="settings__section">
                    <label>Name:</label>
                    <p>John Doe</p>
                </div>
                <div className="settings__section">
                    <label>Email:</label>
                    <p>johndoe@example.com</p>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
