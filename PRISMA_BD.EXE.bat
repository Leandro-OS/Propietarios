@echo off
:: Buscar y matar el proceso en el puerto 5555
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5555') do (
    taskkill /f /pid %%a 2>nul
)

echo Puerto 5555 liberado con exito.
pause

:: Ejecutar PRIMSA Gestor Base de datos de la aplicación PROPIETARIOS
cd /d "C:\Users\leaol\OneDrive\Documentos\PROPIETARIOS\backend"
npm run db:studio
pause
