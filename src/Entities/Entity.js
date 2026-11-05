// Tamaño de los tiles de las salas y altura en pantalla del DIBUJO de las entidades (2 tiles)
export const TILE_SIZE = 32;
export const ENTITY_SIZE = TILE_SIZE * 2;

// Altura (en píxeles del frame original) que ocupa el dibujo dentro de cada spritesheet.
// Los frames tienen mucho espacio transparente alrededor, así que se escala según el dibujo
// y no según el frame entero. Si una imagen no está aquí, se usa la altura del frame.
const ART_HEIGHT = {
    'player_right': 162,   // frame 192x192
    'player_left': 162,    // frame 192x192
    'pop-up': 520,         // frame 1448x788
};

/**
 * Clase que representa una entidad en el juego
 * Heredan de ella Player y Enemy
 * @extends Phaser.GameObjects.Sprite
 */
export default class Entity extends Phaser.GameObjects.Sprite {

    /**
     * Constructor de Entity
     * @param {number} health - Vida máxima e inicial
     * @param {number} damage - Daño que inflige
     * @param {Phaser.Scene} scene - Escena de aparición
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     * @param {number} speed - Velocidad de movimiento 
     * @param {number} attackSpeed - Ataques por segundo
     * @param {string} imgKey - Nombre de la imagen que representa a la entidad
     */
    constructor(health, damage, scene, x, y, speed, attackSpeed, imgKey, frame) {
        super(scene, x, y, imgKey, frame)

        this.maxHealth = health;
        this.health = health;
        this.damage = damage;

        // Añadimos la entidad a la escena
        this.scene.add.existing(this);

        // Le añadimos físicas a la entidad
        this.scene.physics.add.existing(this);

        // Escalamos para que el dibujo mida 2 tiles de alto.
        // setScale (y no setDisplaySize) para mantener las proporciones de frames no cuadrados
        let artHeight = ART_HEIGHT[imgKey];

        if (artHeight === undefined || artHeight === null) {
            artHeight = this.height;
        }

        this.setScale(ENTITY_SIZE / artHeight);

        // Le asignamos su velocidad de movimiento y de ataque
        this.speed = speed;
        this.attackSpeed = attackSpeed;
        this.isDead = false;

        // Queremos que la entidad no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
    }

    /**
     * Crea una caja de daño (hurtbox) que sigue a la entidad.
     * Es independiente del body de físicas, que va en los pies y solo sirve para chocar con los muros.
     * La hurtbox cubre el dibujo y es la que se usa para recibir golpes de enemigos y proyectiles.
     * @param {number} w - Ancho en píxeles de pantalla
     * @param {number} h - Alto en píxeles de pantalla
     * @param {number} [offsetY=0] - Desplazamiento vertical respecto al centro del sprite
     */
    createHurtbox(w, h, offsetY = 0) {
        this.hurtbox = this.scene.add.zone(this.x, this.y, w, h);
        this.scene.physics.add.existing(this.hurtbox);

        // Guardamos de quién es, para saberlo dentro de los overlap
        this.hurtbox.owner = this;
        this.hurtboxOffsetY = offsetY;
        this.followHurtbox();

        // La colocamos después de que las físicas muevan a la entidad (igual que el arma del jugador)
        this.scene.events.on('postupdate', this.followHurtbox, this);
        this.once('destroy', () => {
            this.scene.events.off('postupdate', this.followHurtbox, this);
            this.hurtbox.destroy();
        });
    }

    /**
     * Coloca la hurtbox en el centro del dibujo de la entidad.
     */
    followHurtbox() {
        const center = this.getCenter();
        this.hurtbox.setPosition(center.x, center.y + this.hurtboxOffsetY);
    }

    /**
     * Aplica daño y destruye la entidad cuando se queda sin vida.
     * @param {number} amount - Cantidad de daño recibida
     * @returns {boolean} Si la entidad sigue viva después del golpe.
     */
    takeDamage(amount) {

        if (!Number.isFinite(amount) || amount < 0) {
            throw new RangeError("El daño recibido debe ser un número no negativo.");
        }

        if (this.isDead || amount === 0) {
            return !this.isDead;
        }

        this.health = Math.max(0, this.health - amount);
        if (this.health === 0) {
            this.die();
        }
        else {
            // Flash rojo al recibir daño
            this.setTint(0xff0000);

            if (this.hitTimer) this.hitTimer.remove(false);
            this.hitTimer = this.scene.time.delayedCall(150, () => {
                if (this.active) this.clearTint();
            });
        }

        return !this.isDead;
    }

    /**
     * Marca la entidad como muerta y la elimina de la escena.
     */
    die() {
        if (this.isDead) {
            return;
        }

        this.isDead = true;

        // (Arturo - Creo que habría que quitar el setVelocity porque destruimos a la
        // entidad justo despues)
        // this.body.setVelocity(0, 0);

        this.destroy();
    }
}