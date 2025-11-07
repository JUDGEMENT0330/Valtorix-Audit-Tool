import axios from 'axios';
import wappalyzer from 'simple-wappalyzer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { target } = req.body;

    if (!target) {
        return res.status(400).json({ error: 'La URL del objetivo es requerida' });
    }

    // Asegurar que la URL tenga protocolo
    let fullUrl = target;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
        fullUrl = 'https://' + target;
    }

    try {
        const response = await axios.get(fullUrl, { 
            timeout: 10000,
            maxRedirects: 5,
            validateStatus: (status) => status < 500, // Aceptar cualquier status < 500
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            }
        });

        // Verificar que tengamos contenido HTML
        if (!response.data || response.data.length === 0) {
            return res.status(200).json({ 
                technologies: [],
                message: 'No se pudo obtener contenido del sitio web'
            });
        }

        const detections = await wappalyzer({
            url: fullUrl,
            headers: response.headers,
            html: response.data
        });

        res.status(200).json({ 
            technologies: detections || [],
            url: fullUrl,
            statusCode: response.status
        });

    } catch (error) {
        console.error('Tech Detection Error:', error);
        
        // Manejo específico de errores
        if (error.code === 'ECONNABORTED') {
            return res.status(500).json({ 
                error: 'La conexión tardó demasiado tiempo. El sitio puede estar caído o ser muy lento.' 
            });
        }
        
        if (error.code === 'ENOTFOUND') {
            return res.status(400).json({ 
                error: 'No se pudo resolver el dominio. Verifica que la URL sea correcta.' 
            });
        }

        if (error.response && error.response.status >= 400) {
            return res.status(500).json({ 
                error: `El sitio respondió con error ${error.response.status}`,
                details: error.message 
            });
        }

        res.status(500).json({ 
            error: 'Error al analizar el sitio web.',
            details: error.message 
        });
    }
}
