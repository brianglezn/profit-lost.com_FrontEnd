import { AccountRecord, AccountConfiguration } from '../../helpers/types';

interface EditAccountParams {
    _id: string;
    accountName?: string;
    records?: AccountRecord[];
    configuration?: AccountConfiguration;
}

export async function editAccount({ _id, accountName, records, configuration }: EditAccountParams): Promise<void> {
    const updateData = {
        ...(accountName && { accountName }),
        ...(records && { records }),
        ...(configuration && { configuration }),
    };

    try {
        const response = await fetch(`https://backend-profit-lost-com.onrender.com/accounts/edit/${_id}`, {
            method: 'PUT',
            credentials: 'include', // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error editing account:', error);
        throw error;
    }
}
