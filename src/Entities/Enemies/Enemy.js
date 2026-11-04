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
    constructor(health, damage, scene, x, y, speed, attackSpeed, imgKey, player) {
        super(health, damage, scene, x, y, speed, attackSpeed, imgKey);
        this.nextAttackTime = 0;
        this.player = player;
    }

    preUpdate(t, dt) {
        
        // Llamamos al preUpdate de la clase padre
        super.preUpdate(t, dt);

        // Cambiamos su velocidad para que así persiga al jugador
        const dir = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y).normalize();
        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
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
