let jugador;
let obstaculos= [];
let puntaje = 0;
let estadoJuego= "jugando";
let velocidadBase= 3;
let tempoAumento;
let imagenPersonaje;
let imagenesObstaculos = [];
let imagenFondo;

function preload() {
  imagenPersonaje=loadImage("Personaje00.png");
  // push manda a un arreglo la imagen del obstaculo para que se pueda usar en el juego
  imagenesObstaculos.push(loadImage("Obstaculo.png"));
  imagenesObstaculos.push(loadImage("Obstaculo00.png"));
  imagenesObstaculos.push(loadImage("Obstaculo01.png"));
  imagenFondo = loadImage("Fondo.jpg");
}

function setup() {
  createCanvas(600, 500);
  textFont("monospace");
  reiniciarJuego();
}

function draw() {
  image(imagenFondo, 0, 0, width, height);

  if (estadoJuego === "jugando") {
    dibujarJugador();
    moverJugador();

    if (frameCount % 60 === 0) {
      crearObstaculo();
    }

    for (let i = obstaculos.length - 1; i >= 0; i--) {
      obstaculos[i].mover();
      obstaculos[i].dibujar();

      if (detectarColision(jugador, obstaculos[i])) {
        estadoJuego = "gameover";
      }

      if (obstaculos[i].y > height + 50) {
        // splice funciona para eliminar el obstaculo del arreglo y aumentar el puntaje
        obstaculos.splice(i, 1);
        puntaje++;
      }
    }
//Saca el resto del framecount y si es 300 aumenta la velocidad base de los obstaculos
    if (frameCount % 300 === 0) {
      velocidadBase += 0.5;
    }

    mostrarPuntaje();

  } else if (estadoJuego === "gameover") {
    for (let i = 0; i < obstaculos.length; i++) {
      obstaculos[i].dibujar();
    }
    mostrarGameOver();
  }
}

function crearObstaculo() {
  let tipo = floor(random(3));
  let x = random(40, width - 40);
  let vel = random(velocidadBase, velocidadBase + 2);

  let obs;
  if (tipo === 0) {
    obs = {
      x: x,
      y: -55,
      ancho: 55,
      alto: 55,
      velocidad: vel,
      tipo: "imagen",
      imagen: random(imagenesObstaculos),
      dibujar: function () {
        image(this.imagen, this.x - this.ancho / 2, this.y - this.alto / 2, this.ancho, this.alto);
      },
      mover: function () {
        this.y += this.velocidad;
      }
    };
  } else if (tipo === 1) {
    obs = {
      x: x,
      y: -55,
      ancho: random(45, 85),
      alto: random(30, 55),
      velocidad: vel,
      tipo: "rectangulo",
      dibujar: function () {
        fill(220, 60, 60);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.ancho, this.alto, 4);
      },
      mover: function () {
        this.y += this.velocidad;
      }
    };
  } else {
    obs = {
      x: x,
      y: -50,
      ancho: 50,
      alto: 50,
      velocidad: vel,
      tipo: "cuadrado",
      dibujar: function () {
        fill(60, 180, 220);
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.ancho, this.alto, 6);
      },
      mover: function () {
        this.y += this.velocidad;
      }
    };
  }

  obstaculos.push(obs);
}

function dibujarJugador() {
  imageMode(CENTER);
  image(imagenPersonaje, jugador.x, jugador.y, jugador.ancho, jugador.alto);
  imageMode(CORNER);
}

function moverJugador() {
  if (keyIsDown(65)) {
    jugador.x -= jugador.velocidad;
  }
  if (keyIsDown(68)) {
    jugador.x += jugador.velocidad;
  }
  jugador.x = constrain(jugador.x, jugador.ancho / 2, width - jugador.ancho / 2);
}
// Detecta la distancia entre el obstaculo del jugador
function detectarColision(j, o) {
  // Verifica si las posiciones y tamaños de los objetos se superponen
  return o.posX < j.posX + j.sizeX &&
        o.posX + o.sizeX > j.posX &&
        o.posY < j.posY + j.sizeY &&
        o.posY + o.sizeY > j.posY;
}

function mostrarPuntaje() {
  fill(255);
  textSize(22);
  textAlign(LEFT, TOP);
  text("Puntaje: " + puntaje, 15, 15);
}

function mostrarGameOver() {
  fill(0, 0, 0, 160);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height / 2, 360, 200, 15);

  fill(255, 50, 50);
  textSize(42);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 35);

  fill(255);
  textSize(20);
  text("Puntaje final: " + puntaje, width / 2, height / 2 + 10);

  fill(180, 255, 180);
  textSize(18);
  text("Presiona R para reiniciar", width / 2, height / 2 + 50);
}

function reiniciarJuego() {
  jugador = {
    x: width / 2,
    y: height - 70,
    ancho: 70,
    alto: 70,
    velocidad: 5
  };
  obstaculos = [];
  puntaje = 0;
  velocidadBase = 3;
  estadoJuego = "jugando";
  frameCount = 0;
}

function keyPressed() {
  if ((key === "r" || key === "R") && estadoJuego === "gameover") {
    reiniciarJuego();
  }
}
