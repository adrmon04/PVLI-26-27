/**
 * Clase que representa un arma
 * @extends Phaser.GameObjects.Sprite
 */

export default class Weapon extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Weapon
     * @param {Scene} scene Escena en la que aparecerá el arma
     * @param {number} attackSpeed - velocidad de ataque del arma
     * @param {number} damage - daño que inflige el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
    */

    constructor(scene, x, y, attackSpeed, damage, imgKey) {
        super(scene, x, y, imgKey);
        this.attackSpeed = attackSpeed;
        this.damage = damage;
        this.scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setDisplaySize(50, 50);
    }

    update() {
        var deltaTime = this.scene.game.loop.delta;
        const pointer = this.scene.input.activePointer;
        if (deltaTime >= 1/this.attackSpeed) {
            this.Fire(pointer.worldX, pointer.worldY);
        }
    }

    Fire (targetX, targetY) {
        /*...*/
    }
}