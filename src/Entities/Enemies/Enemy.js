import Entity from "../Entity.js";

const ENEMY_LAYOUTS = {
    bug: {
        pivotX: 111,
        pivotY: 148,
        frameWidth: 193,
        frameHeight: 167,
        hurtboxWidth: 68,
        hurtboxHeight: 64,
        hurtboxOffsetX: 6,
        hurtboxOffsetY: 9,
    },
    trojan: {
        pivotX: 104,
        pivotY: 131,
        frameWidth: 186,
        frameHeight: 172,
        hurtboxWidth: 56,
        hurtboxHeight: 64,
        hurtboxOffsetX: 5,
        hurtboxOffsetY: 4,
    },
};

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

        const layout = ENEMY_LAYOUTS[imgKey];
        this.setOrigin(
            layout ? layout.pivotX / layout.frameWidth : 0.54,
            layout ? layout.pivotY / layout.frameHeight : 0.73
        );

        const bodyW = layout ? 32 / Math.abs(this.scaleX) : 200;
        const bodyH = layout ? 16 / Math.abs(this.scaleY) : 80;
        this.body.setSize(bodyW, bodyH);
        this.body.setOffset(
            (layout ? layout.pivotX : this.width * 0.54) - bodyW / 2,
            (layout ? layout.pivotY : 588) - bodyH
        );

        this.createHurtbox(
            layout ? layout.hurtboxWidth : 32,
            layout ? layout.hurtboxHeight : 50,
            layout ? layout.hurtboxOffsetY : -8,
            layout ? layout.hurtboxOffsetX : 0
        );
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
