export function initializePopup(startGameCallback) {
   const modal = document.getElementById('welcome-modal');
   const form = document.getElementById('settings-form');

   form.addEventListener('submit', handleFormSubmit);

   function handleFormSubmit(event) {
      event.preventDefault();

      const player1Name = document.getElementById('player1-name').value || 'Player 1';
      const player1Marker = document.getElementById('player1-input-marker').value || 'X';
      const player2Name = document.getElementById('player2-name').value || 'Player 2';
      const player2Marker = document.getElementById('player2-input-marker').value || 'O';
      const boardSize = parseInt(document.getElementById('board-size').value, 10) || 3;
      const timeWins = parseInt(document.getElementById('time-input-wins').value, 10) || 3;

      startGameCallback(player1Name, player1Marker, player2Name, player2Marker, boardSize, boardSize, timeWins);

      modal.style.display = 'none';
      listenRestart();
   }

   function listenRestart() {
      const restartButton = document.querySelector('.aside-page__button');

      if (restartButton) {
         restartButton.addEventListener('click', handleRestartClick);
      } else {
         console.error('Restart button not found');
      }
   }

   function handleRestartClick(event) {
      console.log('restart button click');
      modal.style.display = 'flex';
   }
}
