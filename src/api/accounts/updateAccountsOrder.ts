export async function updateAccountsOrder(accountsOrder: string[]): Promise<void> {
  try {
    // Enviar una solicitud POST para actualizar el orden de las cuentas del usuario con cookies incluidas
    const response = await fetch('https://backend-profit-lost-com.onrender.com/user/updateAccountsOrder', {
      method: 'POST',
      credentials: 'include', // Incluye cookies para autenticación
      headers: {
        'Content-Type': 'application/json', // Especifica el formato JSON para el cuerpo de la solicitud
      },
      body: JSON.stringify({ accountsOrder }), // Envía el nuevo orden de cuentas en el cuerpo de la solicitud
    });

    // Verificar si la respuesta no es OK y manejar el error en caso de que falle
    if (!response.ok) {
      const errorText = await response.text(); // Obtiene el texto de error de la respuesta
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Loguea el error para fines de depuración
    console.error('Error al actualizar el orden de las cuentas:', error);
    // Lanza el error para que pueda ser manejado por la función que lo llama
    throw error;
  }
}
