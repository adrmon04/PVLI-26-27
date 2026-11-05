import Trap from '../Trap.js';

/**
 * Cables sueltos: se puede pasar por encima, pero dañan al jugador
 * mientras permanece sobre ellos.
 * @extends Trap
 */
export default class LooseCables extends Trap {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} damagePerSecond Daño por segundo mientras el jugador está encima.
     */
    constructor(scene, x, y, width, height, damagePerSecond) {
        super(scene, x, y, width, height);
        this.blocksMovement = false;
        this.damagePerSecond = damagePerSecond;
    }
}
