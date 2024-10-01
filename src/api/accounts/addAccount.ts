export async function addAccount(accountName: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    const startYear = new Date().getFullYear() - 2;
    const endYear = new Date().getFullYear();
    const records = [];

    for (let year = startYear; year <= endYear; year++) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (const month of months) {
            records.push({ year, month, value: 0 });
        }
    }

    const configuration = {
        backgroundColor: "#7e2a10",
        color: "#ffffff"
    };

    try {
        const response = await fetch('https://app-profit-lost-com.onrender.com/accounts/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountName,
                records,
                configuration,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error adding account:', error);
        throw error;
    }
}
