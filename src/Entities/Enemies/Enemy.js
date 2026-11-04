import Entity from "../Entity.js";

/**
 * Clase base para los enemigos.
 * Las clases concretas implementarán sus propios movimientos y ataques.
 * @extends Entity
 */
export default class Enemy extends Entity {
    /**
     * @param {number} health 
     * @param {number} damage
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     * @param {number} attackSpeed 
     * @param {string} imgKey 
     * @param {Player} player - Referencia al jugador para poder perseguirle
     */
    constructor(health, damage, scene, x, y, speed, attackSpeed, imgKey, frame, player) {
        super(health, damage, scene, x, y, speed, attackSpeed, imgKey, frame);
        this.nextAttackTime = 0;
        this.player = player;

        // Fijamos el tamaño en el que se muestra
        this.setDisplaySize(player.width * 1.5, player.height * 1.5);

        // Origen en el pivote definido en los pies del fantasma)
        this.setOrigin(0.54, 0.73);

        // Hitbox ajustado al cuerpo (en píxeles del frame, sin escalar)
        this.body.setSize(this.width * 0.22, this.height * 0.55);
        this.body.setOffset(this.width * 0.36, this.height * 0.09);
    }

    preUpdate(t, dt) {
        
        // Llamamos al preUpdate de la clase padre
        super.preUpdate(t, dt);

        // Cambiamos su velocidad para que así persiga al jugador
        const dir = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y).normalize();
        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);

        // Si el enemigo está en movimiento, reproducimos la animación de movimiento
        if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
            this.play('pop-up_mov', true);
            if (this.body.velocity.x > 0) {
                this.setFlipX(false);
            }
            else {
                this.setFlipX(true);
            }
        }
        else {
            this.play('pop-up_idle', true);
        }
    }

    /**
     * Comprueba y consume el intervalo común entre ataques.
     * Llamar cuando el ataque específico del enemigo pueda ejecutarse.
     * @param {number} [now=this.scene.time.now] Tiempo actual en milisegundos.
     * @returns {boolean}
     */
    canAttack(now = this.scene.time.now) {
        if (!Number.isFinite(now)) {
            throw new RangeError("El tiempo del ataque debe ser un número finito.");
        }

        if (this.isDead || this.attackSpeed <= 0 || now < this.nextAttackTime) {
            return false;
        }

        this.nextAttackTime = now + 1000 / this.attackSpeed;
        return true;
    }
}
