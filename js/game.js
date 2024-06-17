
function Gameboard() {
   const rows = 3;
   const columns = 3;
   const board = [];


   for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
         board[i].push(Cell());
      }
   }

   const getBoard = () => board;

   const markCell = (row, column, player) => {

      if (board[row][column].getValue() === 0) {
         board[row][column].AddMarker(player);
         return true;
      }
      return false;
   }

   return { getBoard, markCell }
}

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
   playerOneName = 'Player One',
   playerTwoName = 'Player Two'
) {

   const board = Gameboard();

   const players = [
      {
         name: playerOneName,
         marker: 'X'
      },
      {
         name: playerTwoName,
         marker: 'O'
      }
   ];

   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const getActivePlayer = () => activePlayer;

   const checkWinner = () => {
      const currentBoard = board.getBoard();

      const winningCombinations = [
         [[0, 0], [0, 1], [0, 2]],
         [[1, 0], [1, 1], [1, 2]],
         [[2, 0], [2, 1], [2, 2]],
         [[0, 0], [1, 0], [2, 0]],
         [[0, 1], [1, 1], [2, 1]],
         [[0, 2], [1, 2], [2, 2]],
         [[0, 0], [1, 1], [2, 2]],
         [[2, 0], [1, 1], [0, 2]]
      ]

      for (const combination of winningCombinations) {
         const [a, b, c] = combination;

         if (currentBoard[a[0]][a[1]].getValue() && currentBoard[a[0]][a[1]].getValue() === currentBoard[b[0]][b[1]].getValue() && currentBoard[a[0]][a[1]].getValue() === currentBoard[c[0]][c[1]].getValue()) {


            return currentBoard[a[0]][a[1]].getValue();
         }
      }

      return null;
   }

   const playRound = (selectedCell) => {

      const [row, column] = selectedCell;

      if (board.markCell(row, column, getActivePlayer().marker)) {
         const winner = checkWinner();

         if (winner) {

            updateScreenCallback(`${getActivePlayer().name} wins!`);
            removeClickHandler();

            return;
         }

         switchPlayerTurn();
         updateScreenCallback(`${getActivePlayer().name}'s turn`);

      } else {
         updateScreenCallback('Invalid move, try again.');
      }
   };

   return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard
   };

}

function ScreenController() {

   let infoDiv, boardDiv;

   const init = () => {
      cacheDom();
   }

   const cacheDom = () => {
      infoDiv = document.querySelector('.page__player-turn');
      boardDiv = document.querySelector('.page__board');
   }

   const updateScreen = (message) => {

      //clear the board;
      boardDiv.textContent = '';

      // get the fresh board and player turn
      const board = game.getBoard();
      //const activePlayer = game.getActivePlayer();

      // display message

      infoDiv.textContent = message;

      // render board squares
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

   function clickHandlerBoard(e) {
      const selectedCell = [e.target.closest('.board__row').dataset.row, e.target.dataset.column];

      if (!selectedCell) return;

      game.playRound(selectedCell);

   }

   const removeClickHandler = () => {
      boardDiv.removeEventListener('click', clickHandlerBoard);
   }


   init();

   const game = GameController(updateScreen, removeClickHandler);

   boardDiv.addEventListener('click', clickHandlerBoard);

   updateScreen(`${game.getActivePlayer().name}'s turn.`);

}

ScreenController();

