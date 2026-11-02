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
     * @param {string} imgKey_Weapon - nombre de la imagen que representa al arma 
     * @param {boolean} taken - indica si se ha cogido el arma o no
    */

    constructor(scene, x, y, attackSpeed, damage, imgKey_Weapon) {
        super(scene, x, y, imgKey_Weapon);
        this.attackSpeed = attackSpeed;
        this.damage = damage;
        this.taken = false;
        this.scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setDisplaySize(50, 50);

        this.keys = this.scene.input.keyboard.addKeys('E');
    }

    update() {
        //si el arma no se ha cogido y se pulsa la tecla E, se coge el arma
        if (!this.taken && this.keys.E.isDown) this.taken = true;
        //si el arma no se ha cogido, animacion idle
        if (!this.taken) this.play(this.imgKey_Weapon + "_idle", true);

        var deltaTime = this.scene.game.loop.delta;
        const pointer = this.scene.input.activePointer;
        
        //el arma dispara hacia la posicion del raton en caso de que haya pasado tiempo suficiente
        if (deltaTime >= 1/this.attackSpeed && this.taken) {
            this.Fire(pointer.worldX, pointer.worldY);
            this.play(this.imgKey_Weapon + "_fire", true);
        }
    }

    Fire (targetX, targetY) {
        //si se dispara el arma, animacion de disparo
        this.play(this.imgKey_Weapon + "_fire", true);

        //si el arma es de largo alcance, se dispara un proyectil hacia la posicion del raton y se anima
        if ('imgKey_Bullet' in this) {
            const bullet = this.scene.physics.add.sprite(this.x, this.y, this.imgKey_Bullet);
            bullet.setDisplaySize(20, 20);
            this.play(this.imgKey_Bullet + "_proyectile", true);
            this.scene.physics.moveTo(bullet, targetX, targetY, this.proyectileSpeed, this.range);
            bullet.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
        }
    }
}