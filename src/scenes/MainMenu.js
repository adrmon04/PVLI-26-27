export default class MainMenu extends Phaser.Scene {

    // Inicializa los datos de la instancia.
	constructor() {
		super({ key: 'MainMenu' });
	}

    // Inicializa los datos de la escena.
	init(){

	}

    // Carga los recursos necesarios.
	preload(){
		// Cargamos la hoja de sprites de los botones de "INICIAR PARTIDA" y "CRÉDITOS"
		this.load.spritesheet("mainMenuButtons", "Assets/images/hUD/buttonsSpritesheet.png", {
			frameWidth: 144, // Ancho total de la hoja partido del número de columnas
			frameHeight: 32, // Altura total de la hoja partido del número de filas
		});
	}

    // Construye los elementos de la escena.
	create(){
		// El fondo va primero para que quede detrás del título y de los botones.
		this.createBackground();
		//This.createTitle();
		// Añadimos los botones
		const startButton = this.add.sprite(this.scale.width * 5 / 6, this.scale.height * 5 / 7,
			"mainMenuButtons", 0).setInteractive();
		const creditsButton = this.add.sprite(this.scale.width * 5 / 6, this.scale.height * 6 / 7,
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
		// Si se pasa el ratón por encima o si se pulsa
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

    // Construye el fondo visual.
	createBackground() {
		// Usa el tamaño interno del juego para dibujar un fondo que cubra todo el canvas.
		const { width, height } = this.scale;
		// La profundidad negativa mantiene el fondo detrás de los demás elementos.
		const background = this.add.graphics().setDepth(-2);

		// Base oscura y dos resplandores concéntricos para imitar las luces de neón del HTML.
		background.fillStyle(0x0d0912, 1);
		background.fillRect(0, 0, width, height);

		// Cada círculo es un poco mayor que el anterior; su baja opacidad crea un degradado.
		for (let i = 8; i > 0; i--) {
			background.fillStyle(0xe4204d, 0.012);
			background.fillCircle(width * 0.9, height * 0.05, i * 48);
			background.fillStyle(0x4628be, 0.012);
			background.fillCircle(width * 0.05, height, i * 45);
		}

		// Distribuye puntos aleatorios como estrellas y polvo digital.
		background.lineStyle(1, 0xffffff, 0.12);
		for (let i = 0; i < 48; i++) {
			const x = Phaser.Math.Between(0, width);
			const y = Phaser.Math.Between(0, height);
			background.fillStyle(i % 5 === 0 ? 0xee3d84 : 0xffffff, 0.35);
			background.fillCircle(x, y, i % 5 === 0 ? 1.5 : 1);
		}

		// La rejilla se dibuja sobre el fondo, pero debajo del título y de los botones.
		const grid = this.add.graphics().setDepth(-1);
		// Punto de fuga de las líneas de perspectiva.
		const horizon = height * 0.62;
		const drawGrid = (offset = 0) => {
			// Se redibuja la rejilla para desplazarla ligeramente y simular movimiento.
			grid.clear();
			grid.lineStyle(1, 0xee3d84, 0.22);

			// Líneas horizontales: el espaciado aumenta según se acercan al borde inferior.
			for (let i = 0; i <= 12; i++) {
				const progress = i / 12;
				const y = horizon + Math.pow(progress, 2) * (height - horizon) + offset;
				if (y <= height) {
					grid.lineBetween(0, y, width, y);
				}
			}

			// Líneas verticales que convergen en el punto de fuga.
			for (let i = -10; i <= 10; i++) {
				grid.lineBetween(width / 2, horizon, width / 2 + i * 72, height);
			}
		};

	}
	//
	update(){

	}
}