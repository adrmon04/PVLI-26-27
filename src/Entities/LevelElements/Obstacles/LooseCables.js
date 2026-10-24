import Trap from '../Trap.js';

/**
 * Static obstacle that blocks the player's movement.
 * @extends Trap
 */
export default class LooseCables extends Trap {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        this.blocksMovement = true;
    }
}
