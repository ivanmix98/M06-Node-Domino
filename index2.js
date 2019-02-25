var server = require("./domino2");
var encaminador = require("./encaminador");
var manegadorPeticion = require("./manegadorPeticion");

var manegadors = {};
manegadors["/"] = manegadorPeticion.inici;
manegadors["/registro"] = manegadorPeticion.registro;
manegadors["/login"] = manegadorPeticion.login;
manegadors["/juego"] = manegadorPeticion.juego;
manegadors["/js/principal.js"] = manegadorPeticion.principal;
manegadors["/js/juego.js"] = manegadorPeticion.juego_js;
manegadors["/css.css"] = manegadorPeticion.css;
manegadors["/desa"] = manegadorPeticion.desa;
manegadors["/consulta"] = manegadorPeticion.consulta;
manegadors["/comprovar"] = manegadorPeticion.comprovar;
manegadors["/index"] = manegadorPeticion.index;
manegadors["/updateTorn"] = manegadorPeticion.updateTorn;
manegadors["/playedPiece"] = manegadorPeticion.playedPiece;
manegadors["/start"] = manegadorPeticion.start;
manegadors["/imatge"] = manegadorPeticion.imatge;
manegadors["/favicon.ico"] = manegadorPeticion.favicon;
manegadors["/puntuar"] = manegadorPeticion.puntuar;
manegadors["/puntuat"] = manegadorPeticion.puntuat;
manegadors["/puntuacions"] = manegadorPeticion.puntuacions;

server.iniciar(encaminador.encaminar,manegadors);