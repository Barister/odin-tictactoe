
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

   console.log('board', board);

   const getBoard = () => board;

   const markCell = (row, column, player) => {

      console.log('board[row][column]', board[row][column], board[row][column].getValue() === 0);

      if (board[row][column].getValue() === 0) {
         board[row][column].AddMarker(player);
         return true;
      }
      return false;
   }

   const printBoard = () => {
      const boardWithMarkers = board.map(row => row.map(cell => cell.getValue()));
      console.log(boardWithMarkers);
   }

   return { getBoard, markCell, printBoard }
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
   playerOneName = 'Player One',
   playerTwoName = 'Player Two'
) {
   console.log('Let\'s the game begin!!!');

   const board = Gameboard();

   const players = [
      {
         name: playerOneName,
         marker: 1
      },
      {
         name: playerTwoName,
         marker: 2
      }
   ];

   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const getActivePlayer = () => activePlayer;

   const checkWinner = () => {
      const currentBoard = board.getBoard();

      console.log('currentBoard to check the winner:', currentBoard);

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

         console.log('currentBoard[a[0]][a[1]]:', currentBoard[a[0]][a[1]].getValue());

         if (currentBoard[a[0]][a[1]].getValue() && currentBoard[a[0]][a[1]].getValue() === currentBoard[b[0]][b[1]].getValue() && currentBoard[a[0]][a[1]].getValue() === currentBoard[c[0]][c[1]].getValue()) {


            return currentBoard[a[0]][a[1]].getValue();
         }
      }

      return null;
   }

   const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
   }

   const playRound = (selectedCell) => {

      const [row, column] = selectedCell;

      //console.log(row, column, getActivePlayer().marker, board.markCell(row, column, getActivePlayer().marker));

      if (board.markCell(row, column, getActivePlayer().marker)) {
         const winner = checkWinner();

         console.log('winner:', winner);

         if (winner) {
            board.printBoard();
            console.log(`${winner} wins!`);
            return;
         }

         switchPlayerTurn();
         printNewRound();

      } else {
         console.log('Invalid move, try again.');
      }
   };

   return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard
   };

}

function ScreenController() {

   const game = GameController();

   let playerTurnDiv, boardDiv;

   const init = () => {
      cacheDom();
   }

   const cacheDom = () => {
      playerTurnDiv = document.querySelector('.page__player-turn');
      boardDiv = document.querySelector('.page__board');

      console.log('cacheDom ready');
   }

   const updateScreen = () => {

      //clear the board;
      boardDiv.textContent = '';

      // get the fresh board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();

      // display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

      // render board squares
      board.forEach((row, rowIndex) => {
         const rowDiv = document.createElement('div');
         rowDiv.classList.add("row");
         rowDiv.dataset.row = rowIndex;
         boardDiv.appendChild(rowDiv);
         row.forEach((cell, index) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add("cell");
            cellButton.dataset.column = index;
            cellButton.textContent = cell.getValue();
            rowDiv.appendChild(cellButton);

         });
      });
   }

   function clickHandlerBoard(e) {
      const selectedCell = [e.target.closest('.row').dataset.row, e.target.dataset.column];

      if (!selectedCell) return;

      console.log('selectedCell', selectedCell);

      game.playRound(selectedCell);
      updateScreen();
   }



   init();

   boardDiv.addEventListener('click', clickHandlerBoard, true);

   updateScreen();

}

ScreenController();

