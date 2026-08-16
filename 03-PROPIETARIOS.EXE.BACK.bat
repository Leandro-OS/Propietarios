@echo off
:: Buscar y matar el proceso en el puerto 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    taskkill /f /pid %%a 2>nul
)

echo Puerto 3001 liberado con exito.
pause

:: Ejecutar BACKEND aplicación PROPIETARIOS
cd .\backend"
npm run dev
pause
