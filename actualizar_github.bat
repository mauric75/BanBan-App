@echo off
echo ========================================
echo Actualizando repositorio en GitHub...
echo ========================================

cd /d C:\Proyectos\temapelu\deepseek\banban-app

git checkout main
git pull origin main --rebase
git add .
git commit -m "Actualizacion automatica - %date% %time%"
git push origin main

echo ========================================
echo Actualizacion completada.
echo ========================================
pause