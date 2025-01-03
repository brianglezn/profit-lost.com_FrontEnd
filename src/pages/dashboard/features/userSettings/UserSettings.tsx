import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useUser } from '../../../../context/useUser';
import { deleteProfileImage } from '../../../../api/users/deleteProfileImage';
import { updateProfile } from '../../../../api/users/updateProfile';

import './UserSettings.scss';

type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';
type TimeFormat = '12h' | '24h';

export default function UserSettings() {
    const { t } = useTranslation();
    const { user, refreshUser } = useUser();
    
    const [language, setLanguage] = useState(user?.language || 'en');
    const [name, setName] = useState(user?.name || '');
    const [surname, setSurname] = useState(user?.surname || '');
    const [currency, setCurrency] = useState(user?.currency || 'USD');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const [dateFormat, setDateFormat] = useState<DateFormat>(user?.dateFormat || 'MM/DD/YYYY');
    const [timeFormat, setTimeFormat] = useState<TimeFormat>(user?.timeFormat || '12h');

    useEffect(() => {
        // Update local state whenever user props change
        setName(user?.name || '');
        setSurname(user?.surname || '');
        setLanguage(user?.language || 'en');
        setCurrency(user?.currency || 'USD');
        setDateFormat(user?.dateFormat || 'MM/DD/YYYY');
        setTimeFormat(user?.timeFormat || '12h');
    }, [user]);

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
            await refreshUser();
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
        formData.append('currency', currency);
        formData.append('dateFormat', dateFormat);
        formData.append('timeFormat', timeFormat);

        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        toast.loading(t('dashboard.dashboard.user.settings.updating_settings'));

        try {
            await updateProfile(formData);
            toast.dismiss();
            toast.success(t('dashboard.dashboard.user.settings.update_success'));
            await refreshUser();
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

    // Currency options for dropdown con símbolos de moneda
    const currencyOptions = [
        { name: '$ USD', code: 'USD' },
        { name: '€ EUR', code: 'EUR' },
        { name: '£ GBP', code: 'GBP' }
    ];

    // Handler for changing the currency
    const handleCurrencyChange = (e: DropdownChangeEvent) => {
        setCurrency(e.value);
    };

    // Opciones para los formatos
    const dateFormatOptions = [
        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }
    ];

    const timeFormatOptions = [
        { label: '12h (AM/PM)', value: '12h' },
        { label: '24h', value: '24h' }
    ];

    // Handlers para los cambios de formato
    const handleDateFormatChange = (e: DropdownChangeEvent) => {
        setDateFormat(e.value as DateFormat);
    };

    const handleTimeFormatChange = (e: DropdownChangeEvent) => {
        setTimeFormat(e.value as TimeFormat);
    };

    return (
        <div className='settings'>
            <h2>{t('dashboard.dashboard.user.settings.title')}</h2>
            <div className='settings__details'>
                <div className='settings__section'>
                    <div className='profile-picture'>
                        {profileImage ? (
                            <img src={URL.createObjectURL(profileImage)} alt='Profile' className='profile-picture__img' />
                        ) : user?.profileImage ? (
                            <img src={user.profileImage} alt='Current Profile' className='profile-picture__img' />
                        ) : (
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
                    {user?.profileImage && (
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
                    <label htmlFor='currency'>{t('dashboard.dashboard.user.settings.preferred_currency')}</label>
                    <Dropdown
                        id='currency'
                        value={currency}
                        options={currencyOptions.map(curr => ({ label: curr.name, value: curr.code }))}
                        onChange={handleCurrencyChange}
                        className='currency-dropdown'
                        placeholder={t('dashboard.dashboard.user.settings.select_currency')}
                    />
                </div>

                <div className='settings__section'>
                    <label htmlFor='dateFormat'>{t('dashboard.dashboard.user.settings.date_format')}</label>
                    <Dropdown
                        id='dateFormat'
                        value={dateFormat}
                        options={dateFormatOptions}
                        onChange={handleDateFormatChange}
                        className='date-format-dropdown'
                    />
                </div>

                <div className='settings__section'>
                    <label htmlFor='timeFormat'>{t('dashboard.dashboard.user.settings.time_format')}</label>
                    <Dropdown
                        id='timeFormat'
                        value={timeFormat}
                        options={timeFormatOptions}
                        onChange={handleTimeFormatChange}
                        className='time-format-dropdown'
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
