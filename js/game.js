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
            board[i][j].reset();
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

   const reset = () => {
      value = 0;
   }

   return { AddMarker, getValue, reset };
}

function GameController(
   init,
   updateScreenCallback,
   removeClickHandler,
   playerOneName,
   playerOneMarker,
   playerTwoName,
   playerTwoMarker,
   rows,
   columns,
   updateAsideCallback,
   winningScore
) {
   let winningCells = getWinningCells(rows); // Определение winningCells
   let board = Gameboard(rows, columns);

   const continueButton = document.querySelector('#continue-button');
   let continueClickHandler = null; // Обработчик клика на кнопке continue

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
   let gameInProgress = true; // Флаг, указывающий на текущее состояние игры

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const getActivePlayer = () => activePlayer;

   const checkWinner = () => {
      const currentBoard = board.getBoard().map(row => row.map(cell => cell.getValue()));

      const checkLine = (line) => {
         let count = 0;
         let lastMarker = null;
         for (const [row, col] of line) {
            const cellValue = currentBoard[row][col];
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

      // Проверка всех строк
      for (let i = 0; i < rows; i++) {
         if (checkLine([...Array(columns).keys()].map(j => [i, j]))) return true;
      }

      // Проверка всех столбцов
      for (let i = 0; i < columns; i++) {
         if (checkLine([...Array(rows).keys()].map(j => [j, i]))) return true;
      }

      // Проверка всех главных диагоналей
      for (let i = 0; i <= rows - winningCells; i++) {
         for (let j = 0; j <= columns - winningCells; j++) {
            if (checkLine([...Array(winningCells).keys()].map(k => [i + k, j + k]))) return true;
         }
      }

      // Проверка всех побочных диагоналей
      for (let i = 0; i <= rows - winningCells; i++) {
         for (let j = winningCells - 1; j < columns; j++) {
            if (checkLine([...Array(winningCells).keys()].map(k => [i + k, j - k]))) return true;
         }
      }

      return false;
   }

   const checkDraw = () => {
      const currentBoard = board.getBoard();

      for (let i = 0; i < rows; i++) {
         for (let j = 0; j < columns; j++) {
            if (currentBoard[i][j].getValue() === 0) {
               return false;
            }
         }
      }

      return true;
   }

   // Обработчик клика на кнопке Continue
   const handleContinueClick = (e) => {
      if (!gameInProgress) {
         resetRound();
         continueButton.removeEventListener('click', handleContinueClick);
         continueClickHandler = null;
         init();
      }

      e.stopPropagation(); // Stop event propagation if handled correctly
   };

   // Добавление обработчика клика на кнопку Continue
   const addContinueClickHandler = () => {
      continueClickHandler = handleContinueClick;
      continueButton.addEventListener('click', continueClickHandler);
   };

   // Удаление обработчика клика на кнопке Continue
   const removeContinueClickHandler = () => {
      if (continueClickHandler) {
         continueButton.removeEventListener('click', continueClickHandler);
         continueClickHandler = null;
      }
   };

   const playRound = (selectedCell) => {
      if (!gameInProgress) return; // Если игра не идет, игнорируем дальнейшие действия

      const [row, column] = selectedCell;

      if (board.markCell(row, column, getActivePlayer().marker)) {
         const winner = checkWinner();
         const draw = checkDraw();

         if (winner) {
            gameInProgress = false; // Игра закончена после победы
            activePlayer.score++;
            updateAsideCallback(players, winningScore); // Передача winningScore

            if (activePlayer.score === winningScore) {
               updateScreenCallback(`${getActivePlayer().name} wins the game!`);
               removeClickHandler();

            } else {
               updateScreenCallback(`${getActivePlayer().name} wins this round!`);
               removeClickHandler();

               addContinueClickHandler();
            }
            return
         } else if (draw) {
            updateScreenCallback('It\'s a draw!');
            gameInProgress = false;

            addContinueClickHandler();
            return
         }

         switchPlayerTurn();
         updateScreenCallback(`${getActivePlayer().name}'s turn`);
      } else {
         updateScreenCallback('Invalid move, try again.');
      }
   };

   const resetRound = () => {
      board.resetBoard();
      gameInProgress = true; // Восстанавливаем игру при сбросе доски

      updateScreenCallback(`${getActivePlayer().name}'s turn`);
   }

   const resetGame = () => {
      resetRound();
      removeContinueClickHandler(); // Удаляем обработчик клика на кнопке Continue при сбросе игры
   }

   return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      resetRound,
      resetGame
   }
}

export { GameController };

