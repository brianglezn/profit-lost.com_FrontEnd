import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';

import './UserSettings.scss';

interface UserSettingsProps {
    onUserUpdated: () => void;
    userName: string;
    userSurname: string;
    userLanguage: string;
    userProfileImage: string | null;
}

const UserSettings: React.FC<UserSettingsProps> = ({ onUserUpdated, userName, userSurname, userLanguage, userProfileImage }) => {
    const [language, setLanguage] = useState(userLanguage);
    const [name, setName] = useState(userName);
    const [surname, setSurname] = useState(userSurname);
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        setName(userName);
        setSurname(userSurname);
        setLanguage(userLanguage);
    }, [userName, userSurname, userLanguage]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value);

    const handleLanguageChange = (e: DropdownChangeEvent) => {
        setLanguage(e.value);
    };

    const handleProfileImageUpload = (e: FileUploadHandlerEvent) => {
        const file = e.files[0];
        if (file.size > 8000000) {
            toast.error('Image size exceeds the 8MB limit');
            fileUploadRef.current?.clear();
            return;
        }
        setProfileImage(file);
    };

    const languages = [
        { name: 'English', code: 'en', flag: 'https://flagcdn.com/w20/us.png' },
        { name: 'Español', code: 'es', flag: 'https://flagcdn.com/w20/es.png' }
    ];

    const valueTemplate = (option: { name: string, code: string, flag: string } | undefined) => {
        if (option) {
            return (
                <div className="language-item">
                    <img alt={option.name} src={option.flag} className="language-flag" />
                    <span>{option.name}</span>
                </div>
            );
        }
        const selectedLanguage = languages.find(l => l.code === language);
        return selectedLanguage ? (
            <div className="language-item">
                <img alt={selectedLanguage.name} src={selectedLanguage.flag} className="language-flag" />
                <span>{selectedLanguage.name}</span>
            </div>
        ) : null;
    };

    const itemTemplate = (option: { name: string, flag: string }) => {
        return (
            <div className="language-item">
                <img alt={option.name} src={option.flag} className="language-flag" />
                <span>{option.name}</span>
            </div>
        );
    };

    const handleConfirmChanges = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('language', language);

        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        toast.loading('Updating settings...');

        try {
            const response = await fetch('https://profit-lost-backend.onrender.com/user/updateProfile', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update user settings');
            }

            toast.dismiss();
            toast.success('User settings updated successfully!');

            onUserUpdated();
        } catch (error) {
            toast.dismiss();
            toast.error('Error updating user settings.');
            console.error('Error updating user settings:', error);
        }
    };

    return (
        <div className="settings">
            <div className="settings__details">
                {/* Cambiar imagen de perfil */}
                <div className="settings__section">
                    <div className="profile-picture">
                        {profileImage ? (
                            <img src={URL.createObjectURL(profileImage)} alt="Profile" className="profile-picture__img" />
                        ) : userProfileImage ? (
                            <img src={userProfileImage} alt="Current Profile" className="profile-picture__img" />
                        ) : (
                            <div className="profile-picture__placeholder">No Image</div>
                        )}
                    </div>
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        name="profileImage"
                        accept="image/*"
                        customUpload
                        uploadHandler={handleProfileImageUpload}
                        auto
                        chooseLabel="Change Image"
                        className="p-button-outlined"
                    />
                </div>

                {/* Cambiar nombre */}
                <div className="settings__section">
                    <label htmlFor="name">First Name:</label>
                    <input
                        type="text"
                        id="name"
                        className='custom-input'
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>

                {/* Cambiar apellido */}
                <div className="settings__section">
                    <label htmlFor="surname">Last Name:</label>
                    <input
                        type="text"
                        id="surname"
                        className='custom-input'
                        value={surname}
                        onChange={handleSurnameChange}
                    />
                </div>

                {/* Cambiar idioma */}
                <div className="settings__section">
                    <label htmlFor="language">Preferred Language:</label>
                    <Dropdown
                        id="language"
                        value={language}
                        options={languages.map(lang => ({ label: lang.name, value: lang.code, ...lang }))}
                        onChange={handleLanguageChange}
                        valueTemplate={valueTemplate(languages.find(l => l.code === language))}
                        itemTemplate={itemTemplate}
                        className="language-dropdown"
                    />
                </div>

                {/* Botón para confirmar cambios */}
                <div className="settings__section">
                    <Button
                        label="Confirm Changes"
                        onClick={handleConfirmChanges}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
