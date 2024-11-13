import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { deleteProfileImage } from '../../../../api/users/deleteProfileImage';
import { updateProfile } from '../../../../api/users/updateProfile';

import './UserSettings.scss';

interface UserSettingsProps {
    onUserUpdated: () => void;
    userName: string;
    userSurname: string;
    userLanguage: string;
    userProfileImage: string | null;
}

export default function UserSettings({ onUserUpdated, userName, userSurname, userLanguage, userProfileImage }: UserSettingsProps) {
    const [language, setLanguage] = useState(userLanguage);
    const [name, setName] = useState(userName);
    const [surname, setSurname] = useState(userSurname);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    const { t } = useTranslation();

    useEffect(() => {
        // Update local state whenever user props change
        setName(userName);
        setSurname(userSurname);
        setLanguage(userLanguage);
    }, [userName, userSurname, userLanguage]);

    // Handler for updating the name state
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    // Handler for updating the surname state
    const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value);

    // Handler for changing the language
    const handleLanguageChange = (e: DropdownChangeEvent) => {
        setLanguage(e.value);
    };

    // Handle profile image file selection and validate its size
    const handleProfileImageUpload = (e: FileUploadHandlerEvent) => {
        const file = e.files[0];
        if (file.size > 8000000) {
            toast.error(t('dashboard.dashboard.user.settings.image_size_error'));
            fileUploadRef.current?.clear();
            return;
        }
        setProfileImage(file);
    };

    // Handler for deleting the profile image
    const handleDeleteProfileImage = async () => {
        toast.loading(t('dashboard.dashboard.user.settings.deleting_image'));

        try {
            await deleteProfileImage();
            toast.dismiss();
            toast.success(t('dashboard.dashboard.user.settings.image_deleted_success'));
            onUserUpdated();
        } catch (error) {
            toast.dismiss();
            toast.error(t('dashboard.dashboard.user.settings.image_deleted_error'));
        }
    };

    // Handler to confirm and save changes for user settings
    const handleConfirmChanges = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('language', language);

        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        toast.loading(t('dashboard.dashboard.user.settings.updating_settings'));

        try {
            await updateProfile(formData); // Make API call to update profile
            toast.dismiss();
            toast.success(t('dashboard.dashboard.user.settings.update_success'));
            onUserUpdated();
        } catch (error) {
            toast.dismiss();
            toast.error(t('dashboard.dashboard.user.settings.update_error'));
        }
    };

    // Language options for dropdown
    const languages = [
        { name: 'English', code: 'en', flag: 'https://flagcdn.com/w20/us.png' },
        { name: 'Español', code: 'es', flag: 'https://flagcdn.com/w20/es.png' }
    ];

    // Template for the selected value in the language dropdown
    const valueTemplate = (option: { name: string, code: string, flag: string } | undefined) => {
        const selectedLanguage = option || languages.find(lang => lang.code === language);

        return selectedLanguage ? (
            <div className='language-item'>
                <img alt={selectedLanguage.name} src={selectedLanguage.flag} className='language-flag' />
                <span>{selectedLanguage.name}</span>
            </div>
        ) : null;
    };

    // Template for rendering each language item in the dropdown list
    const itemTemplate = (option: { name: string, flag: string }) => {
        return (
            <div className='language-item'>
                <img alt={option.name} src={option.flag} className='language-flag' />
                <span>{option.name}</span>
            </div>
        );
    };

    return (
        <div className='settings'>
            <h2>{t('dashboard.dashboard.user.settings.title')}</h2>
            <div className='settings__details'>
                <div className='settings__section'>
                    <div className='profile-picture'>
                        {profileImage ? (
                            // Show uploaded profile image
                            <img src={URL.createObjectURL(profileImage)} alt='Profile' className='profile-picture__img' />
                        ) : userProfileImage ? (
                            // Show user's existing profile image
                            <img src={userProfileImage} alt='Current Profile' className='profile-picture__img' />
                        ) : (
                            // Show a placeholder if no image is available
                            <div className='profile-picture__placeholder'>{t('dashboard.dashboard.user.settings.no_image')}</div>
                        )}
                    </div>
                    <FileUpload
                        ref={fileUploadRef}
                        mode='basic'
                        name='profileImage'
                        accept='image/*'
                        customUpload
                        uploadHandler={handleProfileImageUpload}
                        auto
                        chooseLabel={t('dashboard.dashboard.user.settings.change_image')}
                        className='p-fileupload-custom'
                    />
                    {userProfileImage && (
                        <Button
                            label={t('dashboard.dashboard.user.settings.delete_image')}
                            onClick={handleDeleteProfileImage}
                            link
                        />
                    )}
                </div>

                <div className='settings__section'>
                    <label htmlFor='name'>{t('dashboard.dashboard.user.settings.first_name')}</label>
                    <InputText
                        id='name'
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>

                <div className='settings__section'>
                    <label htmlFor='surname'>{t('dashboard.dashboard.user.settings.last_name')}</label>
                    <InputText
                        id='surname'
                        value={surname}
                        onChange={handleSurnameChange}
                    />
                </div>

                <div className='settings__section'>
                    <label htmlFor='language'>{t('dashboard.dashboard.user.settings.preferred_language')}</label>
                    <Dropdown
                        id='language'
                        value={language}
                        options={languages.map(lang => ({ label: lang.name, value: lang.code, ...lang }))}
                        onChange={handleLanguageChange}
                        valueTemplate={valueTemplate}
                        itemTemplate={itemTemplate}
                        className='language-dropdown'
                    />
                </div>

                <div className='settings__section'>
                    <Button
                        label={t('dashboard.dashboard.user.settings.confirm_changes')}
                        onClick={handleConfirmChanges}
                    />
                </div>
            </div>
        </div>
    );
}
