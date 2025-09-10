// Proxy para manejar las peticiones a n8n y evitar problemas de CORS
export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, userId, messageId, timestamp } = req.body;

        console.log('Proxy recibió:', { message, userId, messageId, timestamp });

        // Hacer la petición a n8n
        const response = await fetch('https://shadowcat.cloud/webhook/2636ab69-9b01-4d0a-9146-178947f0c5cf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                userId,
                messageId,
                timestamp
            })
        });

        if (!response.ok) {
            throw new Error(`n8n responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('n8n respondió:', data);

        // Devolver la respuesta de n8n al frontend
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en proxy:', error);
        res.status(500).json({ 
            error: 'Error connecting to n8n',
            details: error.message 
        });
    }
}
