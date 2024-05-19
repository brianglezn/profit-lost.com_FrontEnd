import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import { addAccount } from '../../../api/accounts/addAccount';
import './FormAccounts.scss';

function FormAccountsAdd({ onAccountAdded }: { onAccountAdded: () => void }) {
    const [accountName, setAccountName] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (accountName.trim() === '') {
            toast.error('Account name is required');
            return;
        }

        try {
            console.log('Attempting to add account:', accountName.trim());
            await addAccount(accountName.trim());
            toast.success('Account created successfully');
            onAccountAdded();
        } catch (error) {
            toast.error('Error adding account');
        }
    };

    return (
        <form className="formAccount" onSubmit={handleSubmit}>
            <h2>Add Account</h2>
            <input
                type="text"
                id="accountName"
                className="custom-input"
                placeholder='Name'
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
            />
            <button type="submit" className="custom-btn">Save</button>
        </form>
    );
}

export default FormAccountsAdd;
