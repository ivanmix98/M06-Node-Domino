var http = require("http");
var url = require("url");
var querystring = require("querystring");
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Jugadors = [];
var player1Hand = [];
var player2Hand = [];
var playedPieces = [];
var torn;
var contingut;
class Jugador {
    constructor(Nom, Password) {
        this.Nom = nom;
        this.Password = password;
    }
}

class Partida {
    constructor(Num_partida) {
        this.Num_partida = num;
    }
}

var pieces = ["0,0", "0,1", "0,2", "0,3", "0,4", "0,5", "0,6", "1,1", "1,2", "1,3", "1,4", "1,5", "1,6", "2,2", "2,3", "2,4", "2,5", "2,6", "3,3", "3,4", "3,5",
    "3,6", "4,4", "4,5", "4,6", "5,5", "5,6", "6,6"];
repartirPeces(pieces);

function iniciar(encaminar, manegadorPeticion) {
    function onRequest(request, response) {
        var sortida;
        var pathname = url.parse(request.url).pathname;
        var consulta = url.parse(request.url, true).query;
        var nombre = consulta['caracter'];

        contingut = encaminar(manegadorPeticion, pathname);

        if (contingut == '/desa') {
            var rutadb = 'mongodb://localhost:27017';

            MongoClient.connect(rutadb, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('domino');
                db.collection('jugadors').insertOne({
                    "nom": consulta.usuari,
                    "password": consulta.password,
                });
                assert.equal(err, null);
                console.log("Afegit document a col·lecció jugadors");
                response.write("Registre confirmat");
                response.end();
                client.close();
            });
        } else if (contingut == '/consulta') {
            var rutadb = 'mongodb://localhost:27017';
            MongoClient.connect(rutadb, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('domino');
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                console.log("consulta document a col·lecció usuaris");

                var cursor = db.collection('jugadors').find({});
                cursor.each(function (err, doc) {
                    assert.equal(err, null);
                    if (doc != null) {
                        response.write(doc.nom + ' ' + doc.password + '<br>');
                    }
                    else {
                        response.end();
                        client.close();
                    }
                });
            });
        } else if (contingut == '/comprovar') {
            var rutadb = 'mongodb://localhost:27017';
            MongoClient.connect(rutadb, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('domino');
                var trobat = false;
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                console.log("consulta document a col·lecció usuaris");

                var cursor = db.collection('jugadors').find({});
                cursor.each(function (err, doc) {
                    assert.equal(err, null);

                    if (doc != null) {

                        if (doc.nom == consulta.usuari && doc.password == consulta.password) {
                            trobat = true;
                            response.write('Hola ' + doc.nom);
                            response.write('<form action="/juego" method="post">');
                            response.write('<input type="submit" value="Iniciar partida" />');
                            response.write('</form>');
                            response.write('<form action="/" method="post">');
                            response.write('<input type="submit" value="Logout" />');
                            response.write('</form>');
                        }
                    }
                    else {
                        if (trobat == false) {
                            response.write('Usuari no trobat');
                            response.write('<form action="/login" method="post">');
                            response.write('<input type="submit" value="Tornar enrrere" />');
                            response.write('</form>');
                        }

                        response.end();

                    }
                }); client.close();
            });
        
        } else if (contingut == '/index') {
            response.writeHead(200, {
                "Content-Type": "application/json charset=utf-8"
            });

            var players = Jugadors.length;
            var id = consulta['idJugador'];
            if (id == 0 && players == 0) {
                id = 1;
                Jugadors.push(1);
            } else if (id == 0 && players == 1) {
                id = 2;
                Jugadors.push(2);
            } else {
                id;
            }
            console.log("El jugador " + id + " ha entrat. Num players " + Jugadors.length);

            var objecteInicial = {
                "id": id,
                "jugadors": Jugadors
            };

            response.write(JSON.stringify(objecteInicial));
            response.end();
        } else if (contingut == '/updateTorn') {
            response.writeHead(200, {
                "Content-Type": "text/xml; charset=utf-8"
            });

            var objecteUpdate = {
                "id": consulta['idJugador'],
                "torn": torn,
                "playedPieces": playedPieces
            };

            response.write(JSON.stringify(objecteUpdate));
            response.end();

        } else if (contingut == '/playedPiece') {
            response.writeHead(200, {
                "Content-Type": "text/xml; charset=utf-8"
            });
            torn = consulta['torn'];
            if (consulta['costat'] == "dropDre") {
                playedPieces.push(consulta['piece']);
            } else if (consulta['costat'] == "dropEsq") {
                playedPieces.unshift(consulta['piece']);
            }

            if (torn == 1) {
                torn = 2;
            } else if (torn == 2) {
                torn = 1;
            }

            var objecteTirada = {
                "id": consulta['idJugador'],
                "tirada": consulta['piece'],
                "correct": true,
                "torn": torn,
                "playedPieces": playedPieces
            };

            console.log("El jugador " + consulta['idJugador'] + " ha tirat " + consulta['piece']);
            response.write(JSON.stringify(objecteTirada));
            response.end();

        } else if (contingut == '/start') {
            response.writeHead(200, {
                "Content-Type": "application/json charset=utf-8"
            });
            console.log("jugador " + consulta['idJugador']);

            var objecteJoc = {
                "id": consulta['idJugador'],
                "torn": 1,
                "pieces": [
                    "0,0", "0,1", "0,2", "0,3", "0,4", "0,5", "0,6",
                    "1,1", "1,2", "1,3", "1,4", "1,5", "1,6",
                    "2,2", "2,3", "2,4", "2,5", "2,6",
                    "3,3", "3,4", "3,5", "3,6",
                    "4,4", "4,5", "4,6",
                    "5,5", "5,6",
                    "6,6"
                ],
                "pieces1": player1Hand,
                "pieces2": player2Hand
            };
            response.write(JSON.stringify(objecteJoc));
            response.end();
        } else if (contingut == '/imatge') {
            response.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            fs.readFile('./img/' + consulta['img'], function (err, sortida) {
                response.writeHead(200, {
                    'Content-Type': 'image/png'
                });

                response.write(sortida);
                response.end();
            });
        } else if (contingut == '/css.css') {
            response.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            fs.readFile('./css.css', function (err, sortida) {
                response.writeHead(200, {
                    'Content-Type': 'text/css'
                });

                response.write(sortida);
                response.end();
            });
        }else if (contingut == 'favicon') {
                console.log("Hola");
        }else if (contingut == '/puntuat') {
            var rutadb = 'mongodb://localhost:27017';

            MongoClient.connect(rutadb, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('domino');
                db.collection('puntuacions').insertOne({
                    "nom": consulta.usuari,
                    "resultat": consulta.resultat,
                });
                assert.equal(err, null);
                console.log("Afegit document a col·lecció puntuacions");
                response.write("Resultat confirmat");
                response.end();
                client.close();
            });
        }else if (contingut == '/puntuacions') {
            var rutadb = 'mongodb://localhost:27017';
            MongoClient.connect(rutadb, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('domino');
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                console.log("consulta document a col·lecció usuaris");

                var cursor = db.collection('puntuacions').find({});
                cursor.each(function (err, doc) {
                    assert.equal(err, null);
                    if (doc != null) {
                        response.write(doc.nom + ' ' + doc.resultat + '<br>');
                    }
                    else {
                        response.end();
                        client.close();
                    }
                });
            });
        }else{
        fs.readFile(contingut, function (err, sortida) {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(sortida);
            response.end();
        });
    }
        
    }
    http.createServer(onRequest).listen(8887);
    console.log("Servidor iniciat. http://localhost:8887");
}

function repartirPeces(peces) {
    var p = [];
    var p1 = [];
    var p2 = [];
    for (var i = 0; i < peces.length;) {
        k = Math.floor(Math.random() * peces.length);
        var numAlreadyIn = false;
        for (var j = 0; j < p.length; j++) {
            if (p[j] == k) {
                numAlreadyIn = true;
                break;
            } else {
                numAlreadyIn = false;

            }
        } p.push(k);
        if (!numAlreadyIn) {
            if (i % 2 == 1) {
                p1.push(k);
            } else if (i % 2 == 0) {
                p2.push(k);
            }
            i++;
        }
    }
    retornarPecesImg(p1, p2);
}


function retornarPecesImg(peces1, peces2) {
    for (var i = 0; i < 7; i++) {
        player1Hand[i] = pieces[peces1[i]];
    };

    for (var j = 0; j < 7; j++) {
        player2Hand[j] = pieces[peces2[j]];
    }
}
exports.iniciar = iniciar;