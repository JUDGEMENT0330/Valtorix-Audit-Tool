import Head from 'next/head';
import { useState } from 'react';

const TabButton = ({ tabName, activeTab, setActiveTab, label, icon }) => (
    <button 
        onClick={() => setActiveTab(tabName)} 
        className={`tab-button flex-1 min-w-[120px] px-3 py-3 transition-all duration-300 text-xs sm:text-sm font-medium rounded-md ${
            activeTab === tabName 
                ? 'active text-white bg-opacity-20' 
                : 'text-gray-400 hover:text-white hover:bg-opacity-10'
        }`}
    >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden text-lg">{icon}</span>
    </button>
);

const LogPanel = ({ logs }) => (
    <div className="bg-black rounded-md p-3 sm:p-4 h-48 sm:h-64 overflow-y-auto mb-4 border border-gray-700 font-mono text-xs sm:text-sm">
        {logs.length === 0 ? (
            <div className="text-gray-600 text-center py-8">
                Esperando resultados...
            </div>
        ) : (
            logs.map((entry, index) => {
                let colorClass = 'text-gray-400';
                if (entry.type === 'error') colorClass = 'text-red-500 font-bold';
                if (entry.type === 'success') colorClass = 'text-green-400 font-bold';
                if (entry.type === 'open') colorClass = 'text-red-400';
                if (entry.type === 'found') colorClass = 'text-yellow-500';
                if (entry.type === 'warning') colorClass = 'text-orange-400';

                return (
                    <div key={index} className={`mb-1 ${colorClass} break-words`}>
                        <span className="text-gray-600 text-xs">[{entry.timestamp}]</span> {entry.message}
                    </div>
                );
            })
        )}
    </div>
);

const PortScanner = ({ useApi }) => {
    const [target, setTarget] = useState('');
    const [scanType, setScanType] = useState('quick');
    const { logs, results, loading, handleApiCall, logMessage } = useApi('port');

    const startScan = async () => {
        if (!target.trim()) {
            alert('Por favor, introduce un objetivo válido');
            return;
        }
        
        logMessage('🔍 Iniciando escaneo de puertos...', 'info');
        const data = await handleApiCall('scan-ports', { target, scanType });
        
        if (data) {
            if (data.ports && data.ports.length > 0) {
                logMessage(`✅ Encontrados ${data.ports.length} puertos abiertos`, 'success');
                data.ports.forEach(port => {
                    logMessage(`Puerto ${port.port}/${port.protocol} ABIERTO - ${port.service}`, 'open');
                });
            } else if (data.message) {
                logMessage(data.message, 'warning');
            }
        }
    };

    return (
        <div>
            <div className="glassmorphism rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold terminal-text mb-4 flex items-center gap-2">
                    <span>🔍</span>
                    <span className="break-words">Escáner de Puertos</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <input 
                        type="text" 
                        value={target} 
                        onChange={e => setTarget(e.target.value)} 
                        placeholder="ejemplo.com o 192.168.1.1" 
                        className="w-full rounded-md px-3 sm:px-4 py-2 focus:outline-none text-sm sm:text-base"
                        disabled={loading}
                    />
                    <select 
                        value={scanType} 
                        onChange={e => setScanType(e.target.value)} 
                        className="w-full rounded-md px-3 sm:px-4 py-2 focus:outline-none text-sm sm:text-base"
                        disabled={loading}
                    >
                        <option value="quick">Escaneo Rápido</option>
                        <option value="intense">Escaneo Intenso</option>
                        <option value="all">Escaneo Ampliado (Top 1024)</option>
                    </select>
                </div>
                <button 
                    onClick={startScan} 
                    disabled={loading} 
                    className="glow-button font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full sm:w-auto text-sm sm:text-base"
                >
                    {loading ? '⏳ Escaneando...' : '🚀 Iniciar Escaneo'}
                </button>
            </div>
            
            {(loading || logs.length > 0) && (
                <div className="glassmorphism rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold terminal-text mb-4">📊 Resultados del Escaneo</h3>
                    <LogPanel logs={logs} />
                    {results && results.ports && results.ports.length > 0 && (
                        <div className="glassmorphism rounded-md p-3 sm:p-4 mt-4">
                            <h4 className="text-base sm:text-lg font-bold terminal-text mb-3">Resumen</h4>
                            <div className="space-y-2 text-sm sm:text-base">
                                <p>
                                    <span className="text-gray-400">Host: </span>
                                    <span className="text-white font-mono break-all">{results.host}</span>
                                </p>
                                <p>
                                    <span className="text-gray-400">Puertos Abiertos: </span>
                                    <span className="text-red-500 font-bold">{results.totalOpen || results.ports.length}</span>
                                </p>
                                <div className="text-red-400 text-xs sm:text-sm font-mono break-all">
                                    {results.ports.map(p => `${p.port}/${p.protocol}`).join(', ')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const WebFuzzer = ({ useApi }) => {
    const [target, setTarget] = useState('');
    const { logs, results, loading, handleApiCall, logMessage } = useApi('fuzzer');

    const startFuzzing = async () => {
        if (!target.trim()) {
            alert('Por favor, introduce una URL válida');
            return;
        }
        
        logMessage('🌐 Iniciando fuzzing web...', 'info');
        const data = await handleApiCall('web-fuzzer', { target });
        
        if (data && data.found) {
            logMessage(`✅ Se encontraron ${data.found.length} rutas accesibles`, 'success');
            data.found.forEach(item => {
                logMessage(`[${item.status}] ${item.path} (${item.size} bytes)`, 'found');
            });
            
            if (data.errors && data.errors.length > 0) {
                logMessage(`⚠️ ${data.errors.length} rutas con error`, 'warning');
            }
        }
    };

    return (
        <div>
            <div className="glassmorphism rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold terminal-text mb-4 flex items-center gap-2">
                    <span>🌐</span>
                    <span className="break-words">Web Fuzzer</span>
                </h2>
                <input 
                    type="text" 
                    value={target} 
                    onChange={e => setTarget(e.target.value)} 
                    placeholder="https://ejemplo.com" 
                    className="w-full mb-4 rounded-md px-3 sm:px-4 py-2 focus:outline-none text-sm sm:text-base"
                    disabled={loading}
                />
                <button 
                    onClick={startFuzzing} 
                    disabled={loading} 
                    className="glow-button font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full sm:w-auto text-sm sm:text-base"
                >
                    {loading ? '⏳ Buscando...' : '🚀 Iniciar Fuzzing'}
                </button>
            </div>
            
            {(loading || logs.length > 0) && (
                <div className="glassmorphism rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold terminal-text mb-4">📊 Resultados del Fuzzing</h3>
                    <LogPanel logs={logs} />
                    {results && results.summary && (
                        <div className="glassmorphism rounded-md p-3 sm:p-4 mt-4">
                            <h4 className="text-base sm:text-lg font-bold terminal-text mb-3">Resumen</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
                                <div className="text-center p-2 sm:p-3 bg-black bg-opacity-30 rounded">
                                    <div className="text-yellow-500 font-bold text-lg sm:text-2xl">{results.summary.found}</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">Encontradas</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-black bg-opacity-30 rounded">
                                    <div className="text-gray-500 font-bold text-lg sm:text-2xl">{results.summary.notFound}</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">No Encontradas</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-black bg-opacity-30 rounded col-span-2 sm:col-span-1">
                                    <div className="text-red-400 font-bold text-lg sm:text-2xl">{results.summary.errors}</div>
                                    <div className="text-gray-400 text-xs sm:text-sm">Errores</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const DnsDumpster = ({ useApi }) => {
    const [target, setTarget] = useState('');
    const { logs, results, loading, handleApiCall, logMessage } = useApi('dns');

    const startScan = async () => {
        if (!target.trim()) {
            alert('Por favor, introduce un dominio válido');
            return;
        }
        
        logMessage('🗑️ Iniciando búsqueda DNS...', 'info');
        const data = await handleApiCall('dns-dumpster', { target });
        
        if (data) {
            if (data.results && Object.keys(data.results).length > 0) {
                Object.entries(data.results).forEach(([type, records]) => {
                    if (records && records.length > 0) {
                        logMessage(`✅ Encontrados ${records.length} registros ${type}`, 'success');
                        records.forEach(record => {
                            logMessage(`${type}: ${record}`, 'found');
                        });
                    }
                });
            } else if (data.message) {
                logMessage(data.message, 'warning');
            }
        }
    };

    return (
        <div>
            <div className="glassmorphism rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold terminal-text mb-4 flex items-center gap-2">
                    <span>🗑️</span>
                    <span className="break-words">DNS Dumpster</span>
                </h2>
                <input 
                    type="text" 
                    value={target} 
                    onChange={e => setTarget(e.target.value)} 
                    placeholder="ejemplo.com" 
                    className="w-full mb-4 rounded-md px-3 sm:px-4 py-2 focus:outline-none text-sm sm:text-base"
                    disabled={loading}
                />
                <button 
                    onClick={startScan} 
                    disabled={loading} 
                    className="glow-button font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full sm:w-auto text-sm sm:text-base"
                >
                    {loading ? '⏳ Buscando...' : '🚀 Iniciar Búsqueda DNS'}
                </button>
            </div>
            
            {(loading || logs.length > 0) && (
                <div className="glassmorphism rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold terminal-text mb-4">📊 Resultados de DNS</h3>
                    <LogPanel logs={logs} />
                    {results && results.results && Object.keys(results.results).length > 0 && (
                        <div className="glassmorphism rounded-md p-3 sm:p-4 mt-4">
                            <h4 className="text-base sm:text-lg font-bold terminal-text mb-3">Registros DNS Encontrados</h4>
                            <div className="space-y-3 sm:space-y-4">
                                {Object.entries(results.results).map(([type, records]) => (
                                    records && records.length > 0 && (
                                        <div key={type} className="bg-black bg-opacity-30 p-2 sm:p-3 rounded">
                                            <h5 className="text-green-400 font-semibold mb-2 text-sm sm:text-base">{type} Records</h5>
                                            <ul className="list-disc list-inside text-yellow-500 space-y-1 text-xs sm:text-sm">
                                                {records.map((record, i) => (
                                                    <li key={i} className="break-all font-mono">{record}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TechDetector = ({ useApi }) => {
    const [target, setTarget] = useState('');
    const { logs, results, loading, handleApiCall, logMessage } = useApi('tech');

    const startScan = async () => {
        if (!target.trim()) {
            alert('Por favor, introduce una URL válida');
            return;
        }
        
        logMessage('🔧 Iniciando análisis de tecnologías...', 'info');
        const data = await handleApiCall('tech-detection', { target });
        
        if (data) {
            if (data.technologies && data.technologies.length > 0) {
                logMessage(`✅ Detectadas ${data.technologies.length} tecnologías`, 'success');
                data.technologies.forEach(tech => {
                    logMessage(`📦 ${tech.name} - ${tech.categories.map(c => c.name).join(', ')}`, 'found');
                });
            } else if (data.message) {
                logMessage(data.message, 'warning');
            }
        }
    };

    return (
        <div>
            <div className="glassmorphism rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold terminal-text mb-4 flex items-center gap-2">
                    <span>🔧</span>
                    <span className="break-words">Detector de Tecnología</span>
                </h2>
                <input 
                    type="text" 
                    value={target} 
                    onChange={e => setTarget(e.target.value)} 
                    placeholder="https://ejemplo.com" 
                    className="w-full mb-4 rounded-md px-3 sm:px-4 py-2 focus:outline-none text-sm sm:text-base"
                    disabled={loading}
                />
                <button 
                    onClick={startScan} 
                    disabled={loading} 
                    className="glow-button font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md w-full sm:w-auto text-sm sm:text-base"
                >
                    {loading ? '⏳ Analizando...' : '🚀 Analizar Tecnología'}
                </button>
            </div>
            
            {(loading || logs.length > 0) && (
                <div className="glassmorphism rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold terminal-text mb-4">📊 Análisis de Tecnología</h3>
                    <LogPanel logs={logs} />
                    {results && results.technologies && results.technologies.length > 0 && (
                        <div className="glassmorphism rounded-md p-3 sm:p-4 mt-4">
                            <h4 className="text-base sm:text-lg font-bold terminal-text mb-3">Tecnologías Detectadas</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                {results.technologies.reduce((acc, tech) => {
                                    tech.categories.forEach(cat => {
                                        if (!acc[cat.name]) acc[cat.name] = [];
                                        acc[cat.name].push(tech.name);
                                    });
                                    return acc;
                                }, {}) 
                                && Object.entries(results.technologies.reduce((acc, tech) => {
                                    tech.categories.forEach(cat => {
                                        if (!acc[cat.name]) acc[cat.name] = [];
                                        acc[cat.name].push(tech.name);
                                    });
                                    return acc;
                                }, {})).map(([category, techs]) => (
                                    <div key={category} className="bg-black bg-opacity-30 p-2 sm:p-3 rounded">
                                        <h5 className="text-green-400 font-semibold mb-2">{category}</h5>
                                        <p className="text-yellow-500 break-words">{techs.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function HomePage() {
    const [activeTab, setActiveTab] = useState('port-scanner');
    
    const [logs, setLogs] = useState({ port: [], fuzzer: [], tech: [], dns: [] });
    const [results, setResults] = useState({ port: null, fuzzer: null, tech: null, dns: null });
    const [loading, setLoading] = useState({ port: false, fuzzer: false, tech: false, dns: false });

    const useApi = (logType) => {
        const logMessage = (message, type = 'info') => {
            const timestamp = new Date().toLocaleTimeString();
            setLogs(prev => ({ ...prev, [logType]: [...prev[logType], { timestamp, message, type }] }));
        };

        const handleApiCall = async (api, body) => {
            setLoading(prev => ({ ...prev, [logType]: true }));
            setResults(prev => ({ ...prev, [logType]: null }));
            setLogs(prev => ({ ...prev, [logType]: [] }));
            logMessage(`🔄 Iniciando análisis en ${body.target}...`);

            try {
                const response = await fetch(`/api/${api}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || data.details || 'Error en el servidor');
                }
                
                setResults(prev => ({ ...prev, [logType]: data }));
                
                if (data.error) {
                    logMessage(`⚠️ ${data.error}`, 'warning');
                } else {
                    logMessage('✅ Análisis completado exitosamente', 'success');
                }
                
                return data;
            } catch (error) {
                logMessage(`❌ Error: ${error.message}`, 'error');
                return null;
            } finally {
                setLoading(prev => ({ ...prev, [logType]: false }));
            }
        };

        return { logs: logs[logType], results: results[logType], loading: loading[logType], handleApiCall, logMessage };
    };

    const tabs = [
        { id: 'port-scanner', label: '🔍 Escáner de Puertos', icon: '🔍', Component: PortScanner },
        { id: 'web-fuzzer', label: '🌐 Web Fuzzer', icon: '🌐', Component: WebFuzzer },
        { id: 'dns-dumpster', label: '🗑️ DNS Dumpster', icon: '🗑️', Component: DnsDumpster },
        { id: 'tech-detector', label: '🔧 Detector de Tecnología', icon: '🔧', Component: TechDetector },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.Component;

    return (
        <>
            <Head>
                <title>Cyber Security Toolkit - Herramientas de Ciberseguridad</title>
                <meta name="description" content="Herramientas profesionales de ciberseguridad y análisis web" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            
            <main className="min-h-screen container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold terminal-text mb-2 break-words px-2">
                        CYBER SECURITY TOOLKIT
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 opacity-80 px-2">
                        Herramientas de Penetración y Análisis Web
                    </p>
                </div>

                <div className="glassmorphism rounded-lg p-2 mb-4 sm:mb-6 overflow-x-auto">
                    <div className="flex gap-1 sm:gap-2 min-w-max sm:min-w-0">
                        {tabs.map(tab => (
                            <TabButton 
                                key={tab.id} 
                                tabName={tab.id} 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab} 
                                label={tab.label}
                                icon={tab.icon}
                            />
                        ))}
                    </div>
                </div>

                {ActiveComponent && <ActiveComponent useApi={useApi} />}

                <footer className="text-center mt-8 sm:mt-12 text-xs sm:text-sm text-gray-600 px-2">
                    <p>⚠️ Solo para uso educativo y pruebas autorizadas</p>
                    <p className="mt-2">© 2024 Cyber Security Toolkit</p>
                </footer>
            </main>
        </>
    );
}
