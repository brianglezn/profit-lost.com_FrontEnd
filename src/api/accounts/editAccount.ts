interface AccountRecord {
    year: number;
    month: string;
    value: number;
}

interface AccountConfiguration {
    backgroundColor: string;
    color: string;
}

interface EditAccountParams {
    accountId: string;
    accountName?: string;
    records?: AccountRecord[];
    configuration?: AccountConfiguration;
}

export async function editAccount({ accountId, accountName, records, configuration }: EditAccountParams): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    const updateData = {
        ...(accountName && { accountName }),
        ...(records && { records }),
        ...(configuration && { configuration }),
    };

    console.log('Updating account with data:', updateData, 'for accountId:', accountId);

    try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/accounts/edit/${accountId}`, {
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

        console.log('Account updated successfully');
    } catch (error) {
        console.error('Error editing account:', error);
        throw error;
    }
}
