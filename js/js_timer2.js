function iniciar() {
  let fin4Pomodoros = false; // indica si se ha completado los 4 pomodoros
  let CicloTrabajo = true; // true si crono tiempo trabajo - false descanso
  let estadoPlay = true; // activa - desactiva botones
  let estadoPause = false;
  let estadoStop = false;
  timer_is_on = 0; // si crono parado o no. para btn pausa.
  let ciclo = 0; // nº de pomodoros
  let wrkTime = 25; // 25 min de estudio/trabajo
  let wrkPause = 4; // 5 min de descanso
  let estadoCrono = "Parado"; // string pantalla indica trabajo o descanso
  let x; // aux para crono
  let segundos = 60;
  let minutos = 0;
  let stop = true; //si se pulsa btn Stop se inicializa todo
  let title = "Pomodoro Timer:";
  let options = { body: "Alarma disparada!" };
  function pedirPermiso() {
    Notification.requestPermission().then(function (result) {
      console.log("Permiso para notificaciones: ", result);
      console.log("Notification.permission === ", Notification.permission);
    });
  }
  let tictacOn = 1; // sonido tictac reloj apagado=0 volumen=1 +volumen=2

  // F U N C I O N E S

  /* R E L O J */

  let startClock = setInterval(function () {
    myClock();
  }, 1000);

  function myClock() {
    document.getElementById("reloj").innerHTML =
      new Date().toLocaleTimeString();
  }

  /* I N I C I A L I Z A   P A N T A L L A  */

  function iniciaPantalla() {
    pedirPermiso();
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
    document.getElementById("btnInicio").style.border = "3px solid #A0906F";
    document.getElementById("btnPausa").style.border = "3px solid #A0906F";
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
    document.getElementById("barraEstado2").style.border = "1px solid #A0906F";
    document.getElementById("barraEstado3").style.border = "1px solid #A0906F";
    document.getElementById("barraEstado4").style.border = "1px solid #A0906F";
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
      }, 10);
  }

  // Cuando crono llega a cero tanto en tiempo de trabajo como de descanso

  function controlador(datoSeg, datoMin) {
    if (datoSeg == 0 && datoMin == 0) {
      stop = true;
      notifyMe(title, options);
      if (CicloTrabajo) {
        clearTimeout(x);
        minutos = wrkPause;
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
          estadoCrono = "Play para iniciar ciclo " + (ciclo + 1);
          muestraEstado(estadoCrono);
          document.getElementById("btnInicio").style.border =
            "3px solid #A0906F";
          document.getElementById("btnPausa").style.border =
            "3px solid #A0906F";
          document.getElementById("btnStop").style.border = "1px solid #A0906F";

          alarma();
        }
      }
    }
  }

  // Dibuja los pomodoros. Antes de un ciclo (prePintaCiclo) pinta borde mas fuerte. Ciclo acabado pinta pomodoro rojo.

  /* P I N T A   C I C L O */

  function pintaCiclo(dato) {
    if (dato != 0 && dato <= 4) {
      switch (dato) {
        case 1:
          document.getElementById("barraEstado1").style.backgroundImage =
            "url('./img/favicon.png')";
          break;
        case 2:
          document.getElementById("barraEstado2").style.backgroundImage =
            "url('./img/favicon.png')";
          break;
        case 3:
          document.getElementById("barraEstado3").style.backgroundImage =
            "url('./img/favicon.png')";
          break;
        case 4:
          document.getElementById("barraEstado4").style.backgroundImage =
            "url('./img/favicon.png')";
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
            "3px solid #A0906F";

          break;
        case 1:
          document.getElementById("barraEstado2").style.border =
            "3px solid #A0906F";

          break;
        case 2:
          document.getElementById("barraEstado3").style.border =
            "3px solid #A0906F";

          break;
        case 3:
          document.getElementById("barraEstado4").style.border =
            "3px solid #A0906F";

          break;
      }
    }
  }

  // Se acaba ciclo de 4 pomodoros

  function finCuatroCiclos() {
    estadoCrono = "Has finalizado los 4 ciclos!";
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
    document.getElementById("alarma").style.visibility = "visible";
    estadoPlay = true;
    estadoPause = false;
    estadoStop = true;
    let audio = document.getElementById("audio1");
    audio.loop = true;
    audio.volume = 1;
    audio.play();
    document
      .getElementById("btnAlarma")
      .addEventListener("click", function pararAlarma() {
        document.getElementById("alarma").style.visibility = "hidden";
        audio.volume = 0;
        audio.loop = false;
      });
    document.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        document.getElementById("alarma").style.visibility = "hidden";
        audio.volume = 0;
        audio.loop = false;
      }
    });
  }

  function tictac() {
    let audio = document.getElementById("audio2");
    switch (tictacOn) {
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
    x.innerHTML = "Ciclo " + (ciclo + 1) + " de 4 Pomodoros";
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

  // S C R I P T

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
              estadoCrono = "Ciclo: " + (ciclo + 1) + " - Trabajando";
              if (stop == true) {
                minutos = wrkTime;
              }
            } else {
              estadoCrono = "Ciclo: " + (ciclo + 1) + " - Descansando";
              if (stop == true) {
                minutos = wrkPause;
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
      x.innerHTML = "Ciclo de 4 Pomodoros";
      stop = true;
    }
  });

  // btn tic tac on/off

  document.getElementById("tictacId").addEventListener("click", function () {
    switch (tictacOn) {
      case 0:
        tictacOn = 1;
        document.getElementById("tictacId").className =
          "glyphicon glyphicon-volume-down";
        break;
      case 1:
        tictacOn = 2;
        document.getElementById("tictacId").className =
          "glyphicon glyphicon-volume-up";
        break;
      case 2:
        tictacOn = 0;
        document.getElementById("tictacId").className =
          "glyphicon glyphicon-volume-off";
        break;
    }

    document.getElementById("tictacId").style.cursor = "pointer";
    document.getElementById("tictacId").style.fontSize = "25px";
  });
} // fin corchete funcion iniciar
