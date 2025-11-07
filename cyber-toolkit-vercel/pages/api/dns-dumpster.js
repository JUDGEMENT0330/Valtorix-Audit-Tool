import axios from 'axios';

const recordTypes = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME'];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { target } = req.body;

    if (!target) {
        return res.status(400).json({ error: 'El dominio del objetivo es requerido' });
    }

    // Validar y limpiar el dominio (remover protocolo y path)
    const cleanTarget = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    if (!cleanTarget) {
        return res.status(400).json({ error: 'Dominio inválido' });
    }

    try {
        const promises = recordTypes.map(type => 
            axios.get(`https://dns.google/resolve?name=${cleanTarget}&type=${type}`, {
                timeout: 10000,
                validateStatus: () => true // Aceptar cualquier status code
            }).catch(err => ({ 
                data: { Status: -1, error: err.message } 
            }))
        );

        const responses = await Promise.all(promises);

        const results = {};
        let foundRecords = 0;

        responses.forEach((response, index) => {
            const type = recordTypes[index];
            
            // Verificar si hay respuesta válida con registros
            if (response.data && response.data.Answer && response.data.Answer.length > 0) {
                results[type] = response.data.Answer.map(ans => ans.data);
                foundRecords++;
            }
        });

        // Si no se encontraron registros, devolver mensaje informativo
        if (foundRecords === 0) {
            return res.status(200).json({ 
                message: 'No se encontraron registros DNS para este dominio o el dominio no existe',
                domain: cleanTarget,
                results: {}
            });
        }

        res.status(200).json({ 
            domain: cleanTarget,
            results,
            recordCount: foundRecords
        });

    } catch (error) {
        console.error('DNS Error:', error);
        res.status(500).json({ 
            error: 'Ocurrió un error durante la búsqueda de DNS.',
            details: error.message 
        });
    }
}
