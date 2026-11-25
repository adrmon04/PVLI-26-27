/**
 * Clase que representa un arma
 * @extends Phaser.GameObjects.Sprite
 */
// Escala de dibujo de las armas y proyectiles (sus imágenes están escaladas x4).
// Con 0.18 las armas miden unos 36-45 px, en proporción a un jugador de 2 tiles
export const WEAPON_SCALE = 0.20;

// Distancia máxima al jugador para poder coger el arma
const PICKUP_RADIUS = 30;

/**
 * Datos de cada arma sacados de sus .tsx (Assets/images/weapons/combat).
 * Las medidas están en píxeles del tile original, sin el escalado x4 de los PNG.
 * - tileWidth / tileHeight: tamaño de un frame
 * - pivot: punto por el que se agarra el arma (sobre él gira y se coloca en la mano)
 * - holdPivot (opcional): pivote del frame en reposo (frame 0), si en ese frame el arma
 *   Está dibujada en otro sitio que en los frames de ataque. Durante el ataque se usa pivot
 * - fireStart / fireDurations: primer frame del ataque y duración en ms de cada frame
 * - muzzle: boca del arma, de donde salen los proyectiles (solo armas de largo alcance)
 * - hand (opcional): [x, y] desplazamiento de la mano para esta arma, en píxeles de pantalla
 *   (no gira con el arma; la x se refleja al apuntar a la izquierda). Ej: hand: [0, -4]
 * - heldScale (opcional): escala del arma cuando el jugador la lleva en la mano.
 *   Si no se indica, usa WEAPON_SCALE
 * - floorScale (opcional): escala del arma en el suelo (hoja FloorWeapons). Las armas
 *   Cuerpo a cuerpo ocupan casi todo su frame en esa hoja y con WEAPON_SCALE se ven enormes
 */
export const WEAPON_SPRITES = {
    MechanicalKeyboard: { tileWidth: 160, tileHeight: 160, pivot: [80, 80], holdPivot: [46, 80], heldScale: 0.20, floorScale: 0.15, fireStart: 6, fireDurations: [70, 50, 40, 50, 70, 90] },
    CPU: { tileWidth: 160, tileHeight: 160, pivot: [60, 96],hand: [6, 0], heldScale: 0.20, floorScale: 0.15, fireStart: 6, fireDurations: [160, 220, 90, 60, 160, 180] },
    HDMICable: { tileWidth: 160, tileHeight: 64, pivot: [20, 32], hand:[6, -4], heldScale: 0.20, floorScale: 0.15, fireStart: 6, fireDurations: [40, 40, 35, 60, 45, 50] },
    CommandUSB: { tileWidth: 96, tileHeight: 96, pivot: [20, 48],hand: [0, 4], fireStart: 4, fireDurations: [20, 40, 40, 40], muzzle: [64, 48] },
    PortablePrinter: { tileWidth: 96, tileHeight: 96, pivot: [10, 48], hand: [-6, 0], fireStart: 4, fireDurations: [30, 60, 60, 60], muzzle: [61, 48] },
    Router: { tileWidth: 96, tileHeight: 96, pivot: [10, 48],  hand: [-6, 0], fireStart: 4, fireDurations: [40, 70, 80, 90], muzzle: [53, 48] }
};

const PCTG_ATTACK_SPEED_UPGRADE = 20 / 100;
const PCTG_DAMAGE_UPGRADE = 25 / 100;

export default class Weapon extends Phaser.GameObjects.Sprite {

    /**
     * Constructor de Weapon
     * @param {Scene} scene - Escena en la que aparecerá el arma
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     * @param {string} imgKey - Nombre de la imagen que representa al arma
     * @param {number} attackSpeed - Velocidad de ataque del arma (ataques por segundo)
     * @param {number} damage - Daño que inflige el arma
     * @param {number} range - Rango del arma
     * @param {boolean} taken - Indica si el arma está en el suelo o cogida por el jugador
    */
    constructor(scene, x, y, imgKey, attackSpeed, damage, range, taken = false) {

        super(scene, x, y, imgKey);

        // Guardamos el imgKey del arma para identificar posteriormente sus animaciones
        this.imgKey = imgKey;

        // Datos del sprite del arma (pivote, frames de ataque...)
        this.spriteData = WEAPON_SPRITES[imgKey];

        // Le asignamos a cada propiedad su valor respectivo
        this.attackSpeed = attackSpeed;
        this.damage = damage;
        this.range = range;
        this.taken = taken;

        // Propiedad que indica si el arma se ha cogido o está en el suelo.
        // Se conserva el valor recibido desde el constructor para permitir armas ya recogidas.
        // Propiedad que indica cuándo el arma atacó/disparó por última vez
        this.lastFireTime = 0;

        // Tier del arma, max 3
        this.tier = 1;

        // Añadimos el arma a la escena
        this.scene.add.existing(this);

        // SetScale en vez de setDisplaySize para no deformar los frames que no son cuadrados
        // Empieza en el suelo, con su escala de suelo
        this.setScale(this.spriteData.floorScale ?? WEAPON_SCALE);

        // Guardamos el estado de la tecla 'E' (tecla para recoger armas)
        this.keys = this.scene.input.keyboard.addKeys('E');

        // Cuando termina el ataque, el arma vuelve a su frame de reposo
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation) => {
            if (animation.key === this.imgKey + "_fire") this.setFrame(0);
        });
    }

    /**
     * Crea las animaciones de ataque de todas las armas con la duración de cada frame de sus .tsx.
     * No se repiten: cada ataque reproduce la animación una vez
     * @param {Phaser.Scene} scene
     */
    static createFireAnimations(scene) {
        Object.entries(WEAPON_SPRITES).forEach(([key, { fireStart, fireDurations }]) => {
            scene.anims.create({
                key: key + "_fire",
                frames: fireDurations.map((duration, i) => ({ key, frame: fireStart + i, duration })),
                repeat: 0
            });
        });
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {

        super.preUpdate(t, dt);

        const player = this.scene.player;

        // Si el arma no se ha cogido, está cerca y se pulsa la tecla E, se coge el arma
        // (JustDown solo es true en el frame en que se pulsa, así no se intercambian las armas cada frame)
        if (!this.taken) {

            if (player && Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= PICKUP_RADIUS &&
            Phaser.Input.Keyboard.JustDown(this.keys.E)) {

                // El jugador la equipa (en una ranura libre o sustituyendo al arma activa)
                player.equipWeapon(this);

                // Actualizamos el estado del arma
                this.taken = true;
                this.stop(); // Paramos su animación de idle
                this.setTexture(this.imgKey, 0); // Fijamos su frame en el frame 0
                this.setGripOrigin();
                this.setScale(this.spriteData.heldScale ?? WEAPON_SCALE); // Escala en la mano
            }

            // Si el arma simplemente no se ha cogido, animacion idle
            else {
                this.play(this.imgKey + "_idle", true);
                return;
            }
        }

        // Si es el arma guardada (no la activa), no ataca
        if (this !== player.weapon) return;

        // El arma dispara hacia la posicion del raton mientras se mantenga pulsado el clic izquierdo
        // Y haya pasado tiempo suficiente desde el último disparo (velocidad de ataque).
        // Al soltar el clic no se corta la animación: el ataque termina y vuelve al frame 0
        const clickDown = this.scene.input.activePointer.leftButtonDown();

        if (clickDown && this.canFire(t, player)) {
            // Sacamos el objetivo al que apunta el arma y disparamos
            const target = this.getPointerWorld();
            this.Fire(target.x, target.y);
            this.lastFireTime = t; // Actualizamos cuándo se disparó por última vez
        }
    }

    // Indica si ha pasado el tiempo suficiente desde el último ataque
    canFire(t, player) {
        return this.attackSpeed > 0 && t - this.lastFireTime >= 700 / this.attackSpeed * player.attackSpeed;
    }

    // Indica si se está reproduciendo la animación de ataque
    isAttacking() {
        return this.anims.isPlaying && this.anims.getName() === this.imgKey + "_fire";
    }

    // Coloca el origen en el punto por el que se agarra el arma.
    // Al voltear en vertical, Phaser refleja también el origen, así que se usa el pivote reflejado
    setGripOrigin() {
        const { tileWidth, tileHeight } = this.spriteData;
        const pivot = this.isAttacking() ? this.spriteData.pivot : (this.spriteData.holdPivot ?? this.spriteData.pivot);
        const originY = pivot[1] / tileHeight;

        this.setOrigin(pivot[0] / tileWidth, this.flipY ? 1 - originY : originY);
    }

    // Posición del ratón en el mundo. Se recalcula con la cámara porque pointer.worldX
    // Solo se actualiza al mover el ratón, y si la cámara se mueve quedaría desfasado
    getPointerWorld() {
        const pointer = this.scene.input.activePointer;
        return this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    }

    // Gira el arma para que apunte hacia el ratón
    aimAtPointer() {
        const target = this.getPointerWorld();
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.setRotation(angle);

        // Si apunta hacia la izquierda, invertimos en vertical para que el arma no quede boca abajo
        this.setFlipY(Math.abs(angle) > Math.PI / 2);
        this.setGripOrigin();
    }

    // Suelta el arma en la posición en la que está y vuelve a su animación del suelo
    drop() {
        this.taken = false;
        this.setVisible(true); // Por si se suelta el arma que estaba guardada
        this.setRotation(0);
        this.setFlipY(false);
        this.setOrigin(0.5); // En el suelo el sprite va centrado
        this.setScale(this.spriteData.floorScale ?? WEAPON_SCALE); // En el suelo vuelve a su escala de suelo
        this.play(this.imgKey + "_idle", true);
    }

    // Aumenta el nivel del arma.
    tierUp() {
        if (this.tier < 3) {
            this.tier++;
            this.upgradeStats();
        }
    }

    // Aplica las mejoras a las estadisticas del arma.
    upgradeStats() {
        this.attackSpeed *= 1 + PCTG_ATTACK_SPEED_UPGRADE;
        this.damage *= 1 + PCTG_DAMAGE_UPGRADE;
    }
}
