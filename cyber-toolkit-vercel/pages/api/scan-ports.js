import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { target } = req.body;

    if (!target) {
        return res.status(400).json({ error: 'La URL del objetivo es requerida' });
    }

    // Limpiar el target (remover protocolo y path)
    const cleanTarget = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    if (!cleanTarget) {
        return res.status(400).json({ error: 'Objetivo inválido' });
    }

    try {
        const response = await axios.get(`https://api.hackertarget.com/nmap/?q=${cleanTarget}`, {
            timeout: 30000, // 30 segundos de timeout
            validateStatus: () => true
        });
        
        // Verificar si la respuesta contiene error de API key
        if (typeof response.data === 'string' && response.data.includes('error')) {
            if (response.data.includes('key required') || response.data.includes('API')) {
                return res.status(200).json({
                    host: cleanTarget,
                    status: 'limited',
                    message: 'La API de HackerTarget tiene límites. Intenta con otro objetivo o espera unos minutos.',
                    ports: []
                });
            }
        }

        // Parse de la respuesta
        const openPorts = [];
        
        if (typeof response.data === 'string') {
            const lines = response.data.split('\n');
            
            for (const line of lines) {
                // Buscar líneas que contienen "open"
                if (line.toLowerCase().includes('open')) {
                    // Formato esperado: "80/tcp   open  http"
                    const match = line.match(/(\d+)\/(\w+)\s+open\s+(.*)/i);
                    if (match) {
                        openPorts.push({
                            port: parseInt(match[1]),
                            protocol: match[2],
                            service: match[3].trim()
                        });
                    }
                }
            }
        }

        // Si no se encontraron puertos pero tampoco hubo error
        if (openPorts.length === 0 && !response.data.includes('error')) {
            return res.status(200).json({
                host: cleanTarget,
                status: 'scanned',
                message: 'No se encontraron puertos abiertos o el host no está disponible',
                ports: []
            });
        }

        res.status(200).json({
            host: cleanTarget,
            status: 'scanned',
            ports: openPorts,
            totalOpen: openPorts.length
        });

    } catch (error) {
        console.error('Port Scan Error:', error);
        
        // Manejo específico de errores
        if (error.code === 'ECONNABORTED') {
            return res.status(500).json({ 
                error: 'El escaneo tardó demasiado tiempo. El objetivo puede estar bloqueando las conexiones.' 
            });
        }
        
        if (error.code === 'ENOTFOUND') {
            return res.status(400).json({ 
                error: 'No se pudo resolver el nombre del host. Verifica que el objetivo sea válido.' 
            });
        }

        res.status(500).json({ 
            error: 'Ocurrió un error durante el escaneo de puertos.',
            details: error.message 
        });
    }
}
