import MainGame from "./Scenes/MainGame.js";
import MainMenu from "./Scenes/MainMenu.js";
import Credits from "./Scenes/Credits.js";


/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
	type: Phaser.AUTO,
	// Resolución interna (16:9): 480 px de alto = 15 tiles visibles, como en los juegos de referencia
	width: 854,
	height: 480,
	// Div interior del marco CRT: Phaser ajusta el canvas a su tamaño
	parent: 'gameCanvas',
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT
	},	
	scene: [ MainMenu, MainGame, Credits ],	// Decimos a Phaser cual es nuestra escena, en este caso la escena es un 
	//objeto formado por el método preload y create definidos más abajo en 
	//este mismo archivo
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	}
};

new Phaser.Game(config);

