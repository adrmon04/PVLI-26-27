import Trap from '../Trap.js';

/**
 * Damages the player while they remain on the affected floor.
 * @extends Trap
 */
export default class CorruptedFloor extends Trap {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} damagePerSecond
     */
    constructor(scene, x, y, width, height, damagePerSecond) {
        super(scene, x, y, width, height);
        this.damagePerSecond = damagePerSecond;
    }
}
