//-------------------------------------Entidades-----------------------------------------
import Player from '../Entities/Player/Player.js';
import Enemy from '../Entities/Enemies/Enemy.js';
import Upgrade from '../Entities/Upgrades/Upgrade.js';

// ------------------------------------Nivel-----------------------------------------
import Level from '../World/Level.js';

// ------------------------------------Armas-----------------------------------------
import ShortRangeWeapon from '../Entities/Weapons/ShortRangeWeapon.js';
import LongRangeWeapon from '../Entities/Weapons/LongRangeWeapon.js';

// ------------------------------------UI-----------------------------------------
import HUD from '../UI/HUD.js';
import Popup from '../Entities/Enemies/Types/PopUP.js';

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
        // Cargamos el nivel y todas sus salas
        Level.preload(this);

        // Cargamos la hoja de sprites del jugador
		this.load.spritesheet("player_right", "Assets/images/entities/player/player_right.png", {
            frameWidth: 192,
            frameHeight: 192
        });
        
		this.load.spritesheet("player_left", "Assets/images/entities/player/player_left.png", {
            frameWidth: 192,
            frameHeight: 192
        });

        // Hojas de sprites de las armas equipadas (imágenes escaladas x4)
        this.load.spritesheet("MechanicalKeyboard", "Assets/images/weapons/combat/mechanicalKeyboard.png", {
            frameWidth: 640,
            frameHeight: 640
        });

        this.load.spritesheet("CPU", "Assets/images/weapons/combat/cPU.png", {
            frameWidth: 640,
            frameHeight: 640
        });

        this.load.spritesheet("HDMICable", "Assets/images/weapons/combat/hDMICable.png", {
            frameWidth: 640,
            frameHeight: 256
        });

        this.load.spritesheet("CommandUSB", "Assets/images/weapons/combat/commandUSB.png", {
            frameWidth: 384,
            frameHeight: 384
        });

        this.load.spritesheet("PortablePrinter", "Assets/images/weapons/combat/portablePrinter.png", {
            frameWidth: 384,
            frameHeight: 384
        });

        this.load.spritesheet("Router", "Assets/images/weapons/combat/router.png", {
            frameWidth: 384,
            frameHeight: 384
        });

        // Armas que aparecen en el suelo (4 columnas x 6 filas, una fila por arma)
        this.load.spritesheet("FloorWeapons", "Assets/images/weapons/objects/floorWeapons.png", {
            frameWidth: 384,
            frameHeight: 256
        });

        // Hojas de sprites de los proyectiles (frames 0-3: proyectil en vuelo, 5-9: impacto)
        this.load.spritesheet("CommandUSBProyectile", "Assets/images/weapons/proyectiles/commandUSB_proyectile.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("PortablePrinterProyectile", "Assets/images/weapons/proyectiles/portablePrinter_proyectile.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("RouterProyectile", "Assets/images/weapons/proyectiles/router_proyectile.png", {
            frameWidth: 128,
            frameHeight: 128
        });

        // Assets del HUD
        this.load.spritesheet('hudLife', 'Assets/images/hUD/iconoVida.png', {
            frameWidth: 16,
            frameHeight: 32
        });
        this.load.spritesheet('hudCoin', 'Assets/images/hUD/iconoMoneda.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('hudWeaponSlot', 'Assets/images/hUD/iconoArma.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        // Cargamos la hoja de sprites del enemigo Pop-up
        this.load.spritesheet('pop-up', 'Assets/images/entities/enemies/pop-upSpritesheet.png', {
            frameWidth: 1448,
            frameHeight: 788
        });

        // Hojas de sprites de las mejoras (8 frames de 800x1000)
        ['Antivirus', 'Overclock', 'Turbo', 'Luck', 'CrackedLicense'].forEach(key => {
            this.load.spritesheet(key, `Assets/images/upgrades/${key}.png`, {
                frameWidth: 800,
                frameHeight: 1000
            });
        });
    }

    // create - método de las escenas que se llama una vez la escena está instanciada
    create() {
        // Creamos el nivel y añadimos las entidades a todas las salas
        this.level = new Level(this);

        // Creamos el jugador en el centro del suelo de Sala1 y lo añadimos a la escena
        this.player = new Player(100, 100, this, 976, 880, 300, 1, 'player_right', 0);
            
        // Creamos enemigos
        this.enemies = [
        new Popup(100, 20, this, this.player.x - 450, this.player.y, 150, 'pop-up', 0, this.player, 300, 100),
        new Popup(100, 20, this, this.player.x - 550, this.player.y, 150, 'pop-up', 0, this.player, 300, 100),
        new Popup(100, 20, this, this.player.x - 650, this.player.y, 150, 'pop-up', 0, this.player, 300, 100)
        ];

        // Agregacion de entidades(esto se hara en el futuro con una funcion en level)
        this.level.addEntity(this.player);
        this.enemies.forEach(enemy => this.level.addEntity(enemy));
        
        // roundPixels = true para que la cámara no dibuje en posiciones decimales
        this.cameras.main.startFollow(this.player, true);

        //Creamos el HUD
        this.hud = new HUD(this);

        this.weapons = [
            new LongRangeWeapon(this, this.player.x + 50, this.player.y, 'CommandUSB', 10, 20, 200, 300, 1, 1),
            new LongRangeWeapon(this, this.player.x + 100, this.player.y, 'PortablePrinter', 3, 100, 200, 300, 1, 3),
            new LongRangeWeapon(this, this.player.x + 150, this.player.y, 'Router', 1, 200, 200, 300, 2, 1),
            new ShortRangeWeapon(this, this.player.x - 50, this.player.y, 'MechanicalKeyboard', 3, 100, 10),
            new ShortRangeWeapon(this, this.player.x - 100, this.player.y, 'CPU', 1, 200, 20),
            new ShortRangeWeapon(this, this.player.x - 150, this.player.y, 'HDMICable', 10, 30, 10)
        ];

        this.upgrades = [
            new Upgrade(this, this.player.x, this.player.y - 50, 'Antivirus'),
            new Upgrade(this, this.player.x + 50, this.player.y - 50, 'Overclock'),
            new Upgrade(this, this.player.x + 100, this.player.y - 50, 'Turbo'),
            new Upgrade(this, this.player.x - 50, this.player.y - 50, 'Luck'),
            new Upgrade(this, this.player.x - 100, this.player.y - 50, 'CrackedLicense')
        ];

        // Profundidad: las capas de la sala usan 0-2, así que las entidades van por encima
        this.player.setDepth(3);
        this.enemies.forEach(enemy => enemy.setDepth(3));
        this.weapons.forEach(weapon => weapon.setDepth(4));
        this.upgrades.forEach(upgrade => upgrade.setDepth(4));

        // El daño se comprueba con las hurtboxes (cubren el dibujo), no con los body (que van en los pies).
        // owner es la entidad a la que pertenece cada hurtbox
        this.enemies.forEach(enemy => {
            this.physics.add.overlap(enemy.hurtbox, this.player.hurtbox, (enemyBox, playerBox) => {
                if (enemyBox.owner.canAttack()) {
                    playerBox.owner.takeDamage(enemyBox.owner.damage);
                }
            });
        });

        // Registramos cada grupo de proyectiles; las armas de corto alcance no tienen uno.
        this.weapons.forEach(weapon => {
            if (!(weapon instanceof LongRangeWeapon)) return;

            // overlap (y no collider) para que el proyectil no empuje a la hurtbox
            this.enemies.forEach(enemy => {
                this.physics.add.overlap(enemy.hurtbox, weapon.proyectiles, (enemyBox, proyectile) => {
                    enemyBox.owner.takeDamage(proyectile.getData('damage'));
                    if (proyectile.enemiesPenetrated <= 0) proyectile.destroy();
                    else proyectile.enemiesPenetrated--;
                });
            });
        });

        // ------------------------------------ANIMACIONES JUGADOR-----------------------------------------

        // Creamos la animación de idle del jugador
		this.anims.create({
			key: "player_idle_right",
			frames: this.anims.generateFrameNames("player_right", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		});
		
        this.anims.create({
            key: "player_idle_left",
            frames: this.anims.generateFrameNames("player_left", { start: 0, end: 7}),
            frameRate: 6,
            repeat: -1
        });
		
        // Creamos la animación de movimiento del jugador
		this.anims.create({
			key: "player_mov_right",
			frames: this.anims.generateFrameNames("player_right", { start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		});
		
		this.anims.create({
			key: "player_mov_left",
			frames: this.anims.generateFrameNames("player_left", { start: 8, end: 13}),
			frameRate: 6,
			repeat: -1
		});

        // ------------------------------------ANIMACIONES ENEMIGOS-----------------------------------------

        this.anims.create({
            key: 'pop-up_hidden',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 0, end: 3 }),
            frameRate: 5, 
            repeat: -1
        });

        this.anims.create({
            key: 'pop-up_appear',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 10, end: 17 }),
            frameRate: 13,
            repeat: 0
        });

        this.anims.create({
            key: 'pop-up_idle',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 20, end: 27}),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'pop-up_mov',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 30, end: 37}),
            frameRate: 11,
            repeat: -1
        });

        this.anims.create({
            key: 'pop-up_attack',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 40, end: 47 }),
            frameRate: 13,
            repeat: 0
        });

        this.anims.create({
            key: 'pop-up_explode',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 50, end: 59 }),
            frameRate: 12, 
            repeat: 0
        });

        this.anims.create({
            key: 'pop-up_death',
            frames: this.anims.generateFrameNumbers('pop-up', { start: 60, end: 67}),
            frameRate: 13,
            repeat: 0
        });

        // ------------------------------------ANIMACIONES ARMAS-----------------------------------------
        
        // Creamos animacion de las armas al utilizarlas
        this.anims.create({
            key: "MechanicalKeyboard_fire",
            frames: this.anims.generateFrameNames("MechanicalKeyboard", { start: 6, end: 11}),
            frameRate: 6,
            repeat: -1
        });
        
		this.anims.create({
            key: "CPU_fire",
			frames: this.anims.generateFrameNames("CPU", { start: 6, end: 11}),
			frameRate: 6,
			repeat: -1
		});
        
		this.anims.create({
            key: "HDMICable_fire",
			frames: this.anims.generateFrameNames("HDMICable", { start: 6, end: 11}),
			frameRate: 6,
			repeat: -1
		});
        
        this.anims.create({
            key: "CommandUSB_fire",
            frames: this.anims.generateFrameNames("CommandUSB", { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: "PortablePrinter_fire",
            frames: this.anims.generateFrameNames("PortablePrinter", { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: "Router_fire",
            frames: this.anims.generateFrameNames("Router", { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        });

        //Creamos animaciones de idle de las armas que aparecen en el suelo
		this.anims.create({
			key: "MechanicalKeyboard_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "CPU_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 4, end: 7}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "HDMICable_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 8, end: 11}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "CommandUSB_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 12, end: 15}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "PortablePrinter_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 16, end: 19}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "Router_idle",
			frames: this.anims.generateFrameNames("FloorWeapons", { start: 20, end: 23}),
			frameRate: 6,
			repeat: -1
		});

        // Creamos animaciones de los proyectiles de las armas
		this.anims.create({
			key: "CommandUSB_proyectile",
			frames: this.anims.generateFrameNames("CommandUSBProyectile", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "PortablePrinter_proyectile",
			frames: this.anims.generateFrameNames("PortablePrinterProyectile", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});

		this.anims.create({
			key: "Router_proyectile",
			frames: this.anims.generateFrameNames("RouterProyectile", { start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});

        // ------------------------------------ANIMACIONES MEJORAS-----------------------------------------

		this.anims.create({
			key: "Antivirus_idle",
			frames: this.anims.generateFrameNames("Antivirus", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		});

        this.anims.create({
			key: "Overclock_idle",
			frames: this.anims.generateFrameNames("Overclock", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		});

        this.anims.create({
			key: "Luck_idle",
			frames: this.anims.generateFrameNames("Luck", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		});

        this.anims.create({
			key: "CrackedLicense_idle",
			frames: this.anims.generateFrameNames("CrackedLicense", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		});

        this.anims.create({
			key: "Turbo_idle",
			frames: this.anims.generateFrameNames("Turbo", { start: 0, end: 7}),
			frameRate: 6,
			repeat: -1
		});
    }

    update() {
        if (this.hud && this.player) {
            this.hud.update(this.player);
        }

        if (this.player.isDead && !this.defeatShown) {
            this.defeatShown = true;
            this.scene.launch('DefeatMenu');
            this.scene.pause();
        }

        setTimeout(() => {
            this.player.showStats();
        }, 5000);
    }
}