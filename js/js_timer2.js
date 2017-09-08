function iniciar() {
    var estado = true; // true si crono tiempo trabajo - false descanso
    var estadoPlay = true;
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
    var stop = false;
    var title = "Pomodoro Timer:";
    var options = { body: "Alarma disparada!" };
    var fondo = "negro";
    var permiso = Notification.requestPermission().then(function(result) {
        console.log(result);
    });




    function muestraEstado(dato) { // muestra en pantalla estado crono: trabajando, descansando o parado.
        document.getElementById("estadoCrono").innerHTML = dato;
    }

    iniciaPantalla(); // inicializa todo a cero - estado parado

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
        document.getElementById("segundos").innerHTML = datoSeg;
        document.getElementById("minutos").innerHTML = datoMin;


        if (!stop) x = setTimeout(function() { crono(datoSeg, datoMin) }, 500);
    }

    function controlador(datoSeg, datoMin) {
        if ((datoSeg == 0) && (datoMin == 0)) {
            stop = true;
            notifyMe(title, options);
            if (estado) {
                if ((ciclo + 1) >= 4) finCuatroCiclos();
                else {
                    clearTimeout(x);
                    minutos = wrkPause;
                    segundos = 59;
                    timer_is_on = 0;
                    estado = false;
                    estadoCrono = "Ciclo " + (ciclo + 1) + " - Fin trabajo.</br>Play para iniciar descanso";
                    muestraEstado(estadoCrono);
                    document.getElementById("btnInicio").style.border = "2px solid green";
                    document.getElementById("btnPausa").style.border = "2px solid green";
                    document.getElementById("btnStop").style.border = "4px solid green";
                    alarma();
                }

            } else {
                ciclo += 1;
                pintaCiclo(ciclo);
                if (ciclo >= 4) finCuatroCiclos();
                else {
                    estado = true;
                    clearTimeout(x);
                    timer_is_on = 0;
                    minutos = wrkTime;
                    segundos = 59;
                    estadoCrono = "Ciclo " + (ciclo) + " finalizado.<br> Play para iniciar ciclo:" + (ciclo + 1);
                    muestraEstado(estadoCrono);
                    document.getElementById("btnInicio").style.border = "2px solid green";
                    document.getElementById("btnPausa").style.border = "2px solid green";
                    document.getElementById("btnStop").style.border = "4px solid green";

                    alarma();
                }
            }
        }
    }

    document.getElementById("btnInicio").addEventListener("click", function play() {
        if (estadoPlay) {
            if (timer_is_on == 0) {
                timer_is_on = 1;
                /*segundos = 59;*/
                stop = false;
                if (estado) {
                    estadoCrono = "Ciclo: " + (ciclo + 1) + " - Trabajando";
                    minutos = wrkTime;
                } else {
                    estadoCrono = "Ciclo: " + (ciclo + 1) + " - Descansando";
                    minutos = wrkPause;
                }
                document.getElementById("btnInicio").style.border = "3px solid green";
                document.getElementById("btnPausa").style.border = "2px solid green";
                document.getElementById("btnStop").style.border = "2px solid green";
                muestraEstado(estadoCrono);
                prePintaCiclo(ciclo);
                indicaCicloTxt(ciclo);
                estadoPlay = false;
                estadoPause = true;
                estadoStop = true;
                crono(segundos, minutos);
            }
        }
    });

    document.getElementById("btnPausa").addEventListener("click", function pause() {
        if (estadoPause) {
            clearTimeout(x);
            timer_is_on = 0;
            estadoCrono = "<b> En Pausa</b>";
            document.getElementById("btnInicio").style.border = "2px solid green";
            document.getElementById("btnPausa").style.border = "3px solid green";
            document.getElementById("btnStop").style.border = "2px solid green";
            muestraEstado(estadoCrono);
            estadoPlay = true;
            estadoPause = false;
            estadoStop = true;
        }
    });

    document.getElementById("btnStop").addEventListener("click", function stop() {
        if (estadoStop) {
            estadoPlay = true;
            estadoPause = false;
            estadoStop = false;
            iniciaPantalla();
        }
    });



    /* R E L O J */

    var myVar = setInterval(function() { myClock() }, 1000);

    function myClock() {
        document.getElementById("reloj").innerHTML =
            new Date().toLocaleTimeString();
    }



    /* P I N T A   C I C L O */

    function pintaCiclo(dato) {
        if ((dato != 0) && (dato <= 4)) {
            switch (dato) {
                case 1:
                    document.getElementById("barraEstado1").style.background = "green";
                    break;
                case 2:
                    document.getElementById("barraEstado2").style.background = "green";
                    break;
                case 3:
                    document.getElementById("barraEstado3").style.background = "green";
                    break;
                case 4:
                    document.getElementById("barraEstado4").style.background = "green";
                    break;
            };
        } else {
            document.getElementById("barraEstado1").style.background = "transparent";
            document.getElementById("barraEstado2").style.background = "transparent";
            document.getElementById("barraEstado3").style.background = "transparent";
            document.getElementById("barraEstado4").style.background = "transparent";
        }
    }

    /* P R E - P I N T A   C I C L O */

    function prePintaCiclo(dato) {
        if (dato < 4) {
            switch (dato) {
                case 0:
                    document.getElementById("barraEstado1").style.border = "2px solid green";
                    break;
                case 1:
                    document.getElementById("barraEstado2").style.border = "2px solid green";
                    break;
                case 2:
                    document.getElementById("barraEstado3").style.border = "2px solid green";
                    break;
                case 3:
                    document.getElementById("barraEstado4").style.border = "2px solid green";
                    break;
            };
        } else {
            document.getElementById("barraEstado1").style.border = "1px solid green";
            document.getElementById("barraEstado2").style.border = "1px solid green";
            document.getElementById("barraEstado3").style.border = "1px solid green";
            document.getElementById("barraEstado4").style.border = "1px solid green";
        }
    }


    /* I N I C I A L I Z A   P A N T A L L A  */

    function iniciaPantalla() {
        estadoCrono = "<b>Parado</b>";
        muestraEstado(estadoCrono);
        clearTimeout(x);
        timer_is_on = 0;
        estado = true;
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
        document.getElementById("btnInicio").style.border = "2px solid #A0906F";
        document.getElementById("btnPausa").style.border = "2px solid #A0906F";
        document.getElementById("btnStop").style.border = "2px solid #A0906F";
        document.getElementById("barraEstado1").style.background = "#198A19";
        document.getElementById("barraEstado2").style.background = "#198A19";
        document.getElementById("barraEstado3").style.background = "#198A19";
        document.getElementById("barraEstado4").style.background = "#198A19";
        document.getElementById("barraEstado1").style.border = "1px solid green";
        document.getElementById("barraEstado2").style.border = "1px solid green";
        document.getElementById("barraEstado3").style.border = "1px solid green";
        document.getElementById("barraEstado4").style.border = "1px solid green";
        pintaCiclo(0);

    }

    function finCuatroCiclos() {
        estadoCrono = "Has finalizado los 4 ciclos!<br>Ahora se debe descansar unos 20 o 30 min<br>antes de iniciar de nuevo el ciclo de 4 pomodoros.";
        muestraEstado(estadoCrono);
        clearTimeout(x);
        timer_is_on = 0;
        stop = true;
        document.getElementById("minutos").innerHTML = "00";
        document.getElementById("segundos").innerHTML = ":00";
        document.getElementById("btnInicio").style.border = "2px solid green";
        document.getElementById("btnPausa").style.border = "2px solid green";
        document.getElementById("btnStop").style.border = "3px solid green";
        document.getElementById("barraEstado4").style.background = "green";
        ciclo = 4;
        pintaCiclo(ciclo);
        alarma();

    }

    function alarma() {
        document.getElementById("alarma").style.display = "block";
        estadoPlay = true;
        estadoPause = false;
        estadoStop = true;
        var audio = document.getElementById("audio2");
        audio.loop = true;
        audio.volume = 1;
        audio.play();
        document.getElementById("btnAlarma").addEventListener("click", function pararAlarma() {
            document.getElementById("alarma").style.display = "none";
            audio.volume = 0;
            audio.loop = false;
        });
    }

    function indicaCicloTxt(dato) {
        var x = document.getElementById("cicloPomodoro");
        x.innerHTML = "Ciclo " + (ciclo + 1) + " de 4 Pomodoros"
    }



    function notifyMe(title, options) {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        }

        // Check whether notification permissions have alredy been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(title, options);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(title, options);
                }
            });
        }
    }

    document.getElementById("btnFondo").addEventListener("click", function cambiaFondo() {
        if (fondo == "negro") {
            document.body.style.backgroundColor = "white";
            document.getElementById("btnFondo").style.backgroundColor = "white";
            fondo = "blanco";

        } else {
            document.body.style.backgroundColor = "black";
            fondo = "negro";
            document.getElementById("btnFondo").style.backgroundColor = "black";
        }
    });


} // fin corchete funcion iniciar