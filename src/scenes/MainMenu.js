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
			frameWidth: 144, // Ancho total de la hoja partido del número de columnas
			frameHeight: 32, // Altura total de la hoja partido del número de filas
		});
	}

	create(){

		// Añadimos los botones
		const startButton = this.add.sprite(this.scale.width * 1 / 3, this.scale.height * 1 / 3,
			"mainMenuButtons", 0).setInteractive();
		const creditsButton = this.add.sprite(this.scale.width * 2 / 3, this.scale.height * 1 / 3,
			"mainMenuButtons", 6).setInteractive();

		// Creamos las animaciones que se darán al pulsar cada botón
		this.anims.create({
			key: "startButtonAnimation",
			frames: this.anims.generateFrameNumbers("mainMenuButtons", { start: 2, end: 5
			}),
			frameRate: 12,
			repeat: 0
		});
		this.anims.create({
			key: "creditsButtonAnimation",
			frames: this.anims.generateFrameNumbers("mainMenuButtons", { start: 8, end: 11
			}),
			frameRate: 12,
			repeat: 0
		});


		// Nos encargamos de que que cambie la apariencia del botón en función de
		// si se pasa el ratón por encima o si se pulsa
		startButton.on("pointerover", () => {
			startButton.setFrame(1);
		});
		startButton.on("pointerout", () => {
			startButton.setFrame(0);
		});
		startButton.on("pointerdown", () => {
			startButton.disableInteractive(); // Para evitar doble clic
			startButton.play("startButtonAnimation");
			// Para que hasta que no termine la animación no se cambie de escena
			startButton.once("animationcomplete-startButtonAnimation", () => {
				this.scene.start("MainGame");
			});
		});
		creditsButton.on("pointerover", () => {
			creditsButton.setFrame(7);
		});
		creditsButton.on("pointerout", () => {
			creditsButton.setFrame(6);
		});
		creditsButton.on("pointerdown", () => {
			creditsButton.disableInteractive();
			creditsButton.play("creditsButtonAnimation");
			creditsButton.once("animationcomplete-creditsButtonAnimation", () => {
				this.scene.start("Credits");
			});
		});
	}

	update(){

	}
}