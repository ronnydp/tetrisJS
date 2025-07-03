export const BLOCK_SIZE = 20;
export const BOARD_WIDTH = 14;
export const BOARD_HEIGHT = 27;

// 9. Piezas random
export const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
];

// 4. Creación de las piezas.
export const piece = {
  position: { x: 5, y: 5 },
  shape: PIECES[Math.floor(Math.random() * PIECES.length)], // creacion de la pieza al inicio del juego
  next_shape: PIECES[Math.floor(Math.random() * PIECES.length)]
};

export const piece_temp = [piece.shape, piece.next_shape]
