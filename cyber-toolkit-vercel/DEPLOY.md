# 🚀 GUÍA RÁPIDA DE DESPLIEGUE

## Método 1: Despliegue en Vercel (5 minutos)

### Paso 1: Preparar GitHub
```bash
# En tu terminal, navega a la carpeta del proyecto
cd cyber-toolkit-vercel

# Inicializar git
git init -b main

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Cyber Security Toolkit"
```

### Paso 2: Subir a GitHub
```bash
# Reemplaza TU-USUARIO y TU-REPO con tus datos
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

### Paso 3: Desplegar en Vercel
1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Click en **"Add New..."** → **"Project"**
4. Selecciona tu repositorio
5. Click en **"Deploy"**

✅ ¡Listo! Tu app estará en línea en 2-3 minutos.

---

## Método 2: Ejecución Local (2 minutos)

### Requisitos:
- Node.js 18+ instalado

### Pasos:
```bash
# 1. Navegar a la carpeta
cd cyber-toolkit-vercel

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev
```

✅ Abre http://localhost:3000 en tu navegador

---

## ⚡ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm start            # Inicia servidor de producción

# Git
git status           # Ver cambios
git add .            # Añadir cambios
git commit -m "msg"  # Guardar cambios
git push             # Subir a GitHub
```

---

## 🔍 Verificar que Todo Funciona

Después de desplegar, prueba cada herramienta:

### 1. Escáner de Puertos
```
Objetivo: scanme.nmap.org
Tipo: Escaneo Rápido
Resultado esperado: Varios puertos abiertos
```

### 2. Web Fuzzer
```
Objetivo: https://example.com
Resultado esperado: Rutas como /robots.txt, /sitemap.xml
```

### 3. DNS Dumpster
```
Objetivo: google.com
Resultado esperado: Registros A, MX, NS, TXT, etc.
```

### 4. Detector de Tecnología
```
Objetivo: https://github.com
Resultado esperado: Ruby, Nginx, etc.
```

---

## 🐛 Solución Rápida de Problemas

### "Error al instalar dependencias"
```bash
# Limpiar cache de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "Puerto 3000 ocupado"
```bash
# Usar otro puerto
PORT=3001 npm run dev
```

### "Error de Git"
```bash
# Verificar configuración
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### "Error en Vercel"
- Verifica que el repositorio sea público
- Asegúrate de que todos los archivos estén commiteados
- Revisa los logs en el dashboard de Vercel

---

## 📞 Necesitas Ayuda?

1. **Revisa los logs**: Siempre empezar por aquí
2. **Lee el README.md**: Documentación completa
3. **Revisa CHANGELOG.md**: Lista de cambios y correcciones

---

## ✅ Checklist Pre-Despliegue

- [ ] Todos los archivos están en la carpeta correcta
- [ ] package.json existe y tiene todas las dependencias
- [ ] No hay archivos .env.local si no son necesarios
- [ ] .gitignore excluye node_modules
- [ ] El código compila sin errores: `npm run build`
- [ ] Git está configurado correctamente
- [ ] Repositorio de GitHub está creado

---

## 🎉 ¡Éxito!

Si tu aplicación está funcionando:
- ✅ Todas las herramientas responden
- ✅ La interfaz se ve bien en móvil
- ✅ No hay errores en la consola
- ✅ Los logs se muestran correctamente

**¡Felicitaciones! Tu Cyber Security Toolkit está en producción.** 🚀

---

## 🔄 Actualizar Tu Aplicación

Cuando hagas cambios:

```bash
# 1. Hacer cambios en el código
# 2. Guardar en Git
git add .
git commit -m "Descripción de cambios"
git push

# Vercel detectará los cambios y desplegará automáticamente
```

---

## 💡 Tips Finales

1. **URLs Personalizadas**: En Vercel → Settings → Domains
2. **Analytics**: Vercel incluye analytics gratis
3. **HTTPS**: Automático con Vercel
4. **Performance**: Revisa Vercel Analytics para optimizar

---

**¿Todo funcionando?** → [Volver al README](README.md)
**¿Problemas?** → Revisa los logs y el CHANGELOG.md
