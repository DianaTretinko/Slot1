Window.Game = {};
(function (Game) {
    let canvas = document.getElementById('game');
    let context = canvas.getContext('2d');
    let scoreText = document.getElementById('score');

    let frameCounter = 0;
    let acceptInput = true;
    let score = 0;
    let pauze = false;

    let frameCounterLimit = 30;
    canvas.height = canvas.width = CANVAS_SIZE * CELL_SIZE;

    const colorPalettes = [
        ['#fde725', '#5ec962', '#21918c', '#3b528b', '#440154'], // Viridis
        ['#fcfdbf', '#fde725', '#35b779', '#31688e', '#440154'], // Magma
        ['#ff0000', '#ff7f0e', '#2ca02c', '#1f77b4', '#d62728'], // Custom sequential
    ];

    let currentPaletteIndex = 0;

    let enemySnake = null; // Variable to hold the second snake

    // Initial apple position
    let apple = {
        x: Math.floor(Math.random() * canvas.width / CELL_SIZE) * CELL_SIZE,
        y: Math.floor(Math.random() * canvas.height / CELL_SIZE) * CELL_SIZE,
        color: "#FFFF00",
    };

    function loop() {
        requestAnimationFrame(loop);

        if (++frameCounter < frameCounterLimit) {
            return;
        }

        frameCounter = 0;
        acceptInput = true;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!pauze) {
            snake.x += snake.dx;
            snake.y += snake.dy;

            if (enemySnake) {
                moveEnemySnake();
            }
        }

        checkEdgeCollision();
        drawApple();
        moveSnake();
    }

    function checkEdgeCollision() {
        if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
            GameOver();
        }

        if (enemySnake) {
            if (
                snake.cells.some(
                    (cell) => cell.x === enemySnake.x && cell.y === enemySnake.y
                ) ||
                enemySnake.cells.some(
                    (cell) => cell.x === snake.x && cell.y === snake.y
                )
            ) {
                GameOver();
            }
        }
    }

    function resetGame() {
        pauze = false;
        Window.Utils.DismissModal();
        resetScore();
        resetSnake();
        randomizeApple();
        enemySnake = null;
    }

    function GameOver() {
        pauze = true;
        Window.Utils.CreateModal("Game over", "You scored: <i>" + score + "</i> points");
        setTimeout(() => {
            window.location.href = 'slot1.html';
        }, 450);
    }

    Game.Reset = resetGame;

    function resetScore() {
        score = 0;
        updateScore();
    }

    function eatApple() {
        snake.length++;
        frameCounterLimit = Math.max(10, Math.floor(frameCounterLimit / 1.5));

        currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
        snake.color = colorPalettes[currentPaletteIndex][
            Math.floor(Math.random() * colorPalettes[currentPaletteIndex].length)
        ];

        score += 1;
        updateScore();

        if (score === 5 && !enemySnake) {
            spawnEnemySnake();
        }

        randomizeApple();
    }

    function randomizeApple() {
        apple.x = Math.floor(Math.random() * canvas.width / CELL_SIZE) * CELL_SIZE;
        apple.y = Math.floor(Math.random() * canvas.height / CELL_SIZE) * CELL_SIZE;
    }

    function moveSnake() {
        snake.cells.unshift({ x: snake.x, y: snake.y });

        if (snake.cells.length > snake.length) {
            snake.cells.pop();
        }

        snake.cells.forEach(function (cell, index) {
            context.fillStyle = snake.color;
            context.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);

            if (cell.x === apple.x && cell.y === apple.y) {
                eatApple();
            }

            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y && !pauze) {
                    GameOver();
                }
            }
        });
    }

    function moveEnemySnake() {
        // Randomly change direction occasionally
        if (Math.random() < 0.1) {
            const directions = [
                { dx: CELL_SIZE, dy: 0 }, // right
                { dx: -CELL_SIZE, dy: 0 }, // left
                { dx: 0, dy: CELL_SIZE }, // down
                { dx: 0, dy: -CELL_SIZE }, // up
            ];
            const newDirection = directions[Math.floor(Math.random() * directions.length)];
            enemySnake.dx = newDirection.dx;
            enemySnake.dy = newDirection.dy;
        }

        enemySnake.x += enemySnake.dx;
        enemySnake.y += enemySnake.dy;

        if (enemySnake.x < 0) {
            enemySnake.x = canvas.width - CELL_SIZE;
        } else if (enemySnake.x >= canvas.width) {
            enemySnake.x = 0;
        }

        if (enemySnake.y < 0) {
            enemySnake.y = canvas.height - CELL_SIZE;
        } else if (enemySnake.y >= canvas.height) {
            enemySnake.y = 0;
        }

        enemySnake.cells.unshift({ x: enemySnake.x, y: enemySnake.y });

        if (enemySnake.cells.length > enemySnake.length) {
            enemySnake.cells.pop();
        }

        enemySnake.cells.forEach(function (cell) {
            context.fillStyle = enemySnake.color;
            context.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);

            if (cell.x === apple.x && cell.y === apple.y) {
                enemyEatApple();
            }
        });
    }

    function spawnEnemySnake() {
        enemySnake = {
            x: Math.floor(Math.random() * canvas.width / CELL_SIZE) * CELL_SIZE,
            y: Math.floor(Math.random() * canvas.height / CELL_SIZE) * CELL_SIZE,
            dx: CELL_SIZE,
            dy: 0,
            length: 4,
            color: "#FF0000",
            cells: [],
        };
    }

    function enemyEatApple() {
        enemySnake.length++;
        frameCounterLimit = Math.max(10, Math.floor(frameCounterLimit / 1));
        randomizeApple();
    }

    function updateScore() {
        scoreText.textContent = 'Score: ' + score;
    }

    function drawApple() {
        context.fillStyle = apple.color;
        context.fillRect(apple.x, apple.y, CELL_SIZE - 1, CELL_SIZE - 1);
    }

    document.addEventListener('keydown', function (keyBoardEvent) {
        if (!acceptInput) {
            return;
        }

        if (keyBoardEvent.which === KEY_LEFT && snake.dx === 0) {
            snake.dx = -CELL_SIZE;
            snake.dy = 0;
            acceptInput = false;
        } else if (keyBoardEvent.which === KEY_UP && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -CELL_SIZE;
            acceptInput = false;
        } else if (keyBoardEvent.which === KEY_RIGHT && snake.dx === 0) {
            snake.dx = CELL_SIZE;
            snake.dy = 0;
            acceptInput = false;
        } else if (keyBoardEvent.which === KEY_DOWN && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = CELL_SIZE;
            acceptInput = false;
        }
    });

    requestAnimationFrame(loop);
})(Window.Game);
