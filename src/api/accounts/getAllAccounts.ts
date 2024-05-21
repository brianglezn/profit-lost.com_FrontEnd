interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

interface AccountConfiguration {
    backgroundColor: string;
    color: string;
}

interface RawAccount {
    _id: string;
    accountName: string;
    records: AccountRecord[];
    configuration: AccountConfiguration;
}

interface MappedAccount extends RawAccount {
    AccountId: string;
}

export const getAllAccounts = async (token: string): Promise<MappedAccount[]> => {
    try {
        const response = await fetch('https://profit-lost-backend.onrender.com/accounts/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch accounts');
        }

        const accounts: RawAccount[] = await response.json();
        const mappedAccounts: MappedAccount[] = accounts.map((account) => ({
            ...account,
            AccountId: account._id
        }));

        return mappedAccounts;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw new Error('Failed to fetch accounts');
    }
};
