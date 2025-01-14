import { Account, AccountRecord, AccountConfiguration } from '../../helpers/types';

export const getAllAccounts = async (token: string): Promise<Account[]> => {
    try {
        const response = await fetch('https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/accounts/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch accounts');
        }

        const accounts = await response.json();

        const mappedAccounts: Account[] = accounts.map((account: Account) => ({
            _id: account._id, 
            user_id: account.user_id,
            accountName: account.accountName,
            records: account.records as AccountRecord[],
            configuration: account.configuration as AccountConfiguration
        }));

        return mappedAccounts;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw new Error('Failed to fetch accounts');
    }
};
