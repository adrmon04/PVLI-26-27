export default class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' });
	}

	init(){

	}

	preload(){

		
		// Cargamos la hoja de sprites de los botones de "INICIAR PARTIDA" y "CRÉDITOS"
		this.load.spritesheet("mainMenuButtons", "assets/ButtonsSpritesheet.png", {
			frameWidth: 144, // Ancho total de la hoja partido del número de columnas
			frameHeight: 32, // Altura total de la hoja partido del número de filas
		});
		
		// Carga del logo del juego
		this.load.image("stratImage", "assets/phaser3.png")

		// Cargamos la hoja de sprites del jugador
		this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 192,
            frameHeight: 192
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

		// Creamos la animación idle del jugador
		this.anims.create({
			key: "player_idle",
			frames: this.anims.generateFrameNames("player", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		})
		
		// Creamos la animación de movimiento del jugador
		this.anims.create({
			key: "player_mov",
			frames: this.anims.generateFrameNames("player", { start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CommandUSB_fire",
			frames: this.anims.generateFrameNames("CommandUSB", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "PortablePrinter_fire",
			frames: this.anims.generateFrameNames("PortablePrinter", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "Router_fire",
			frames: this.anims.generateFrameNames("Router", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CPU_fire",
			frames: this.anims.generateFrameNames("CPU", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "HDMICable_fire",
			frames: this.anims.generateFrameNames("HDMICable", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "MechanicalKeyboard_fire",
			frames: this.anims.generateFrameNames("MechanicalKeyboard", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CommandUSB_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "PortablePrinter_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 4, end: 7}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "Router_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 8, end: 11}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CPU_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 12, end: 15}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "HDMICable_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 16, end: 19}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "MechanicalKeyboard_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 20, end: 23}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CommandUSB_proyectile",
			frames: this.anims.generateFrameNames("CommandUSBProyectile", { start: 0, end: 9}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "PortablePrinter_proyectile",
			frames: this.anims.generateFrameNames("PortablePrinterProyectile", { start: 0, end: 9}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "Router_proyectile",
			frames: this.anims.generateFrameNames("RouterProyectile", { start: 0, end: 9}),
			frameRate: 6,
			repeat: -1
		})
	}


	update(){

	}
}