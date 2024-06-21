// Функция для определения winningCells в зависимости от размера доски
function getWinningCells(rows) {
   if (rows === 5) {
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

export { GameController };
