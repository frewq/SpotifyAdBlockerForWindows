//tengo que normalizarlo
//tengo que detectar la carpeta del usuario activo, en la carpeta de usuario pueden haber varias carpeta, tengo que detectar la activa y tomar el nombre de usuario
// usar fs.readdirSync en el directorio de usuarios
// console.log(`${process.env.APPDATA}/Spotify`)


// TODOgi
// regexp para el path de ad-state-storage
// Spotify a veces se cuelga en los estados MainWindowTitleSpotify o MainWindowTitleAdvertisement, no es culpa de este programa si no de la aplicacion oficial. Buscaré una solución. Pensé en usar hotkeys de windows para pausar y darle play automaticamente si pasa algún tiempo en esos estados. MainWindowTitleSpotifyFree es el estado que se activa si manualmente pauso la aplicación.

// https://stackoverflow.com/questions/13206724/how-to-get-the-list-of-process

// https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/
// https://www.npmjs.com/package/node-watch

// C:\Users\Fabian\AppData\Roaming\Spotify\Users\mrfrewq-user
// -ad-state-storage.bnk (creo que tengo trabajar con este)
// 	cuando hay un cambio de cancion se actualiza
// 	cuando pauso y le doy play se actualiza 
// 		(se actualiza al darle play no al pausar)
// -pending-messages
// 	aparece cuando se esta ejecutando una cancion
// 	desaparece cuando se cierra spotify o hay un se escucha un ad
// 	se actualiza constantemente
// 	cuando pauso y le doy play se actualiza


const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const Shell = require('node-powershell');

let directorioActivo = ''

//Encuentro el archivo 'ad-state-storage.bnk' del usuario activo. El usuario activo se lo puede distinguir porque es el único que tiene el archivo 'pending-messages' en su directorio personal
let listaUsuarios = fs.readdirSync(path.normalize(process.env.APPDATA + `/Spotify/Users`))
listaUsuarios.map( (usuario) => {
  let carpetaUsuario = fs.readdirSync(path.normalize(process.env.APPDATA + `/Spotify/Users/${usuario}`));
  carpetaUsuario.map( (archivo_pending_messages) => {
    if (archivo_pending_messages === 'pending-messages') {
      directorioActivo = path.normalize(process.env.APPDATA + `/Spotify/Users/${usuario}/ad-state-storage.bnk`)
      console.log('este es el directorio activo:', directorioActivo)
    }
  })
})


const programs = [{ program: path.normalize(`"nircmdc.exe"`),
                    log: directorioActivo
                  }];

const spotifyfile = String(programs.map( (changes) => changes.log ));

console.log(`Watching for file changes on ${spotifyfile}`);

let fsWait = false;
fs.watch(spotifyfile, (event, filename) => {
  if (filename) {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      silencer();
      fsWait = false;
    }, 100);
    // console.log(`${filename} file Changed`);
  }
});

const silencer = (function(){
  let ads = "";
  console.log("Spotify adblocker is running");
  return () =>  { 

    const powershell = new Shell({
      verbose: false,
      executionPolicy: 'Bypass',
      noProfile: true
    });

    powershell.addCommand('Get-Process -Name Spotify | where-Object {$_.mainWindowTitle}  | Format-List mainWindowtitle');
    powershell.invoke()
    .then(title => {
      title = title.replace(/(\W)/gi, "");
      if (ads != title){
        ads = title;
        ((ads == 'MainWindowTitleSpotify') || (ads == 'MainWindowTitleAdvertisement'))? mute(): unmute();
      }
      powershell.dispose();
    })
    .catch( () => process.exit(1) )
}})();

function mute(){
  programs.map( start => {
    exec( start.program + " muteappvolume Spotify.exe 1" )
    },(error) => console.error('Algo ha fallado:', error)
  )
};

function unmute(){
  programs.map( start => {
    exec( start.program + " muteappvolume Spotify.exe 0" )
    },(error) => console.error('Algo ha fallado:', error)
  )
};