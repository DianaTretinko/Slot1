/**
 * This is the snake object. It contains all important information for the snake.
 */
let snake = {
    // The snake's starting position (top left)
    x: 0,
    y: 0,
    
    // This determines the snake's direction. Moves one grid length every frame in either the x or y direction
    dx: CELL_SIZE,
    dy: 0,
    
    // This is a list to keep track of each of the snake's segments
    cells: [],
    
    // The snake's length. This increases each time an apple is eaten
    length: 4,

    // The snake's color
    color: 'white'
};

// Set the snake back to its defaul values
function resetSnake() {
    snake.x = 0;
    snake.y = 0;
    snake.cells = [];
    snake.length = 4;
    snake.dx = CELL_SIZE;
    snake.dy = 0;
}
