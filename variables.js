var text01 = "Reiniciar";
var text02 = ["Disparar", "Pausar", "Continuar"];
var text03 = "Animación lenta";
var text04 = "Altura inicial en";
var text05 = "Velocidad inicial en";
var text06 = "Angulo inclinación en";
var text07 = "Masa en";
var text08 = "Gravedad";
var text09 = "Coordenadas";
var text10 = "Velocidad";
var text11 = "";
var text12 = "";
var text13 = "";

var author = "Nicolas Gutierrez,&nbsp; William Pineda; UNAC";

// Símbolos y unidades:

var decimalSeparator = ",";
var meter = "m";
var meterPerSecond = "m/s";
var meterPerSecond2 = "m/s2";
var kilogram = "kg";
var degree = " °";

// Textos en notacion

var text14 = "(m)";
var text15 = "Coordenadas:";
var text16 = "(horizontal)";
var text17 = "(vertical)";
var text18 = "Distancia horizontal:";
var text19 = "Altura máxima:";
var text20 = "Tiempo:";
var text21 = "Componentes de la velocidad:";
var text22 = "Magnitud de la velocidad:";
var text23 = "Angulo de inclinación:";
var text24 = "Aceleración:";

// Simbolos y unidades

var symbolX = "x";
var symbolY = "y";
var symbolVelocity = "v";
var meterUnicode = "m";
var secondUnicode = "s";
var meterPerSecondUnicode = "m/s";
var meterPerSecond2Unicode = "m/s2";
var colorBackground = (color = "white"); // Color del fondo
var colorGround = (color = "white"); // Color superficie
var colorPosition = (color = "black"); // Color para posicion
var colorVelocity = (color = "black"); // Color para la velocidad
var colorAcceleration = (color = "black"); // Color de la aceleración
var colorAngle = (color = "black"); // color angulo

// Otras constanstes:

var PI2 = 2 * Math.PI; //Abreviatura de 2 pi
var DEG = Math.PI / 180; //1 grado (radianes)
var FONT1 = "normal normal bold 12px sans-serif"; //Conjunto de caracteres normal
var FONT2 = "normal normal bold 16px monospace";
var xU = 50,
  yU = 270; // Posición de origen (píxel)
// Atributos:

var canvas, ctx;
var width, height;
var bu1, bu2;
var cbSlow;
var ipH, ipV, ipW, ipM, ipG;
var rbY, rbV, rbA, rbF, rbE;

var x, y; // cordenadas
var hMax; // altura maxima
var nrSize;
var pos1, pos2; // Text posicion
