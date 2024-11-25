const grid = document.getElementById('grid');
const celebrationMessage = document.getElementById('celebration');
let cells = Array(9).fill(null);
let currentPlayer = 'X';

const renderGrid = () => {
    grid.innerHTML = '';
    cells.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (value) cell.classList.add(value);
        cell.textContent = value || '';
        cell.addEventListener('click', () => makeMove(index));
        grid.appendChild(cell);
    });
};

const makeMove = (index) => {
    if (cells[index] || checkWin('X') || checkWin('O')) return;
    cells[index] = currentPlayer;
    renderGrid();
    if (checkWin(currentPlayer)) {
        celebration(currentPlayer);
        return;
    }
    if (checkDraw()) {
        celebration('Draw');
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') botMove();
};

const botMove = () => {
    const bestMove = getBestMove();
    cells[bestMove] = 'O';
    renderGrid();
    if (checkWin('O')) {
        celebration('O');
        return;
    }
    if (checkDraw()) {
        celebration('Draw');
        return;
    }
    currentPlayer = 'X';
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i] === null) {
            cells[i] = 'O';
            let score = minimax(cells, 0, false);
            cells[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
};

const minimax = (board, depth, isMaximizing) => {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const checkWin = (player) => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => cells[index] === player)
    );
};

const checkDraw = () => {
    return cells.every(cell => cell !== null) && !checkWin('X') && !checkWin('O');
};

const celebration = (winner) => {
    let resultMessage;
    if (winner === 'X') resultMessage = "You Win! 🎉";
    else if (winner === 'O') resultMessage = "Balay Wins! 🎉";
    else resultMessage = "It's a Draw! 😐";

    celebrationMessage.textContent = resultMessage;
    celebrationMessage.classList.add('celebrate');

    setTimeout(() => {
        celebrationMessage.classList.remove('celebrate');
        celebrationMessage.textContent = '';
        cells = Array(9).fill(null);
        renderGrid();
        currentPlayer = 'X';
    }, 3000);
};

renderGrid();
