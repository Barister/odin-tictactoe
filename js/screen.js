import { GameController } from './game.js';

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
      unbindEvents();
   }

   init();

   const game = GameController(updateScreen, removeClickHandler, playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, updateAside, winningScore);

   updateScreen(`${game.getActivePlayer().name}'s turn.`);

   return { updateAside };
}

export { ScreenController };
