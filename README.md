# 🛡️ Cyber Security Toolkit - Vercel Edition

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

Una aplicación web profesional de herramientas de ciberseguridad construida con Next.js y optimizada para Vercel.

[Demo en Vivo](#) | [Características](#características) | [Instalación](#instalación) | [Uso](#uso)

</div>

---

## 📋 Características

### Herramientas Incluidas

- **🔍 Escáner de Puertos**: Escanea puertos TCP comunes en hosts remotos
  - Escaneo rápido de puertos principales
  - Escaneo intenso para análisis profundo
  - Detección de servicios

- **🌐 Web Fuzzer**: Descubre directorios y archivos ocultos en sitios web
  - Búsqueda de rutas comunes
  - Detección de archivos sensibles
  - Análisis de códigos de respuesta

- **🗑️ DNS Dumpster**: Búsqueda exhaustiva de registros DNS
  - Registros A, AAAA, MX, NS, TXT, SOA, CNAME
  - Análisis de infraestructura de dominio
  - Detección de subdominios

- **🔧 Detector de Tecnología**: Identifica tecnologías web utilizadas
  - CMS, frameworks y librerías
  - Servidores web y lenguajes de programación
  - Análisis de stack tecnológico

### Características Técnicas

- ✅ **100% Responsivo**: Optimizado para móviles, tablets y desktop
- ✅ **Interfaz Moderna**: Diseño glassmorphism con efectos terminales
- ✅ **APIs Robustas**: Manejo completo de errores y timeouts
- ✅ **Logs en Tiempo Real**: Feedback instantáneo de operaciones
- ✅ **Performance Optimizada**: Rate limiting y procesamiento por lotes
- ✅ **Sin Dependencias Externas**: Todo funciona desde Vercel

---

## 🚀 Instalación

### Opción 1: Despliegue en Vercel (Recomendado)

#### Paso 1: Sube el código a GitHub

```bash
cd cyber-toolkit-vercel
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

#### Paso 2: Despliega desde Vercel

1. Ve a [vercel.com](https://vercel.com/) e inicia sesión con GitHub
2. Click en **"Add New..." → "Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es Next.js
5. Click en **"Deploy"**

¡Listo! Tu aplicación estará disponible en minutos.

---

### Opción 2: Ejecución Local

#### Requisitos

- Node.js 18+ (recomendado 20+)
- npm o yarn

#### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/cyber-toolkit-vercel.git
cd cyber-toolkit-vercel

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

#### Comandos Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm start        # Inicia servidor de producción
```

---

## 📱 Uso

### Escáner de Puertos

```
1. Introduce un dominio o IP (ejemplo: scanme.nmap.org)
2. Selecciona el tipo de escaneo
3. Click en "Iniciar Escaneo"
```

### Web Fuzzer

```
1. Introduce una URL completa (ejemplo: https://ejemplo.com)
2. Click en "Iniciar Fuzzing"
3. Espera los resultados (puede tardar 30-60 segundos)
```

### DNS Dumpster

```
1. Introduce solo el dominio (ejemplo: google.com)
2. Click en "Iniciar Búsqueda DNS"
3. Revisa los registros encontrados
```

### Detector de Tecnología

```
1. Introduce una URL completa
2. Click en "Analizar Tecnología"
3. Revisa las tecnologías detectadas organizadas por categoría
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno (Opcional)

Crea un archivo `.env.local` si necesitas configuración personalizada:

```env
# Timeout para requests (en milisegundos)
NEXT_PUBLIC_REQUEST_TIMEOUT=10000

# Número máximo de reintentos
NEXT_PUBLIC_MAX_RETRIES=3
```

### Personalización de APIs

Las APIs están en `/pages/api/`:
- `dns-dumpster.js`: Búsqueda DNS
- `scan-ports.js`: Escaneo de puertos
- `tech-detection.js`: Detección de tecnologías
- `web-fuzzer.js`: Fuzzing web

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS 3.4
- **APIs**: Axios, Simple-Wappalyzer
- **Deployment**: Vercel
- **External APIs**: 
  - Google DNS API
  - HackerTarget API

---

## 📊 Limitaciones Conocidas

- **Escáner de Puertos**: Utiliza HackerTarget API que tiene rate limiting
- **DNS Dumpster**: Depende de Google DNS API
- **Web Fuzzer**: Puede tardar en sitios lentos o con muchos archivos
- **Detector de Tecnología**: Requiere que el sitio sea accesible públicamente

---

## 🔒 Consideraciones de Seguridad

⚠️ **IMPORTANTE**: Esta herramienta es solo para:
- Uso educativo
- Pruebas en infraestructura propia
- Pentesting autorizado

**NO uses estas herramientas en sistemas sin autorización explícita.**

---

## 🐛 Solución de Problemas

### Error: "La API de HackerTarget requiere clave"
**Solución**: Espera unos minutos y reintenta. La API pública tiene límites.

### Error: "No se pudo resolver el dominio"
**Solución**: Verifica que el dominio sea válido y esté accesible.

### Error: "Timeout"
**Solución**: El sitio objetivo puede estar caído o ser muy lento. Reintenta más tarde.

### La aplicación no carga en móvil
**Solución**: Verifica que estés usando HTTPS y que la conexión sea estable.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Changelog

### v1.0.0 (2024)
- ✅ Lanzamiento inicial
- ✅ 4 herramientas principales
- ✅ Interfaz 100% responsiva
- ✅ Manejo robusto de errores
- ✅ Logs en tiempo real

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

---

## 👨‍💻 Autor

**Alex Mancía**

- GitHub: [@alexmancia](https://github.com/alexmancia)
- Proyecto: Cyber Security Toolkit

---

## 🙏 Agradecimientos

- Next.js por el excelente framework
- Vercel por el hosting gratuito
- Comunidad de ciberseguridad por el feedback

---

<div align="center">

⭐ Si este proyecto te fue útil, por favor considera darle una estrella ⭐

**[⬆ Volver arriba](#-cyber-security-toolkit---vercel-edition)**

</div>
