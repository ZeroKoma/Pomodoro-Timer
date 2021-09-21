document.addEventListener("DOMContentLoaded", function (event) {
  iniciar();
});

let fin4Pomodoros = false; // indica si se ha completado los 4 pomodoros
let CicloTrabajo = true; // true si crono tiempo trabajo - false descanso
let estadoPlay = true; // activa - desactiva botones
let estadoPause = false;
let estadoStop = false;
timer_is_on = 0; // si crono parado o no. para btn pausa.
let ciclo = 0; // nº de pomodoros
let wrkTime = 24; // 25 min de estudio/trabajo
let wrkPause = 4; // 5 min de descanso
let lastPause = 24; // último descanso al acabar los 4 pomodoros
let estadoCrono = "Parado"; // string pantalla indica trabajo o descanso
let x; // aux para crono
let segundos = 60;
let minutos = 0;
let stop = true; //si se pulsa btn Stop se inicializa todo
let title = "Pomodoro Timer:";
let options = { body: "Alarma disparada!" };
let tictacOnVolume = 1; // sonido tictac reloj apagado=0 volumen=1 +volumen=2
let alarmVolume = 1; // idem tictacOnVolume

function pedirPermiso() {
  Notification.requestPermission().then(function (result) {
    console.log("Permiso para notificaciones: ", result);
    console.log("Notification.permission === ", Notification.permission);
  });
}

function myClock() {
  document.getElementById("reloj").innerHTML = new Date().toLocaleTimeString();
}

/* I N I C I A L I Z A   P A N T A L L A  */
function iniciaPantalla() {
  if (!isMobile()) pedirPermiso();
  fin4Pomodoros = false;
  estadoCrono = "<b>Parado</b>";
  muestraEstado(estadoCrono);
  clearTimeout(x);
  timer_is_on = 0;
  CicloTrabajo = true;
  // wrkTime = 0;
  // wrkPause = 4;
  ciclo = 0;
  segundos = 60;
  minutos = wrkTime;
  estadoPlay = true;
  estadoPause = false;
  estadoStop = false;
  document.getElementById("minutos").innerHTML = "00";
  document.getElementById("segundos").innerHTML = "00";
  document.getElementById("btnInicio").style.border = "2px solid #A0906F";
  document.getElementById("btnPausa").style.border = "2px solid #A0906F";
  document.getElementById("btnStop").style.border = "1px solid #A0906F";
  document.getElementById("barraEstado1").style.backgroundImage =
    "url('./img/faviconGris.png')";
  document.getElementById("barraEstado2").style.backgroundImage =
    "url('./img/faviconGris.png')";
  document.getElementById("barraEstado3").style.backgroundImage =
    "url('./img/faviconGris.png')";
  document.getElementById("barraEstado4").style.backgroundImage =
    "url('./img/faviconGris.png')";
  document.getElementById("barraEstado1").style.border = "1px solid #A0906F";
  document.getElementById("svg-barraEstado1").style.display = "none";
  document.getElementById("barraEstado2").style.border = "1px solid #A0906F";
  document.getElementById("svg-barraEstado2").style.display = "none";
  document.getElementById("barraEstado3").style.border = "1px solid #A0906F";
  document.getElementById("svg-barraEstado3").style.display = "none";
  document.getElementById("barraEstado4").style.border = "1px solid #A0906F";
  document.getElementById("svg-barraEstado4").style.display = "none";
}

// muestra en pantalla estado crono: trabajando, descansando o parado.
function muestraEstado(dato) {
  document.getElementById("estadoCrono").style.textAlign = "center";
  document.getElementById("estadoCrono").innerHTML = dato;
}

// C R O N O
function crono(datoSeg, datoMin) {
  datoSeg = datoSeg - 1;
  tictac();
  segundos = datoSeg;
  controlador(datoSeg, datoMin);

  if (datoSeg < 0) {
    datoSeg = 59;
    datoMin -= 1;
    minutos = datoMin;
  }

  if (datoSeg < 10) {
    datoSeg = "0" + datoSeg;
  }
  if (datoMin < 10) {
    document.getElementById("minutos").innerHTML = "0" + datoMin;
  } else {
    document.getElementById("minutos").innerHTML = datoMin;
  }

  document.getElementById("segundos").innerHTML = datoSeg;

  if (!stop)
    x = setTimeout(function () {
      crono(datoSeg, datoMin);
    }, 1000);
}

// Cuando crono llega a cero tanto en tiempo de trabajo como de descanso
function isMobile() {
  // credit to Timothy Huang for this regex test:
  // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function controlador(datoSeg, datoMin) {
  if (datoSeg == 0 && datoMin == 0) {
    stop = true;
    if (!isMobile()) notifyMe(title, options);
    if (CicloTrabajo) {
      clearTimeout(x);
      segundos = 59;
      timer_is_on = 0;
      CicloTrabajo = false;
      estadoCrono = "Play para iniciar descanso";
      muestraEstado(estadoCrono);
      document.getElementById("btnInicio").style.border = "3px solid #A0906F";
      document.getElementById("btnPausa").style.border = "3px solid #A0906F";
      document.getElementById("btnStop").style.border = "1px solid #A0906F";
      alarma();
    } else {
      ciclo += 1;
      pintaCiclo(ciclo);
      if (ciclo >= 4) {
        finCuatroCiclos();
      } else {
        CicloTrabajo = true;
        clearTimeout(x);
        timer_is_on = 0;
        minutos = wrkTime;
        segundos = 59;
        estadoCrono = "Play para iniciar pomodoro " + (ciclo + 1);
        muestraEstado(estadoCrono);
        document.getElementById("btnInicio").style.border = "3px solid #A0906F";
        document.getElementById("btnPausa").style.border = "3px solid #A0906F";
        document.getElementById("btnStop").style.border = "1px solid #A0906F";
        alarma();
      }
    }
  }
}

// Dibuja los pomodoros. Antes de un ciclo (prePintaCiclo) pinta pomodoro rojo. Ciclo acabado pinta borde 2px y svg.
/* P I N T A   C I C L O */
function pintaCiclo(dato) {
  if (dato != 0 && dato <= 4) {
    switch (dato) {
      case 1:
        document.getElementById("barraEstado1").style.border =
          "2px solid #A0906F";
        document.getElementById("svg-barraEstado1").style.display = "block";
        break;
      case 2:
        document.getElementById("barraEstado2").style.border =
          "2px solid #A0906F";
        document.getElementById("svg-barraEstado2").style.display = "block";
        break;
      case 3:
        document.getElementById("barraEstado3").style.border =
          "2px solid #A0906F";
        document.getElementById("svg-barraEstado3").style.display = "block";
        break;
      case 4:
        document.getElementById("barraEstado4").style.border =
          "2px solid #A0906F";
        document.getElementById("svg-barraEstado4").style.display = "block";
        break;
    }
  }
}

/* P R E - P I N T A   C I C L O */
function prePintaCiclo(dato) {
  if (dato < 4) {
    switch (dato) {
      case 0:
        document.getElementById("barraEstado1").style.border =
          "2px solid #A0906F";
        document.getElementById("barraEstado1").style.backgroundImage =
          "url('./img/favicon.png')";
        break;
      case 1:
        document.getElementById("barraEstado2").style.border =
          "2px solid #A0906F";
        document.getElementById("barraEstado2").style.backgroundImage =
          "url('./img/favicon.png')";
        break;
      case 2:
        document.getElementById("barraEstado3").style.border =
          "2px solid #A0906F";
        document.getElementById("barraEstado3").style.backgroundImage =
          "url('./img/favicon.png')";
        break;
      case 3:
        document.getElementById("barraEstado4").style.border =
          "2px solid #A0906F";
        document.getElementById("barraEstado4").style.backgroundImage =
          "url('./img/favicon.png')";
        break;
    }
  }
}

// Se acaba ciclo de 4 pomodoros
function finCuatroCiclos() {
  estadoCrono = "Has finalizado los 4 pomodoros!";
  muestraEstado(estadoCrono);
  clearTimeout(x);
  timer_is_on = 0;
  stop = true;
  document.getElementById("minutos").innerHTML = "sdfasdfa00";
  document.getElementById("segundos").innerHTML = ":00";
  document.getElementById("btnInicio").style.border = "1px solid #A0906F";
  document.getElementById("btnPausa").style.border = "1px solid #A0906F";
  document.getElementById("btnStop").style.border = "3px solid #A0906F";
  document.getElementById("barraEstado4").style.backgroundImage =
    "url('./img/favicon.png')";
  alarma();
  ciclo = 0;
  fin4Pomodoros = true;
}

// alarma
function alarma() {
  var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
    keyboard: false,
  });
  myModal.show();
  estadoPlay = true;
  estadoPause = false;
  estadoStop = true;
  let audio = document.getElementById("audio1");
  audio.loop = true;
  switch (alarmVolume) {
    case 0:
      audio.volume = 0;
      break;
    case 1:
      audio.volume = 0.1;
      break;
    case 2:
      audio.volume = 0.4;
      break;
  }
  audio.play();
  document
    .getElementById("btnAlarma")
    .addEventListener("click", function pararAlarma() {
      audio.volume = 0;
      audio.loop = false;
    });
}

function tictac() {
  let audio = document.getElementById("audio2");
  switch (tictacOnVolume) {
    case 0:
      audio.volume = 0;
      break;
    case 1:
      audio.volume = 0.1;
      break;
    case 2:
      audio.volume = 0.5;
      break;
  }
  audio.play();
}

// Texto con ciclo actual en trabajo o descansando
function indicaCicloTxt(dato) {
  let x = document.getElementById("cicloPomodoro");
  x.innerHTML = "Pomodoro " + (ciclo + 1) + " de 4";
}

// Envia notificacion al desktop al sonar la alarma
function notifyMe(title, options) {
  console.log("Notification.permission === ", Notification.permission);
  if (!("Notification" in window)) {
    console.log("Este navegador que estas usando no soporta notificaciones.");
  } else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    new Notification(title, options);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  }
}

function changeTicTacVolume(userVolume) {
  switch (userVolume) {
    case "1":
      tictacOnVolume = 1;
      document.getElementById("tictacVolumeIcon").className =
        "bi bi-volume-down-fill tictacStyle";
      break;
    case "2":
      tictacOnVolume = 2;
      document.getElementById("tictacVolumeIcon").className =
        "bi bi-volume-up-fill tictacStyle";
      break;
    case "0":
      tictacOnVolume = 0;
      document.getElementById("tictacVolumeIcon").className =
        "bi bi-volume-mute-fill tictacStyle";
      break;
  }
}

function changeAlarmVolume(userVolume) {
  switch (userVolume) {
    case "1":
      alarmVolume = 1;
      document.getElementById("alarmVolumeIcon").className =
        "bi bi-volume-down-fill tictacStyle";
      break;
    case "2":
      alarmVolume = 2;
      document.getElementById("alarmVolumeIcon").className =
        "bi bi-volume-up-fill tictacStyle";
      break;
    case "0":
      alarmVolume = 0;
      document.getElementById("alarmVolumeIcon").className =
        "bi bi-volume-mute-fill tictacStyle";
      break;
  }
}

function changeWkrTime(userWkrTime) {
  document.getElementById("tiempoDeTrabajo").innerHTML = userWkrTime + "min";
  wrkTime = parseInt(userWkrTime) - 1;
}
function changeWkrPause(userWkrPause) {
  document.getElementById("tiempoDeDescanso").innerHTML = userWkrPause + "min";
  wrkPause = parseInt(userWkrPause) - 1;
}
function changeWkrLastPause(userWkrLastPause) {
  document.getElementById("tiempoUltimoDescanso").innerHTML =
    userWkrLastPause + "min";
  lastPause = parseInt(userWkrLastPause) - 1;
}

function iniciar() {
  let startClock = setInterval(function () {
    myClock();
  }, 1000);

  iniciaPantalla(); // inicializa todo a cero - estado parado

  // btn play
  document
    .getElementById("btnInicio")
    .addEventListener("click", function play() {
      if (estadoPlay) {
        if (fin4Pomodoros) {
          estadoPlay = true;
          estadoPause = false;
          estadoStop = false;
          iniciaPantalla();
          indicaCicloTxt("");
          stop = true;
        } else {
          if (timer_is_on == 0) {
            timer_is_on = 1;
            /*segundos = 59;*/
            if (CicloTrabajo) {
              estadoCrono = "En Pomodoro " + (ciclo + 1) + " - Trabajando";
              if (stop == true) {
                minutos = wrkTime;
              }
            } else {
              estadoCrono = "En Pomodoro " + (ciclo + 1) + " - Descansando";
              if (stop == true) {
                minutos = ciclo > 2 ? lastPause : wrkPause;
              }
            }
            stop = false;
            document.getElementById("btnInicio").style.border =
              "1px solid #A0906F";
            document.getElementById("btnPausa").style.border =
              "3px solid #A0906F";
            document.getElementById("btnStop").style.border =
              "3px solid #A0906F";
            muestraEstado(estadoCrono);
            prePintaCiclo(ciclo);
            indicaCicloTxt(ciclo);
            estadoPlay = false;
            estadoPause = true;
            estadoStop = true;
            crono(segundos, minutos);
          }
        }
      }
    });

  // btn pause
  document
    .getElementById("btnPausa")
    .addEventListener("click", function pause() {
      if (estadoPause) {
        clearTimeout(x);
        timer_is_on = 0;
        estadoCrono = "<b>En Pausa</b>";
        document.getElementById("btnInicio").style.border = "3px solid #A0906F";
        document.getElementById("btnPausa").style.border = "1px solid #A0906F";
        document.getElementById("btnStop").style.border = "3px solid #A0906F";
        muestraEstado(estadoCrono);
        estadoPlay = true;
        estadoPause = false;
        estadoStop = true;
      }
    });

  //btn stop
  document.getElementById("btnStop").addEventListener("click", function stop() {
    if (estadoStop) {
      estadoPlay = true;
      estadoPause = false;
      estadoStop = false;
      iniciaPantalla();
      let x = document.getElementById("cicloPomodoro");
      x.innerHTML = "Pomodoros:";
      stop = true;
    }
  });

  // btn open menu
  document
    .getElementById("AbreMenuLateral")
    .addEventListener("click", function () {
      document.getElementById("tiempoDeTrabajo").innerHTML =
        wrkTime + 1 + "min";
      document.getElementById("tiempoDeDescanso").innerHTML =
        wrkPause + 1 + "min";
      document.getElementById("tiempoUltimoDescanso").innerHTML =
        lastPause + 1 + "min";
    });

  // btn reset time
  document
    .getElementById("timeResetBtn")
    .addEventListener("click", function () {
      wrkTime = 24;
      wrkPause = 4;
      lastPause = 24;
      document.getElementById("tiempoDeTrabajo").innerHTML =
        wrkTime + 1 + "min";
      document.getElementById("wrkTimeSlider").value = wrkTime;
      document.getElementById("tiempoDeDescanso").innerHTML =
        wrkPause + 1 + "min";
      document.getElementById("wrkPauseSlider").value = wrkPause;
      document.getElementById("tiempoUltimoDescanso").innerHTML =
        lastPause + 1 + "min";
      document.getElementById("lastPauseSlider").value = lastPause;
    });

  // volumeResetBtn
  document
    .getElementById("volumeResetBtn")
    .addEventListener("click", function () {
      tictacOnVolume = 1;
      alarmVolume = 1;
      document.getElementById("alarmVolumeIcon").className =
        "bi bi-volume-down-fill tictacStyle";
      document.getElementById("alarmVolumeSlider").value = tictacOnVolume;
      document.getElementById("tictacVolumeIcon").className =
        "bi bi-volume-down-fill tictacStyle";
      document.getElementById("ticTacVolumeSlider").value = alarmVolume;
    });
} // fin corchete funcion iniciar
