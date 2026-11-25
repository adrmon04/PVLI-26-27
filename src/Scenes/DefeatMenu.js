export default class DefeatMenu extends Phaser.Scene {

    // Inicializa los datos de la instancia.
    constructor (){
        super({ key: 'DefeatMenu'})
    }

    // Inicializa los datos de la escena.
    init(){

	}

    // Carga los recursos necesarios.
	preload(){
		// Cargamos la hoja de sprites de los botones de "INICIAR PARTIDA" y "CRÉDITOS"
		this.load.spritesheet("defeatMenuButtons", "Assets/images/hUD/buttonsSpritesheet2.png", {
			frameWidth: 144, // Ancho total de la hoja partido del número de columnas
			frameHeight: 32, // Altura total de la hoja partido del número de filas
		});
	}

    // Construye los elementos de la escena.
    create() {
        const fuente = new FontFace('Fuente', 'url(Assets/fonts/fuente.ttf)');
        fuente.load().then((loaded) => {
            document.fonts.add(loaded);
        });

        this.add.text(435, 150, 'GAME OVER', { fontSize: '50px',fontFamily: 'Fuente', fill: '#fff' }).setOrigin(0.5);

        const newGameButton = this.add.sprite(this.scale.width * 1 / 3, this.scale.height * 1 / 2,
			"defeatMenuButtons", 6).setInteractive();

        const mainMenuButton = this.add.sprite(this.scale.width * 2 / 3, this.scale.height * 1 / 2,
			"defeatMenuButtons", 0).setInteractive();

		// Creamos las animaciones que se darán al pulsar cada botón
		this.anims.create({
			key: "newGameButtonAnimation",
			frames: this.anims.generateFrameNumbers("defeatMenuButtons", { start: 8, end: 11
			}),
			frameRate: 12,
			repeat: 0
		});
		this.anims.create({
			key: "mainMenuButtonAnimation",
			frames: this.anims.generateFrameNumbers("defeatMenuButtons", { start: 2, end: 5
			}),
			frameRate: 12,
			repeat: 0
		});

		// Nos encargamos de que que cambie la apariencia del botón en función de
		// Si se pasa el ratón por encima o si se pulsa
		newGameButton.on("pointerover", () => {
			newGameButton.setFrame(7);
		});

		newGameButton.on("pointerout", () => {
			newGameButton.setFrame(6);
		});

		newGameButton.on("pointerdown", () => {
			newGameButton.disableInteractive(); // Para evitar doble clic
			newGameButton.play("newGameButtonAnimation");
			// Para que hasta que no termine la animación no se cambie de escena
			newGameButton.once("animationcomplete-newGameButtonAnimation", () => {
				this.scene.start("MainGame");
			});
		});

		mainMenuButton.on("pointerover", () => {
			mainMenuButton.setFrame(1);
		});

		mainMenuButton.on("pointerout", () => {
			mainMenuButton.setFrame(0);
		});

		mainMenuButton.on("pointerdown", () => {
			mainMenuButton.disableInteractive();
			mainMenuButton.play("mainMenuButtonAnimation");
			mainMenuButton.once("animationcomplete-mainMenuButtonAnimation", () => {
				this.scene.start("MainMenu");
			});
		});
	}
}