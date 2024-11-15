export const addMovement = async (movementData: {
    date: string,
    description: string,
    amount: number,
    category: string
}) => {
    try {
        // Enviar una solicitud POST para agregar un nuevo movimiento con credenciales incluidas
        const response = await fetch('https://backend-profit-lost-com.onrender.com/movements/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movementData),
        });

        // Manejar respuesta incorrecta
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta:', errorText);
            throw new Error(`No se pudo agregar el movimiento: ${errorText}`);
        }

        const newMovement = await response.json();
        return newMovement;
    } catch (error) {
        console.error('Error al agregar movimiento:', error);
        throw error;
    }
};
