# Spotify ad blocker for Windows

(EN) This little SCRIPT blocks spotify's ads. Tested on Windows 10 x64.
(ESP) Este pequeño SCRIPT bloquea la publicidad de spotify. Testeado en Windows 10 x64.

## Requirements:
* Node.js: https://nodejs.org/es/download/

## How to run it:
(EN) Open a Node.js's terminal and execute app.js. Done.
(ESP) Habre una terminal de Node.js y ejecuta app.js, listo.

## Used tools:
* Windows PowerShell
* node-powershell: https://www.npmjs.com/package/node-powershell
* NirCmd: http://www.nirsoft.net/utils/nircmd.html


## Como funciona
Lo que hace este script es obtener mediante Powershell el título de lo que se está reproduciendo en la aplicación de Spotify. Luego, mediante un timer que se inicia cada cierto tiempo (2 segundos) detecta si lo que se reproduce es publicidad, y si es así, entonces con el programa NirCmd silencia Spotify hasta que comience proxima canción.

### by Fabian Perez