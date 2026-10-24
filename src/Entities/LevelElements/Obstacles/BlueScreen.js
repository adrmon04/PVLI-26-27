import Trap from '../Trap.js';

/**
 * Briefly immobilizes the player when triggered.
 * @extends Trap
 */
export default class BlueScreen extends Trap {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} immobilizationDuration Duration in seconds.
     */
    constructor(scene, x, y, width, height, immobilizationDuration) {
        super(scene, x, y, width, height);
        this.immobilizationDuration = immobilizationDuration;
    }
}
