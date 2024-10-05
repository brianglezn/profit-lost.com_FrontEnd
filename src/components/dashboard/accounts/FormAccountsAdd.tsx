import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import { addAccount } from '../../../api/accounts/addAccount';

import './FormAccounts.scss';

export default function FormAccountsAdd({ onAccountAdded }: { onAccountAdded: () => void }) {
    const { t } = useTranslation();
    const [accountName, setAccountName] = useState<string>('');

    // Handle form submission to add a new account
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if account name is empty and show an error toast if it is
        if (accountName.trim() === '') {
            toast.error(t('dashboard.accounts.form_accounts_add.error_message'));
            return;
        }

        try {
            // Call the API function to add the account
            await addAccount(accountName.trim());
            toast.success(t('dashboard.accounts.form_accounts_add.success_message'));
            onAccountAdded(); // Call the callback function to update the account list
        } catch (error) {
            toast.error(t('dashboard.accounts.form_accounts_add.error_adding'));
        }
    };

    return (
        <form className="formAccount" onSubmit={handleSubmit}>
            <h2>{t('dashboard.accounts.form_accounts_add.title')}</h2>
            {/* Input field for entering the account name */}
            <InputText
                id="accountName"
                className="custom-input"
                placeholder={t('dashboard.accounts.form_accounts_add.placeholder')}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
            />
            {/* Button to submit the form and add the account */}
            <button type="submit" className="custom-btn">{t('dashboard.accounts.account_item.add')}</button>
        </form>
    );
}
