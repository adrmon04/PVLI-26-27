import Enemy from '../Enemy.js';

// Escala de dibujo de los proyectiles
export const PROYECTILE_SCALE = 0.8;

/**
 * Clase que representa al enemigo Spambot
 * Extiende la funcionalidad de la clase Enemy
 * @extends Entity
 */
export default class Spambot extends Enemy {
    /**
     * @param {number} health - Vida del Spambot (Valor bajo)
     * @param {number} damage - Daño del Spambot (Valor bajo)
     * @param {Phaser.Scene} scene - Escena de aparición del Spambot
     * @param {number} x - Coordenada x de la posición del Spambot
     * @param {number} y - Coordenada y de la posición del Spambot
     * @param {number} speed - Velocidad de movimiento del Spambot (Valor bajo)
     * @param {string} imgKey - Nombre de la imagen que representa al Spambot
     * @param {number} frame - Frame de la hoja de sprites que le representa cuando aparece en la escena
     * @param {Player} player - Referencia al jugador
     * @param {number} range - Alcance del Spambot (Valor alto)
     * @param {number} proyectileSpeed - Velocidad del proyectil del Spambot (Valor medio)
     * @param {number} attackSpeed - Velocidad de ataque del Spambot (Valor alto)
     */
    constructor(health, damage, scene, x, y, speed, imgKey, frame, player, range, proyectileSpeed, attackSpeed) {

        // Llamada al constructor de la clase Enemy
        super(health, damage, scene, x, y, speed, attackSpeed, imgKey, frame, player);

        // Variable para gestionar los dos aspectos distintos del proyectil
        this.proyectileAspect = 0;

        // Establecemos la velocidad de su proyectil y su alcance/rango
        this.proyectileSpeed = proyectileSpeed;
        this.range = range;

        // Creamos una variable para almacenar la última dirección de movimiento y la inicializamos a right
        this.lastDirection = 'right';

        // Creamos un grupo de entidades físicas para almacenar los proyectiles generados por el spambot
        // Las entidades creadas serán Sprites que podrán colisionar con los límites del mundo y que,
        // Al crearse, modificarán su escala de acuerdo a PROYECTILE_SCALE y reproducirán su animación
        this.proyectiles = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            defaultKey: 'spambotProyectile_' + this.lastDirection,
            collideWorldBounds: true,
            createCallback: (proyectile) => {
                proyectile.setScale(PROYECTILE_SCALE);
                proyectile.play('spambot_proyectile_' + this.proyectileAspect + '_'+ this.lastDirection, true);
            }
        });

        // Establecemos un listeners de eventos para gestionar el disparo de proyectiles
        this.on('animationupdate', (anim, frame) => {
            if (anim.key == ('spambot_attack_' + this.lastDirection)
                && frame.index == 4) {

                    // Se crea el proyectil dentro del grupo proyectiles
                    const proyectile = this.proyectiles.create(this.hurtbox.x, this.hurtbox.y);
                    if (this.proyectileAspect == 1) this.proyectileAspect = 0;
                    else ++this.proyectileAspect;

                    // Hacemos que la caja del proyectil coincida con este
                    const size = 40;
                    proyectile.body.setSize(size, size, false);
                    proyectile.body.setOffset(72 - size / 2, 65 - size / 2);

                    // Guardamos la posición inicial en la que se crea el proyectil
                    proyectile.setDataEnabled();
                    proyectile.setData({ initialX: this.hurtbox.x, initialY: this.hurtbox.y });

                    // Configuramos su rotación
                    proyectile.setRotation(Phaser.Math.Angle.Between(this.hurtbox.x, this.hurtbox.y, this.player.x, this.player.y));

                    // Normalizamos el vector para quedarnos solo con la dirección y lo multiplicamos por la velocidad
                    // Para que así se mueva el proyectil
                    const dir = new Phaser.Math.Vector2(this.player.hurtbox.x - this.hurtbox.x, this.player.hurtbox.y - this.hurtbox.y);
                    dir.normalize();
                    proyectile.body.setVelocity(dir.x * this.proyectileSpeed, dir.y * this.proyectileSpeed);
                }
        });
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {

        // Llamada al preUpdate de la clase Enemy
        super.preUpdate(t, dt);

        // Comprobamos que este vivo
        if (this.isDead) return;

        const isHurt = (this.anims.isPlaying
            && this.anims.currentAnim.key.startsWith('spambot_hurt_'));
        
        // Hacemos una copia para la comprobación para evitar que se deje proyectiles sin comprobar
        [...this.proyectiles.getChildren()].forEach(proyectile => {

            // Recuperamos la información enviada con el proyectil sobre su posición inicial
            const initialX = proyectile.getData('initialX');
            const initialY = proyectile.getData('initialY');

            // Comprobamos que la distancia entre su posición inicial y la actual no supere el rango y
            // Que el proyectil no haya colisionado con nada
            if (Phaser.Math.Distance.Between(initialX, initialY, proyectile.x, proyectile.y) >= this.range ||
            !proyectile.body.blocked.none) {
                proyectile.destroy();
            }
        });

        // Si el jugador no ha muerto
        if (this.player) {

            const target = this.player.hurtbox;
            const from = this.hurtbox;

            // Actualizamos la dirección en la que debe apuntar o moverse el Spambot
            if ((target.x - from.x) > 0) this.lastDirection = 'right';
            else if ((target.x - from.x) < 0) this.lastDirection = 'left';

            // Si el jugador se encuentra fuera de su alcance, el Spambot se acerca a él
            // En el caso contrario, se queda quieto
            if (Phaser.Math.Distance.Between(from.x, from.y, target.x, target.y) > this.range) {

                // Perseguimos al jugador de centro a centro de las hurtboxes (la parte media del dibujo)
                const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);

                // Normalizamos el vector para quedarnos solo con la dirección y lo multiplicamos por la velocidad
                // Para que así se mueva el Spambot
                dir.normalize();
                this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
            }
            else {
                this.body.setVelocity(0, 0);
            }

            // Reproducimos su animación de movimiento
            if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
                if (!isHurt) this.play('spambot_mov_' + this.lastDirection, true);
            }
            else {

                // Si esta totalmente quieto, significa que el jugador está dentro de su rango
                // Reproducimos la animación de ataque
                this.play('spambot_attack_' + this.lastDirection, true);

                if (!isHurt) this.play('spambot_attack_' + this.lastDirection, true);
                
            }
        }

        else {

            // Si el jugador ha muerto, reproducimos su animación de idle
            if (!isHurt) this.play('spambot_idle_' + this.lastDirection, true);
        }
    }
}