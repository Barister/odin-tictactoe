import { GameController } from './game.js';
import { initializePopup } from './popup.js';

document.addEventListener('DOMContentLoaded', () => {
   initializePopup();
});

function startGame(player1Name, player1Marker, player2Name, player2Marker, boardSize, timeWins) {
   const game = GameController(player1Name, player1Marker, player2Name, player2Marker, boardSize, timeWins);
   game.init();
}