import { initializePopup } from './popup.js';
import { ScreenController } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
   const updateAside = (players, winningScore) => {
      const screenController = new ScreenController();
      screenController.updateAside(players, winningScore);
   };

   const startGame = (playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, winningScore) => {
      const screenController = new ScreenController(playerOneName, playerOneMarker, playerTwoName, playerTwoMarker, rows, columns, winningScore);
      screenController.updateAside([{ name: playerOneName, marker: playerOneMarker, score: 0 }, { name: playerTwoName, marker: playerTwoMarker, score: 0 }], winningScore);
   };

   initializePopup(startGame, updateAside);
});
