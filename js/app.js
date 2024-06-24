import { initializePopup } from './popup.js';
import { ScreenController } from './screen.js';

document.addEventListener('DOMContentLoaded', () => {
   let screenController;

   const updateAside = (players, winningScore) => {
      if (screenController) {
         screenController.updateAside(players, winningScore);
      }
   };

   const startGame = (playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, winningScore) => {
      // Удаляем старый контроллер, если он существует
      if (screenController) {
         screenController.removeClickHandler();
         screenController = null;
      }

      screenController = new ScreenController(playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, winningScore);
   };

   initializePopup(startGame, updateAside);
});
