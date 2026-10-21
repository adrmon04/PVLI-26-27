export default class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' });
	}

	init(){

	}

	preload(){

		// Carga del logo del juego
		this.load.image("stratImage", "assets/phaser3-logo.png")

		// Cargamos la hoja de sprites de los botones de "INICIAR PARTIDA" y "CRÉDITOS"
		this.load.spritesheet("mainMenuButtons", "assets/botones_spritesheet.png", {
			frameWidth: 432 / 3, // Ancho total de la hoja partido del número de columnas
			frameHeight: 64 / 2, // Altura total de la hoja partido del número de filas
		});
	}

	create(){

		// Añadimos los botones y nos encargamos de que cambie su apariencia en función
		// de si el jugador pasa el ratón sobre ellos
		const startButton = this.add.sprite(this.scale.width * 1 / 3, this.scale.height * 1 / 3,
			"mainMenuButtons", 0).setInteractive();
		startButton.on("pointerover", () => {
			startButton.setFrame(1);
		});
		startButton.on("pointerout", () => {
			startButton.setFrame(0);
		});
		startButton.on("pointerdown", () => {
			this.scene.start("MainGame");
		});
		const creditsButton = this.add.sprite(this.scale.width * 2 / 3, this.scale.height * 1 / 3,
			"mainMenuButtons", 3).setInteractive();
		creditsButton.on("pointerover", () => {
			creditsButton.setFrame(4);
		});
		creditsButton.on("pointerout", () => {
			creditsButton.setFrame(3);
		});
		creditsButton.on("pointerdown", () => {
			this.scene.start("Credits");
		});
	}

	update(){

	}
}