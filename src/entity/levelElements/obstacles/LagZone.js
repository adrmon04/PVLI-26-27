import Trap from '../Trap.js';

/**
 * Slows the player while they remain inside the affected area.
 * @extends Trap
 */
export default class LagZone extends Trap {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} slowPercentage Value between 0 and 100.
     */
    constructor(scene, x, y, width, height, slowPercentage) {
        super(scene, x, y, width, height);
        this.slowPercentage = slowPercentage;
    }
}
