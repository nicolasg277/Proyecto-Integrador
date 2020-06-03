function getElement(id, text) {
  var e = document.getElementById(id); // Elemento
  if (text) e.innerHTML = text;
  return e;
}

// iniciar:

function start() {
  canvas = getElement("cv");
  width = canvas.width;
  height = canvas.height;
  ctx = canvas.getContext("2d");
  bu1 = getElement("bu1", text01); // campos de entrada
  bu2 = getElement("bu2", text02[0]);
  bu2.state = 0;
  cbSlow = getElement("cbSlow");
  cbSlow.checked = false;
  getElement("lbSlow", text03);
  getElement("ipHa", text04);
  ipH = getElement("ipHb");
  getElement("ipHc", meter);
  getElement("ipVa", text05);
  ipV = getElement("ipVb");
  getElement("ipVc", meterPerSecond);
  getElement("ipWa", text06);
  ipW = getElement("ipWb");
  getElement("ipWc", degree);
  getElement("ipMa", text07);
  ipM = getElement("ipMb");
  getElement("ipMc", kilogram);
  getElement("ipGa", text08);
  ipG = getElement("ipGb");
  getElement("ipGc", meterPerSecond2);
  rbY = getElement("rbY");
  getElement("lbY", text09);
  rbV = getElement("rbV");
  getElement("lbV", text10);
  rbA = getElement("rbA");
  getElement("lbA", text11);
  rbF = getElement("rbF");
  rbY.checked = true;
  nrSize = 1;
  getElement("author", author);

  on = slow = false; // Animacion
  h0 = 5;
  v0 = 5;
  alpha0 = 45 * DEG;
  m = 1;
  g = 9.8; // gravedad
  updateInput();
  enableInput(true);
  t = 0;
  calculation();
  calcPos12();
  paint();
  bu1.onclick = reactionReset;
  bu2.onclick = reactionStart;
}
// fin del inicio del método

// Determinar el estado del botón Inicio / Pausa / Continuar:

function setButton2State(st) {
  bu2.state = st;
  bu2.innerHTML = text02[st];
}

// Alterna el botón de inicio / pausa / siguiente:

function switchButton2() {
  var st = bu2.state;
  if (st == 0) st = 1;
  else st = 3 - st;
  setButton2State(st);
}

// Activación o desactivación de los campos de entrada:
// p ... indicador de posible entrada

function enableInput(p) {
  ipH.readOnly = !p;
  ipV.readOnly = !p;
  ipW.readOnly = !p;
  ipM.readOnly = !p;
  ipG.readOnly = !p;
}

// reacción al botón de reinicio:

function reactionReset() {
  setButton2State(0);
  enableInput(true);
  stopAnimation();
  t = 0;
  reaction();
  paint();
}

// Reacción al botón de inicio:
function reactionStart() {
  switchButton2();
  enableInput(false);
  if (bu2.state == 1) startAnimation();
  else stopAnimation();
  reaction();
}

function reaction() {
  input();
  calculation();
}

// Respuesta a presionar tecla (solo ingresar tecla):

// Respuesta al botón de radio:
function reactionRadioButton() {
  if (rbY.checked) nrSize = 1;
  else if (rbV.checked) nrSize = 2;
  else if (rbA.checked) nrSize = 3;

  if (!on) paint();
}

// iniciar o continuar la animación:
// efecto secundario activado, temporizador, t0

function startAnimation() {
  on = true;
  timer = setInterval(paint, 40);
  t0 = new Date();
}

function stopAnimation() {
  on = false; // Animation abgeschaltet
}
// ------------------------------------------------ -------------------------------------------------

// Cálculo de posiciones de texto:
// efecto secundario pos1, pos2

function calcPos12() {
  ctx.font = FONT1;
  pos1 = ctx.measureText(text18).width;
  pos1 = Math.max(pos1, ctx.measureText(text19).width);
  pos1 = Math.max(pos1, ctx.measureText(text20).width);
  pos1 += 260;
}

// Factor de conversión (píxel / unidad):
// maxReal .... longitud máxima de ruta (m)
// maxPixel ... longitud máxima de ruta (píxeles)
// maxPixel debe ser divisible por 100 si es posible.

function getFactor(maxReal, maxPixel) {
  var q = maxPixel / maxReal;
  var f = maxPixel;
  while (true) {
    f /= 2;
    if (f < q) break;
    f /= 2.5;
    if (f < q) break;
    f /= 2;
    if (f < q) break;
  }
  return f;
}

// Tamaño del paso para las marcas (en m):

function getStep1() {
  var limit = 5,
    step1 = 1;
  while (true) {
    if (pix >= limit) return step1;
    limit /= 10;
    step1 *= 10;
  }
}
// Tamaño del paso para las marcas etiquetadas (en m):

function getStep2() {
  var limit = 50,
    step1 = 1;
  while (true) {
    if (pix >= limit) return step1;
    limit /= 2;
    step1 *= 2;
    if (pix >= limit) return step1;
    limit /= 2.5;
    step1 = (5 * step1) / 2;
    if (pix >= limit) return step1;
    limit /= 2;
    step1 *= 2;
  }
}

// cálculos:
// efecto secundario v0x, v0y, tW, w, hMax, vyMax, e, pix

function calculation() {
  v0x = v0 * Math.cos(alpha0); // Componente de velocidad horizontal al principio (m / s)
  v0y = v0 * Math.sin(alpha0); // Componente de velocidad vertical al principio (m / s)
  if (Math.cos(alpha0) < 1e-10) v0x = 0; // Evita cualquier error de redondeo

  tW = (v0y + Math.sqrt(v0y * v0y + 2 * g * h0)) / g; // duración de la camada
  w = v0x * tW; // distancia de lanzamiento (m)
  if (v0y > 0) {
    var t = v0y / g; // tiempo para la altura máxima (s)
    hMax = h0 + v0y * t - (g * t * t) / 2; // ... altura máxima (m)
  } else hMax = h0; //  de lo contrario, altura máxima igual a la altura inicial (m)
  vyMax = Math.abs(v0y - g * tW); // Cantidad máxima del componente de velocidad vertical (m / s)

  pix = getFactor(Math.max(w, hMax), 300); // factor de conversión (píxeles por m)
  if (pix * hMax > 220) pix /= 2; // Si no hay suficiente espacio, reduzca a la mitad el factor de conversión
}

// Convierte un número en una cadena:
// n ..... Número dado
// d ..... número de dígitos
// arreglo ... marca para decimales (en contraste con dígitos válidos)

function ToString(n, d, fix) {
  var s = fix ? n.toFixed(d) : n.toPrecision(d);
  return s.replace(".", decimalSeparator);
}

// Ingrese un numero
// ef .... campo de entrada
// d ..... número de dígitos
// arreglo ... marca para decimales (en contraste con dígitos válidos)
// min ... mínimo del rango permitido
// max ... máximo del rango permitido
// Valor de retorno: número o NaN

function inputNumber(ef, d, fix, min, max) {
  var s = ef.value;
  s = s.replace(",", ".");
  var n = Number(s);
  if (isNaN(n)) n = 0;
  if (n < min) n = min;
  if (n > max) n = max;
  ef.value = ToString(n, d, fix);
  return n;
}

function input() {
  h0 = inputNumber(ipH, 3, true, 0, 100);
  v0 = inputNumber(ipV, 3, true, 0, 100);
  alpha0 = inputNumber(ipW, 3, true, -90, 90) * DEG;
  m = inputNumber(ipM, 3, true, 0.1, 10);
  g = inputNumber(ipG, 3, true, 1, 100);
}

// Actualiza los campos de entrada:

function updateInput() {
  ipH.value = ToString(h0, 3, true);
  ipV.value = ToString(v0, 3, true);
  ipW.value = ToString(alpha0 / DEG, 3, true);
  ipM.value = ToString(m, 3, true);
  ipG.value = ToString(g, 3, true);
}

//-------------------------------------------------------------------------------------------------

// Nueva ruta de gráficos con valores predeterminados:

function newPath() {
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
}

// Dibujar linea:
// x1, y1 ... punto de partida
// x2, y2 ... punto final
// c ........ color (opcional, valor predeterminado negro)
// w ........ grosor de línea (opcional, valor predeterminado 1)
function line(x1, y1, x2, y2, c, w) {
  newPath();
  if (c) ctx.strokeStyle = c;
  if (w) ctx.lineWidth = w;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function rectangle(x, y, w, h, c) {
  if (c) ctx.fillStyle = c;
  newPath();
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

// disco circular con borde negro:
// (x, y) ... coordenadas centrales (píxeles)
// r ....... radio (píxeles)
// c ....... color de relleno (opcional)
function circle(x, y, r, c) {
  if (c) ctx.fillStyle = c;
  newPath();
  ctx.arc(x, y, r, 0, PI2, true);
  if (c) ctx.fill();
  ctx.stroke();
}

// x1, y1 ... punto de partida
// x2, y2 ... punto final
// w ........ grosor de línea (opcional)
// Nota: el color está determinado por ctx.strokeStyle.
function arrow(x1, y1, x2, y2, w) {
  if (!w) w = 1;
  var dx = x2 - x1,
    dy = y2 - y1;
  var length = Math.sqrt(dx * dx + dy * dy);
  if (length == 0) return;
  dx /= length;
  dy /= length;
  var s = 2.5 * w + 7.5;
  var xSp = x2 - s * dx,
    ySp = y2 - s * dy;
  var h = 0.5 * w + 3.5;
  var xSp1 = xSp - h * dy,
    ySp1 = ySp + h * dx;
  var xSp2 = xSp + h * dy,
    ySp2 = ySp - h * dx;
  xSp = x2 - 0.6 * s * dx;
  ySp = y2 - 0.6 * s * dy;
  ctx.beginPath();
  ctx.lineWidth = w;
  ctx.moveTo(x1, y1);
  if (length < 5) ctx.lineTo(x2, y2);
  else ctx.lineTo(xSp, ySp);
  ctx.stroke();
  if (length < 5) return;
  ctx.beginPath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.moveTo(xSp, ySp);
  ctx.lineTo(xSp1, ySp1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(xSp2, ySp2);
  ctx.closePath();
  ctx.fill();
}

// Cálculo de coordenadas, esfera:
// efecto secundario x, y, x0, y0

function ball() {
  x = v0x * t;
  y = h0 + v0y * t - (g * t * t) / 2;
  x0 = xU + pix * x;
  y0 = yU - pix * y;
  circle(x0, y0, 3.5, "#000000");
}
//cordenadas

function axes() {
  newPath();
  arrow(xU - 10, yU, xU + 355, yU);
  arrow(xU, yU + 10, xU, yU - 255);
  var step1 = getStep1();
  var step2 = getStep2();
  ctx.textAlign = "center";
  ctx.fillStyle = "#000000";
  for (var i = 1; i <= 330 / pix; i++) {
    var x = xU + i * pix;
    var d = i % step2 == 0 ? 5 : 2;
    if (i % step1 == 0) line(x, yU - d, x, yU + d);
    if (i % step2 == 0) ctx.fillText("" + i, x, yU + 18);
  }
  ctx.textAlign = "right";
  for (var i = 1; i <= 220 / pix; i++) {
    // Para todos los trucos del eje vertical
    var y = yU - i * pix;
    var d = i % step2 == 0 ? 5 : 2;
    if (i % step1 == 0) line(xU - d, y, xU + d, y);
    if (i % step2 == 0) ctx.fillText("" + i, xU - 7, y + 4);
  }
  ctx.textAlign = "center"; // Alineación de texto central
  ctx.fillText(symbolX, xU + 350, yU + 18);
  ctx.fillText(text14, xU + 350, yU + 30);
  ctx.fillText(symbolY, xU - 20, yU - 245);
  ctx.fillText(text14, xU - 20, yU - 230);
}

// Lanzar parábola (aproximación por polígono):

function orbit() {
  newPath();
  ctx.strokeStyle = colorPosition;
  if (v0x < 1e-10) {
    // Si tiro vertical ...
    line(xU, yU, xU, yU - hMax * pix);
    return;
  }
  var gH = g / 2;
  var xx = xU,
    yy = yU - h0 * pix;
  ctx.moveTo(xx, yy);
  var t = 0;
  while (t < tW) {
    xx++;
    var x = (xx - xU) / pix;
    t = x / v0x;
    var y = h0 + t * (v0y - gH * t);
    yy = yU - y * pix;
    ctx.lineTo(xx, yy);
  }
  ctx.stroke();
}

// texto gráfico (valor de un tamaño):
// beg ..... texto antes del número
// val ..... número
// fin ..... texto después del número (por ejemplo, unidad)
// (x, y) ... posición
function writeValue(beg, val, end, x, y) {
  var s = beg + ToString(val, 3, false) + end;
  ctx.fillText(s, x, y);
}

// Representación de la posición: valores numéricos, marcas en los ejes.
function position() {
  newPath();
  ctx.fillStyle = colorPosition;
  var x1 = 220,
    x2 = 240,
    x3 = 320;
  ctx.fillText(text15, x1, 25);
  writeValue(symbolX + " = ", x, " " + meterUnicode, x2, 40);
  ctx.fillText(text16, x3, 40);
  writeValue(symbolY + " = ", y, " " + meterUnicode, x2, 55);
  ctx.fillText(text17, x3, 55);
  ctx.fillText(text18, x1, 80);
  writeValue("", w, " " + meterUnicode, pos1, 80);
  ctx.fillText(text19, x1, 95);
  writeValue("", hMax, " " + meterUnicode, pos1, 95);
  line(x0, yU - 5, x0, yU + 5, colorPosition);
  line(xU - 5, y0, xU + 5, y0, colorPosition);
}

// Salida de graficos:
function paint() {
  ctx.fillStyle = colorBackground;
  ctx.fillRect(0, 0, width, height);
  if (on) {
    // Si la animación está activada ...
    var t1 = new Date();
    var dt = (t1 - t0) / 1000;
    if (slow) dt /= 10;
    t += dt;
    t0 = t1;
    if (t > tW) t = tW;
  }

  var vv = yU + 3;
  rectangle(0, vv, width, height - vv, colorGround);
  ball();
  axes();

  if (nrSize != 2) orbit();
  //texto botones
  ctx.textAlign = "center";
  position();
}
document.addEventListener("DOMContentLoaded", start, false);
