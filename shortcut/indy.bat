@echo off

REM Start the CMS in a new terminal
echo Starting front...
start cmd /k "cd /d D:\Inern-task\indy_soft_wash\frontend && npm run dev"

REM Start the CMS Server in a new terminal
echo Starting Server...
start cmd /k "cd /d D:\Inern-task\indy_soft_wash\server && nodemon app.js"

REM Notify success
echo CMS and Server processes have been started successfully.

exit
