Instrucciones rápidas para desplegar en Vercel

Este proyecto usa Vite + React. Vercel detecta Vite automáticamente, pero puedes forzar la configuración con `vercel.json` incluido.

Pasos:

1. Subir el repositorio a GitHub/GitLab/Bitbucket.
2. En Vercel, crear un nuevo proyecto y conectar el repositorio.
3. Configuración recomendada (Vercel detecta por defecto):
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. (Opcional) El archivo `vercel.json` ya incluido fija `dist` como directorio de salida.

Prueba local:

```bash
npm install
npm run build
npm run preview
```

Si deseas, puedo crear una Pull Request con `vercel.json` y `README-vercel.md` o ayudarte a vincular el repo a Vercel desde tu cuenta.
