import { initializePopup } from './popup.js';
import { ScreenController } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
   initializePopup((player1Name, player1Marker, player2Name, player2Marker, boardSize, timeWins) => {
      new ScreenController(player1Name, player1Marker, player2Name, player2Marker, boardSize, timeWins);
   });
});
