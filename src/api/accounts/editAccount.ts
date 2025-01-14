import { AccountRecord, AccountConfiguration } from '../../helpers/types';

interface EditAccountParams {
    _id: string;
    accountName?: string;
    records?: AccountRecord[];
    configuration?: AccountConfiguration;
}

export async function editAccount({ _id, accountName, records, configuration }: EditAccountParams): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    const updateData = {
        ...(accountName && { accountName }),
        ...(records && { records }),
        ...(configuration && { configuration }),
    };

    try {
        const response = await fetch(`https://written-ashia-profit-lost-6f7f84ee.koyeb.app/api/accounts/edit/${_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
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
