function iniciar() {
    var fin4Pomodoros = false; // indica si se ha completado los 4 pomodoros
    var CicloTrabajo = true; // true si crono tiempo trabajo - false descanso
    var estadoPlay = true; // activa - desactiva botones
    var estadoPause = false;
    var estadoStop = false;
    timer_is_on = 0; // si crono parado o no. para btn pausa.
    var ciclo = 0; // nº de pomodoros
    var wrkTime = 24; // 25 min de estudio/trabajo
    var wrkPause = 4; // 5 min de descanso
    var estadoCrono = "Parado"; // string pantalla indica trabajo o descanso
    var x; // aux para crono 
    var segundos = 60;
    var minutos = 0;
    var stop = true; //si se pulsa btn Stop se inicializa todo
    var title = "Pomodoro Timer:";
    var options = { body: "Alarma disparada!" };
    var fondo = "negro";
    var permiso = Notification.requestPermission().then(function(result) {
        console.log(result);
    });

    // F U N C I O N E S

    /* R E L O J */

    var myVar = setInterval(function() { myClock() }, 1000);

    function myClock() {
        document.getElementById("reloj").innerHTML =
            new Date().toLocaleTimeString();
    }

    /* I N I C I A L I Z A   P A N T A L L A  */

    function iniciaPantalla() {
        fin4Pomodoros = false;
        estadoCrono = "<b>Parado</b>";
        muestraEstado(estadoCrono);
        clearTimeout(x);
        timer_is_on = 0;
        CicloTrabajo = true;
        wrkTime = 24;
        wrkPause = 4;
        ciclo = 0;
        segundos = 60;
        minutos = wrkTime;
        var estadoPlay = true;
        var estadoPause = false;
        var estadoStop = false;
        document.getElementById("minutos").innerHTML = "00";
        document.getElementById("segundos").innerHTML = "00";
        document.getElementById("btnInicio").style.border = "3px solid #A0906F";
        document.getElementById("btnPausa").style.border = "3px solid #A0906F";
        document.getElementById("btnStop").style.border = "1px solid #A0906F";
        document.getElementById("barraEstado1").style.backgroundImage = "url('./img/faviconGris.png')";
        document.getElementById("barraEstado2").style.backgroundImage = "url('./img/faviconGris.png')";
        document.getElementById("barraEstado3").style.backgroundImage = "url('./img/faviconGris.png')";
        document.getElementById("barraEstado4").style.backgroundImage = "url('./img/faviconGris.png')";
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
        segundos = datoSeg;
        controlador(datoSeg, datoMin);

        if (datoSeg < 0) {
            datoSeg = 59;
            datoMin -= 1;
            minutos = datoMin;
        }

        if (datoSeg < 10) { datoSeg = "0" + datoSeg }
        if (datoMin < 10) { document.getElementById("minutos").innerHTML = "0" + datoMin; } else {
            document.getElementById("minutos").innerHTML = datoMin;
        }

        document.getElementById("segundos").innerHTML = datoSeg;


        if (!stop) x = setTimeout(function() { crono(datoSeg, datoMin) }, 5);
    }

    // Cuando crono llega a cero tanto en tiempo de trabajo como de descanso

    function controlador(datoSeg, datoMin) {
        if ((datoSeg == 0) && (datoMin == 0)) {
            stop = true;
            notifyMe(title, options);
            if (CicloTrabajo) {
                clearTimeout(x);
                minutos = wrkPause;
                segundos = 59;
                timer_is_on = 0;
                CicloTrabajo = false;
                estadoCrono = "Ciclo " + (ciclo + 1) + " - Fin trabajo. Play para iniciar descanso";
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
                    estadoCrono = "Ciclo " + (ciclo) + " finalizado. Play para iniciar ciclo:" + (ciclo + 1);
                    muestraEstado(estadoCrono);
                    document.getElementById("btnInicio").style.border = "3px solid #A0906F";
                    document.getElementById("btnPausa").style.border = "3px solid #A0906F";
                    document.getElementById("btnStop").style.border = "1px solid #A0906F";

                    alarma();
                }
            }
        }
    }

    // Dibuja los pomodoros. Antes de un ciclo (prePintaCiclo) pinta borde mas fuerte. Ciclo acabado pinta pomodoro rojo.

    /* P I N T A   C I C L O */

    function pintaCiclo(dato) {
        if ((dato != 0) && (dato <= 4)) {
            switch (dato) {
                case 1:
                    document.getElementById("barraEstado1").style.backgroundImage = "url('./img/favicon.png')";
                    break;
                case 2:
                    document.getElementById("barraEstado2").style.backgroundImage = "url('./img/favicon.png')";
                    break;
                case 3:
                    document.getElementById("barraEstado3").style.backgroundImage = "url('./img/favicon.png')";
                    break;
                case 4:
                    document.getElementById("barraEstado4").style.backgroundImage = "url('./img/favicon.png')";
                    break;
            };
        }
    }

    /* P R E - P I N T A   C I C L O */

    function prePintaCiclo(dato) {
        if (dato < 4) {
            switch (dato) {
                case 0:
                    document.getElementById("barraEstado1").style.border = "3px solid #A0906F";

                    break;
                case 1:
                    document.getElementById("barraEstado2").style.border = "3px solid #A0906F";

                    break;
                case 2:
                    document.getElementById("barraEstado3").style.border = "3px solid #A0906F";

                    break;
                case 3:
                    document.getElementById("barraEstado4").style.border = "3px solid #A0906F";

                    break;
            };
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
        document.getElementById("barraEstado4").style.backgroundImage = "url('./img/favicon.png')";
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
        var audio = document.getElementById("audio1");
        audio.loop = true;
        audio.volume = 1;
        audio.play();
        document.getElementById("btnAlarma").addEventListener("click", function pararAlarma() {
            document.getElementById("alarma").style.visibility = "hidden";
            audio.volume = 0;
            audio.loop = false;
        });
    }

    // Texto con ciclo actual en trabajo o descansando

    function indicaCicloTxt(dato) {
        var x = document.getElementById("cicloPomodoro");
        x.innerHTML = "Ciclo " + (ciclo + 1) + " de 4 Pomodoros";
    }

    // Envia notificacion al desktop al sonar la alarma 

    function notifyMe(title, options) {
        if (!("Notification" in window)) {
            console.log("Este navegador que estas usando no soporta notificaciones.");
        } else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(title, options);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                if (permission === "granted") {
                    var notification = new Notification(title, options);
                }
            });
        }
    };

    // S C R I P T

    iniciaPantalla(); // inicializa todo a cero - estado parado


    // btn play

    document.getElementById("btnInicio").addEventListener("click", function play() {
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
                        if (stop == true) { minutos = wrkTime; }
                    } else {
                        estadoCrono = "Ciclo: " + (ciclo + 1) + " - Descansando";
                        if (stop == true) { minutos = wrkPause; }
                    }
                    stop = false;
                    document.getElementById("btnInicio").style.border = "1px solid #A0906F";
                    document.getElementById("btnPausa").style.border = "3px solid #A0906F";
                    document.getElementById("btnStop").style.border = "3px solid #A0906F";
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

    document.getElementById("btnPausa").addEventListener("click", function pause() {
        if (estadoPause) {
            clearTimeout(x);
            timer_is_on = 0;
            estadoCrono = "<b> En Pausa</b>";
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
            indicaCicloTxt("");
            stop = true;
        }
    });

} // fin corchete funcion iniciar