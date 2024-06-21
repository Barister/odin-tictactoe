function Gameboard(rows, columns) {
   const board = [];

   for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
         board[i].push(Cell());
      }
   }

   //console.log(board);

   const getBoard = () => board;

   const markCell = (row, column, player) => {


      console.log('board:', board);
      console.log(row, column, player);
      console.log(board[row][column]);

      if (board[row][column].getValue() === 0) {
         board[row][column].AddMarker(player);
         return true;
      }
      return false;
   }

   return { getBoard, markCell };
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
   playerOneName,
   playerOneMarker,
   playerTwoName,
   playerTwoMarker,
   rows,
   columns,
   winningScore,
   updateAsideCallback
) {
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

      const winningCombinations = [
         [[0, 0], [0, 1], [0, 2]],
         [[1, 0], [1, 1], [1, 2]],
         [[2, 0], [2, 1], [2, 2]],
         [[0, 0], [1, 0], [2, 0]],
         [[0, 1], [1, 1], [2, 1]],
         [[0, 2], [1, 2], [2, 2]],
         [[0, 0], [1, 1], [2, 2]],
         [[2, 0], [1, 1], [0, 2]]
      ];

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
            activePlayer.score++;
            updateAsideCallback(players, winningScore);
            if (activePlayer.score === winningScore) {
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
      for (let i = 0; i < rows; i++) {
         for (let j = 0; j < columns; j++) {
            board.getBoard()[i][j] = Cell();
         }
      }
      updateScreenCallback(`${getActivePlayer().name}'s turn`);
   }

   return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      resetBoard
   }
}

function ScreenController(playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, winningScore) {
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

   const updateAside = (players, winningScore) => {
      document.getElementById('player1-name').textContent = players[0].name;
      document.getElementById('player1-marker').textContent = players[0].marker;
      document.getElementById('player1-score').textContent = players[0].score;

      document.getElementById('player2-name').textContent = players[1].name;
      document.getElementById('player2-marker').textContent = players[1].marker;
      document.getElementById('player2-score').textContent = players[1].score;

      document.querySelector('.aside-page__wins span').textContent = winningScore;
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
      boardDiv.removeEventListener('click', clickHandlerBoard);
   }

   init();

   const game = GameController(updateScreen, removeClickHandler, playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, winningScore, updateAside);

   updateScreen(`${game.getActivePlayer().name}'s turn.`);

   return { updateAside };
}

export { ScreenController };

