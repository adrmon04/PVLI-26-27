export default class Credits extends Phaser.Scene {
	constructor() {
		super({ key: 'Credits' });
	}

	preload() {
		this.load.spritesheet("menuButtons", "assets/botones_spritesheet2.png", {
			frameWidth: 144, // Ancho total de la hoja partido del número de columnas
			frameHeight: 32, // Altura total de la hoja partido del número de filas
		});
	}

	create() {
		const fuente = new FontFace('Fuente', 'url(assets/fuente.ttf)');
		fuente.load().then((loaded) => {
			document.fonts.add(loaded);

			this.add.text(400, 100, 'CREDITOS', { fontSize: '36px', fontFamily: 'Fuente', fill: '#fff' }).setOrigin(0.5);
			this.add.text(400, 150, 'JUEGO DESARROLLADO POR: ADRIAN, NICOLAS, ARTURO y PABLO', { fontSize: '24px', fontFamily: 'Fuente', fill: '#fff' }).setOrigin(0.5);
			this.add.text(400, 200, 'PVLI 26/27', { fontSize: '24px', fontFamily: 'Fuente', fill: '#fff' }).setOrigin(0.5);
			this.add.text(400, 250, 'GRACIAS POR JUGAR!', { fontSize: '24px', fontFamily: 'Fuente', fill: '#fff' }).setOrigin(0.5);
		});

		const menuButton = this.add.sprite(this.scale.width / 2, this.scale.height * 3 / 4,
			"menuButtons", 0).setInteractive();

		// Creamos las animaciones que se darán al pulsar cada botón
		this.anims.create({
			key: "startButtonAnimation",
			frames: this.anims.generateFrameNumbers("menuButtons", {
				start: 2, end: 5
			}),
			frameRate: 12,
			repeat: 0
		});


		// Nos encargamos de que que cambie la apariencia del botón en función de
		// si se pasa el ratón por encima o si se pulsa
		menuButton.on("pointerover", () => {
			menuButton.setFrame(1);
		});
		menuButton.on("pointerout", () => {
			menuButton.setFrame(0);
		});
		menuButton.on("pointerdown", () => {
			menuButton.disableInteractive(); // Para evitar doble clic
			menuButton.play("startButtonAnimation");
			// Para que hasta que no termine la animación no se cambie de escena
			menuButton.once("animationcomplete-startButtonAnimation", () => {
				this.scene.start("MainMenu");
			});
		});
	}
}

