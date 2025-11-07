import axios from 'axios';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';

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

    // Remover trailing slash
    fullUrl = fullUrl.replace(/\/$/, '');

    const commonPaths = [
        '/admin', '/login', '/dashboard', '/wp-admin', '/administrator', '/backup',
        '/config', '/test', '/dev', '/api', '/uploads', '/files', '/images',
        '/css', '/js', '/robots.txt', '/sitemap.xml', '/.htaccess', '/.env',
        '/config.json', '/package.json', '/phpinfo.php', '/admin.php', '/login.php',
        '/register.php', '/vendor/', '/includes/', '/cgi-bin/', '/.git/', '/.svn/',
        '/old/', '/temp/', '/tmp/', '/logs/', '/.well-known/security.txt'
    ];

    const results = {
        found: [],
        notFound: [],
        errors: []
    };

    // Función helper para hacer request con delay
    const checkPath = async (path) => {
        const url = `${fullUrl}${path}`;
        try {
            const response = await axios.get(url, {
                timeout: 5000,
                validateStatus: () => true, // No lanzar error por status codes
                headers: { 
                    'User-Agent': userAgent,
                    'Accept': '*/*'
                },
                maxRedirects: 0 // No seguir redirects para fuzzing
            });

            if (response.status >= 200 && response.status < 400) {
                results.found.push({ 
                    path: path, 
                    status: response.status,
                    size: response.headers['content-length'] || 'unknown'
                });
            } else {
                results.notFound.push({ 
                    path: path, 
                    status: response.status 
                });
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                results.errors.push({ 
                    path: path, 
                    status: 'Timeout',
                    error: 'Timeout' 
                });
            } else {
                results.errors.push({ 
                    path: path, 
                    status: 'Error', 
                    error: error.code || error.message 
                });
            }
        }
    };

    // Procesar paths en lotes para evitar sobrecargar
    const batchSize = 5;
    for (let i = 0; i < commonPaths.length; i += batchSize) {
        const batch = commonPaths.slice(i, i + batchSize);
        await Promise.all(batch.map(path => checkPath(path)));
        
        // Pequeño delay entre lotes
        if (i + batchSize < commonPaths.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    res.status(200).json({
        target: fullUrl,
        found: results.found,
        notFound: results.notFound,
        errors: results.errors,
        totalChecked: commonPaths.length,
        summary: {
            found: results.found.length,
            notFound: results.notFound.length,
            errors: results.errors.length
        }
    });
}
