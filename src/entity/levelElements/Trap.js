/**
 * Base class for room obstacles.
 * Concrete obstacles define their effect in onPlayerOverlap().
 *
 * @extends Phaser.GameObjects.Zone
 */
export default class Trap extends Phaser.GameObjects.Zone {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        this.area = width * height;
        this.blocksMovement = false;
    }
    
    create(){
        
    }
}
