import MainGame from "./scenes/MainGame.js";
import MainMenu from "./scenes/MainMenu.js";
import Creditos from "./scenes/Credits.js";
import Credits from "./scenes/Credits.js";

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
	type: Phaser.AUTO,
	width: 800,
	height: 450,
	parent: 'gameContainer',
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT
	},	
	scene: [ MainGame, MainMenu, Credits ],	// Decimos a Phaser cual es nuestra escena, en este caso la escena es un 
	//objeto formado por el método preload y create definidos más abajo en 
	//este mismo archivo
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: false
		}
	}
};

new Phaser.Game(config);

