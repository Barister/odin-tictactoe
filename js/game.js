// Функция для определения winningCells в зависимости от размера доски
function getWinningCells(rows) {
   if (rows === 3) {
      return 3;
   } else if (rows === 4) {
      return 3;
   } else if (rows === 5) {
      return 4;
   } else if (rows === 15) {
      return 5;
   }
   return 3; // По умолчанию
}

// Создание доски
function Gameboard(rows, columns) {
   const board = [];

   for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
         board[i].push(Cell());
      }
   }

   const getBoard = () => board;

   const markCell = (row, column, player) => {
      if (board[row] && board[row][column] && board[row][column].getValue() === 0) {
         board[row][column].AddMarker(player);
         return true;
      }
      return false;
   }

   const resetBoard = () => {
      for (let i = 0; i < rows; i++) {
         for (let j = 0; j < columns; j++) {
            board[i][j] = Cell();
         }
      }
   }

   return { getBoard, markCell, resetBoard };
}

// Клетка доски
function Cell() {
   let value = 0;

   const AddMarker = (player) => {
      value = player;
   }

   const getValue = () => value;

   return { AddMarker, getValue };
}

function GameController(
   updateScreenCallback,
   removeClickHandler,
   playerOneName,
   playerOneMarker,
   playerTwoName,
   playerTwoMarker,
   rows,
   columns,
   updateAsideCallback
) {
   const winningCells = getWinningCells(rows); // Определение winningCells
   const board = Gameboard(rows, columns);

   const players = [
      {
         name: playerOneName,
         marker: playerOneMarker,
         score: 0
      },
      {
         name: playerTwoName,
         marker: playerTwoMarker,
         score: 0
      }
   ];

   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const getActivePlayer = () => activePlayer;

   const checkWinner = () => {
      const currentBoard = board.getBoard();

      const checkLine = (line) => {
         let count = 0;
         let lastMarker = null;
         for (const [row, col] of line) {
            const cellValue = currentBoard[row][col].getValue();
            if (cellValue === lastMarker && cellValue !== 0) {
               count++;
            } else {
               count = 1;
               lastMarker = cellValue;
            }
            if (count === winningCells) return true; // Использование winningCells
         }
         return false;
      }

      // Проверка всех строк, столбцов и диагоналей
      for (let i = 0; i < rows; i++) {
         if (checkLine([...Array(columns).keys()].map(j => [i, j]))) return true;
         if (checkLine([...Array(rows).keys()].map(j => [j, i]))) return true;
      }
      if (checkLine([...Array(rows).keys()].map(i => [i, i]))) return true;
      if (checkLine([...Array(rows).keys()].map(i => [i, rows - i - 1]))) return true;

      return false;
   }

   const playRound = (selectedCell) => {
      const [row, column] = selectedCell;

      if (board.markCell(row, column, getActivePlayer().marker)) {
         const winner = checkWinner();

         if (winner) {
            activePlayer.score++;
            updateAsideCallback(players, winningCells); // Передача winningCells вместо winningScore
            if (activePlayer.score === winningCells) {
               updateScreenCallback(`${getActivePlayer().name} wins the game!`);
               removeClickHandler();
               return;
            } else {
               updateScreenCallback(`${getActivePlayer().name} wins this round!`);
               resetBoard();
               return;
            }
         }
         switchPlayerTurn();
         updateScreenCallback(`${getActivePlayer().name}'s turn`);
      } else {
         updateScreenCallback('Invalid move, try again.');
      }
   };

   const resetBoard = () => {
      board.resetBoard();
      updateScreenCallback(`${getActivePlayer().name}'s turn`);
   }

   return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      resetBoard
   }
}

function ScreenController(playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns) {
   let infoDiv, boardDiv;

   const init = () => {
      cacheDom();
      bindEvents();
   }

   const cacheDom = () => {
      infoDiv = document.querySelector('.page__player-turn');
      boardDiv = document.querySelector('.page__board');
   }

   const bindEvents = () => {
      boardDiv.addEventListener('click', clickHandlerBoard);
   }

   const unbindEvents = () => {
      boardDiv.removeEventListener('click', clickHandlerBoard);
   }

   const updateScreen = (message) => {
      boardDiv.textContent = '';

      const board = game.getBoard();
      infoDiv.textContent = message;

      board.forEach((row, rowIndex) => {
         const rowDiv = document.createElement('div');
         rowDiv.classList.add("board__row");
         rowDiv.dataset.row = rowIndex;
         boardDiv.appendChild(rowDiv);
         row.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add("board__cell");
            cellButton.dataset.column = index;
            cellButton.textContent = cell.getValue() === 0 ? ' ' : cell.getValue();
            rowDiv.appendChild(cellButton);
         });
      });
   }

   const updateAside = (players, winningCells) => {
      document.getElementById('player1-name').textContent = players[0].name;
      document.getElementById('player1-marker').textContent = players[0].marker;
      document.getElementById('player1-score').textContent = players[0].score;

      document.getElementById('player2-name').textContent = players[1].name;
      document.getElementById('player2-marker').textContent = players[1].marker;
      document.getElementById('player2-score').textContent = players[1].score;

      document.querySelector('.aside-page__wins span').textContent = winningCells;
   }

   function clickHandlerBoard(e) {
      const rowDiv = e.target.closest('.board__row');
      if (!rowDiv) return;

      const row = rowDiv.dataset.row;
      const column = e.target.dataset.column;
      if (row && column) {
         game.playRound([parseInt(row), parseInt(column)]);
      }
   }

   const removeClickHandler = () => {
      unbindEvents();
   }

   init();

   const game = GameController(updateScreen, removeClickHandler, playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, updateAside);

   updateScreen(`${game.getActivePlayer().name}'s turn.`);

   return { updateAside };
}

export { ScreenController };
