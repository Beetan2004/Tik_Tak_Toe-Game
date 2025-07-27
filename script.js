// Wait for the DOM to be fully loaded before running the game script
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const board = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const winLine = document.getElementById('win-line');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalRestartButton = document.getElementById('modal-restart-button');

    // Game state variables
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let gameActive = true;

    // Winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Game Initialization ---
    function initializeGame() {
        board.innerHTML = '';
        // Create board cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.classList.add('board-cell', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'cursor-pointer');
            
            // X and O symbols using SVG for crisp rendering
            const xSymbol = `<svg class="x-symbol w-3/4 h-3/4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            const oSymbol = `<svg class="o-symbol w-3/4 h-3/4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 110-18 9 9 0 010 18z"></path></svg>`;
            
            cell.innerHTML = xSymbol + oSymbol;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
        
        // Reset game state
        boardState.fill(null);
        currentPlayer = 'X';
        gameActive = true;
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        winLine.classList.remove('visible');
        winLine.style.transform = 'scaleX(0)'; // Reset line animation
        modal.classList.remove('visible');
    }

    // --- Event Handlers ---
    function handleCellClick(event) {
        const clickedCell = event.currentTarget;
        const clickedCellIndex = parseInt(clickedCell.dataset.index);

        // Check if the cell is already played or if the game is over
        if (boardState[clickedCellIndex] !== null || !gameActive) {
            return;
        }

        // Update game state
        boardState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());

        // Check for win or draw
        if (checkWin()) {
            endGame(false);
        } else if (boardState.every(cell => cell !== null)) {
            endGame(true); // It's a draw
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function handleRestart() {
        initializeGame();
    }

    // --- Game Logic ---
    function checkWin() {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                drawWinningLine(combination);
                return true;
            }
        }
        return false;
    }

    function endGame(isDraw) {
        gameActive = false;
        if (isDraw) {
            statusDisplay.textContent = "It's a Draw!";
            showModal("It's a Draw!");
        } else {
            statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
            showModal(`Player ${currentPlayer} Wins!`);
        }
    }
    
    function showModal(message) {
        modalMessage.textContent = message;
        modal.classList.add('visible');
    }

    // --- Visual Effects ---
    function drawWinningLine(combination) {
        const [start, , end] = combination;
        const startCell = board.children[start];
        const endCell = board.children[end];
        
        const boardRect = board.getBoundingClientRect();
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();

        const startX = startRect.left + startRect.width / 2 - boardRect.left;
        const startY = startRect.top + startRect.height / 2 - boardRect.top;
        const endX = endRect.left + endRect.width / 2 - boardRect.left;
        const endY = endRect.top + endRect.height / 2 - boardRect.top;

        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        winLine.style.width = `${length}px`;
        winLine.style.top = `${startY}px`;
        winLine.style.left = `${startX}px`;
        winLine.style.transform = `rotate(${angle}deg)`;
        winLine.style.transformOrigin = 'left center';
        
        // Use a timeout to ensure the line appears after the DOM update
        setTimeout(() => {
            winLine.classList.add('visible');
        }, 50);
    }

    // --- Event Listeners ---
    restartButton.addEventListener('click', handleRestart);
    modalRestartButton.addEventListener('click', handleRestart);

    // Initial game setup
    initializeGame();
});
