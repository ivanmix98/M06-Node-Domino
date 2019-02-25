var id = 0;
var id_interval;
var pieces = [];
var playedPiece;

window.onload = function () {
    var xhr;
    var dada;
    document.getElementById("missatge").innerText = "Esperant més jugadors...";
    id_interval = setInterval(function () {
        cridaAJAXinicial('/index?idJugador=' + id);
    }, 3000);

};

    function cridaAJAXinicial(url) {
        xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('problemes amb XHR');
            return false;
        }
        xhr.onreadystatechange = callbackAJAXinicial;
        xhr.open('POST', url, true);
        xhr.send(null);
    }


    function callbackAJAXinicial() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                dada = JSON.parse(xhr.response);
                mostrarInici();
            } else {
                console.log('problemes amb l\'AJAX');
            }
        }

    }


/**
 * Method that shows index page
 */
function mostrarInici() {
    var jugadors = dada.jugadors;
    id = dada.id;
    if(jugadors.length < 2){
        document.getElementById("missatge").innerText = "Esperant més jugadors...";
    } else if(jugadors.length == 2 && id != 0){
        document.getElementById("missatge").innerText = "Fes click per jugar";
        document.getElementById("btnJugar").attributes.removeNamedItem("hidden");
        clearInterval(id_interval);
    } else if(jugadors.length == 2 && id == 0){
        document.getElementById("missatge").innerText = "Sala plena. Esperant a que els jugadors finalitzin";
        //document.getElementById("btnJugar").attributes.addNamedItem("hidden");
        clearInterval(id_interval);
    }
}

function toGame() {
    document.getElementById("homeDiv").setAttribute("hidden","true");
    document.getElementById("dominoDiv").attributes.removeNamedItem("hidden");
    cridaAJAXJoc('/start?idJugador=' + id);
}