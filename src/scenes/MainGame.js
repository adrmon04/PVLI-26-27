import Player from '../Entities/Player/Player.js';
import HUD from '../UI/HUD.js';
import ShortRangeWeapon from '../Entities/Weapons/ShortRangeWeapon.js';
import LongRangeWeapon from '../Entities/Weapons/LongRangeWeapon.js';
import Enemy from '../Entities/Enemies/Enemy.js';

/**
 * Escena principal.
 * @extends Phaser.Scene
 */

export default class MainGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGame' });
    }

    // preload - método de las escenas donde se pueden cargar los recursos que necesitaremos
    preload() {

        //Cargamos los assets desde nuestra raiz del proyecto
        this.load.image('fondo', 'assets/space.png');

        // Cargamos la hoja de sprites del jugador
		this.load.spritesheet("player_right", "assets/player_right.png", {
            frameWidth: 192,
            frameHeight: 192
        });
        
		this.load.spritesheet("player_left", "assets/player_left.png", {
            frameWidth: 192,
            frameHeight: 192
        });

        // Hojas de sprites de las armas equipadas (imágenes escaladas x4)
        this.load.spritesheet("MechanicalKeyboard", "assets/Armas/Combat/MechanicalKeyboard.png", {
            frameWidth: 640,
            frameHeight: 640
        });

        this.load.spritesheet("CPU", "assets/Armas/Combat/CPU.png", {
            frameWidth: 640,
            frameHeight: 640
        });

        this.load.spritesheet("HDMICable", "assets/Armas/Combat/HDMICable.png", {
            frameWidth: 640,
            frameHeight: 256
        });

        this.load.spritesheet("CommandUSB", "assets/Armas/Combat/CommandUSB.png", {
            frameWidth: 384,
            frameHeight: 384
        });

        this.load.spritesheet("PortablePrinter", "assets/Armas/Combat/PortablePrinter.png", {
            frameWidth: 384,
            frameHeight: 384
        });

        this.load.spritesheet("Router", "assets/Armas/Combat/Router.png", {
            frameWidth: 384,
            frameHeight: 384
        });

        // Armas que aparecen en el suelo (4 columnas x 6 filas, una fila por arma)
        this.load.spritesheet("FloorWeapons", "assets/Armas/Objects/FloorWeapons.png", {
            frameWidth: 384,
            frameHeight: 256
        });

        // Hojas de sprites de los proyectiles (frames 0-3: proyectil en vuelo, 5-9: impacto)
        this.load.spritesheet("CommandUSBProyectile", "assets/Armas/Proyectiles/CommandUSB_proyectile.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("PortablePrinterProyectile", "assets/Armas/Proyectiles/PortablePrinter_proyectile.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("RouterProyectile", "assets/Armas/Proyectiles/Router_proyectile.png", {
            frameWidth: 128,
            frameHeight: 128
        });

        // Assets del HUD
        this.load.spritesheet('hudLife', 'assets/HUD/IconoVida.png', {
            frameWidth: 16,
            frameHeight: 32
        });
        this.load.spritesheet('hudCoin', 'assets/HUD/IconoMoneda.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('hudWeaponSlot', 'assets/HUD/IconoArma.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    // create - método de las escenas que se llama una vez la escena está instanciada
    create() {

        //Imagen de fondo
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        // Creamos el jugador y lo añadimos a la escena
        this.player = new Player(100, 100, this, this.cameras.main.centerX,
            this.cameras.main.centerY, 300, 400, 'player_right', 0);
            
        // Creamos un enemigo
        this.enemy = new Enemy(100, 20, this, 0, 0, 50, 2/3, 'player_right', this.player);
        
        // roundPixels = true para que la cámara no dibuje en posiciones decimales
        this.cameras.main.startFollow(this.player, true);

        //Creamos el HUD
        this.hud = new HUD(this);

        this.weapon = new LongRangeWeapon(this, this.player.x + 50, this.player.y, 'CommandUSB', 1, 20, 200, 'CommandUSBProyectile', 300);

        this.physics.add.overlap(this.enemy, this.player, (enemy, player) => {
            if (enemy.canAttack()) {
                player.takeDamage(enemy.damage);
            }
        });

        this.physics.add.collider(this.enemy, this.weapon.proyectiles, (enemy, proyectil) => {
            
            // Sacamos la información del daño del proyectil 
            const proyectileDamage = proyectil.getData('damage');

            // Hacemos que el enemigo reciba ese daño 
            enemy.takeDamage(proyectileDamage);

            // Y destruimos el proyectil
            proyectil.destroy();
        });

        // ------------------------------------ANIMACIONES JUGADOR-----------------------------------------

        // Creamos la animación de idle del jugador
		this.anims.create({
			key: "player_idle_right",
			frames: this.anims.generateFrameNames("player_right", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		})
		
        this.anims.create({
            key: "player_idle_left",
            frames: this.anims.generateFrameNames("player_left", { start: 0, end: 7}),
            frameRate: 6,
            repeat: -1
        })
		
        // Creamos la animación de movimiento del jugador
		this.anims.create({
			key: "player_mov_right",
			frames: this.anims.generateFrameNames("player_right", { start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		})
		
		this.anims.create({
			key: "player_mov_left",
			frames: this.anims.generateFrameNames("player_left", { start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		})

        // ------------------------------------ANIMACIONES ARMAS-----------------------------------------
        
        // Creamos animacion de las armas al utilizarlas
        this.anims.create({
            key: "MechanicalKeyboard_fire",
            frames: this.anims.generateFrameNames("MechanicalKeyboard", { start: 6, end: 11}),
            frameRate: 6,
            repeat: -1
        })
        
		this.anims.create({
            key: "CPU_fire",
			frames: this.anims.generateFrameNames("CPU", { start: 6, end: 11}),
			frameRate: 6,
			repeat: -1
		})
        
		this.anims.create({
            key: "HDMICable_fire",
			frames: this.anims.generateFrameNames("HDMICable", { start: 6, end: 11}),
			frameRate: 6,
			repeat: -1
		})
        
        this.anims.create({
            key: "CommandUSB_fire",
            frames: this.anims.generateFrameNames("CommandUSB", { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: "PortablePrinter_fire",
            frames: this.anims.generateFrameNames("PortablePrinter", { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: "Router_fire",
            frames: this.anims.generateFrameNames("Router", { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        })

        //Creamos animaciones de idle de las armas que aparecen en el suelo
		this.anims.create({
			key: "MechanicalKeyboard_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CPU_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 4, end: 7}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "HDMICable_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 8, end: 11}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "CommandUSB_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 12, end: 15}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "PortablePrinter_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 16, end: 19}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "Router_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 20, end: 23}),
			frameRate: 6,
			repeat: -1
		})

        // Creamos animaciones de los proyectiles de las armas
		this.anims.create({
			key: "CommandUSB_proyectile",
			frames: this.anims.generateFrameNames("CommandUSBProyectile", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "PortablePrinter_proyectile",
			frames: this.anims.generateFrameNames("PortablePrinterProyectile", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})

		this.anims.create({
			key: "Router_proyectile",
			frames: this.anims.generateFrameNames("RouterProyectile", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		})
    }

    update() {
        if (this.hud && this.player) {
        this.hud.update(this.player);
        }
    }
}