@echo off
:: Buscar y matar el proceso en el puerto 20128
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :20128') do (
    taskkill /f /pid %%a 2>nul
)

echo Puerto 20128 liberado con exito.
pause

:: Ejecutar PRIMSA Gestor Base de datos de la aplicación PROPIETARIOS
cd .\backend"
omniroute
pause

