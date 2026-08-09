@echo off
:: Buscar y matar el proceso en el puerto 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a 2>nul
)

echo Puerto 5173 liberado con exito.
pause

:: Ejecutar FRONTEBD aplicación PROPIETARIOS
cd /d "C:\Users\leaol\OneDrive\Documentos\PROPIETARIOS\frontend"
npm run dev
pause
