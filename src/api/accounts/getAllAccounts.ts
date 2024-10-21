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
        // Send a GET request to fetch all accounts from the server
        const response = await fetch('https://backend-profit-lost-com.onrender.com/accounts/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Attach the authorization token for authentication
            },
        });

        // Check if the response status is not OK, throw an error if there's an issue with the request
        if (!response.ok) {
            throw new Error('Failed to fetch accounts');
        }

        // Parse the response body into an array of RawAccount objects
        const accounts: RawAccount[] = await response.json();

        // Map the accounts to include an 'AccountId' field instead of '_id' for easier usage
        const mappedAccounts: MappedAccount[] = accounts.map((account) => ({
            ...account, // Spread operator to keep all existing fields
            AccountId: account._id, // Map _id to AccountId for better readability
        }));

        // Return the mapped accounts
        return mappedAccounts;
    } catch (error) {
        // Log the error to the console and re-throw a new error with a general failure message
        console.error('Error fetching accounts:', error);
        throw new Error('Failed to fetch accounts');
    }
};
