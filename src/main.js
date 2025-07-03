import "./style.css";
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, PIECES, piece } from "./consts";

// inicializar el canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const $score = document.querySelector("span");

let score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// 3. Creación del board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

function createBoard(rows, columns) {
  return Array(columns)
    .fill()
    .map(() => Array(rows).fill(0));
}

// 8. auto drop
let dropCounter = 0; // sirve para saber cuánto pasó entre de un fame a otro
let lastTime = 0;

function update(time = 0) {
  // time es dado por el navegador
  const deltaTime = time - lastTime; // saber cuanto tiempo ha pasado desde el último frame
  lastTime = time;

  dropCounter += deltaTime; // acumula el tiempo real,

  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
  }

  if (checkCollision()) {
    piece.position.y--;
    solidifyPiece();
    removeRows();
  }

  draw();
  window.requestAnimationFrame(update); // actualiza los frames muchas veces por segundo
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Para el board
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "green";
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  // Para la pieza
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "yellow";
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });

  $score.innerText = score;
}

// Mover la pieza del tablero
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (e.key === "ArrowRight") {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }
  if (e.key === "ArrowDown") {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }

  if (e.key === "ArrowUp") {
    const rotated = []; // nuevo arreglo para guardar la version rotada de la pieza

    // rotacion 90° a la derecha
    for (let i = 0; i < piece.shape[0].length; i++) {
      // quiero recorrer todas las columnas que hay en cada fila del shape.
      const row = [];

      // en cada columna vamos de abajo hacia arriba (j decrece)
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]); // tomamos los valores y los convertimos en una nueva fila
      }

      rotated.push(row);
    }

    const previousShape = piece.shape;
    piece.shape = rotated;
    if (checkCollision()) {
      piece.shape = previousShape;
    }
  }
});

// Revisamos las colisiones
function checkCollision() {
  return piece.shape.find((row, y) => {
    // recorre la pieza fila por fila
    return row.find((value, x) => {
      // recorre el valor por cada fila
      return (
        value !== 0 && // si el valor en la pieza del jugador es diferente de cero,
        board[y + piece.position.y]?.[x + piece.position.x] !== 0 // si el valor en la celda es cero.
      ); // si retorna true hay colision, si es false, no hay colision.
    });
  });
}

// Solidificación
function solidifyPiece() {
  piece.shape.find((row, y) => {
    row.find((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });

  // reseteo de posicion de la pieza
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 1);
  piece.position.y = 0;

  // obtener las piezas random
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];

  // game over
  if (checkCollision()) {
    window.alert("Game Over!! You lose!");
    board.forEach((row) => row.fill(0));
  }
}

function removeRows() {
  const rowsToRemove = []; // Para guardar los índices que serán usados para eliminar las filas del row

  board.find((row, y) => {
    if (row.every((value) => value === 1)) {
      // buscar una fila llena de 1
      rowsToRemove.push(y); // se guarda el índice en el rowsToRemove
    }
  });

  rowsToRemove.forEach((y) => {
    board.splice(y, 1); // elimina la fila llena
    const newRow = Array(BOARD_WIDTH).fill(0); // crea una fila para insertar en board
    board.unshift(newRow); // se agrega la nueva fila desde arriba del board
    score += 10;
  });
}

update();
