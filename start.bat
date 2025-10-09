@echo off
TITLE WeatherHDS Server

cd /d "%~dp0"

IF NOT EXIST node_modules (
    echo Installing dependencies...
    npm install
)

echo Starting the application...
npm start

pause