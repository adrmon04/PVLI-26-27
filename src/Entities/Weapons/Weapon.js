/**
 * Clase que representa un arma
 * @extends Phaser.GameObjects.Sprite
 */

// Escala de dibujo de las armas y proyectiles (sus imágenes están escaladas x4)
const WEAPON_SCALE = 0.25;
// Distancia máxima al jugador para poder coger el arma
const PICKUP_RADIUS = 80;

export default class Weapon extends Phaser.GameObjects.Sprite {
    
    /**
     * Constructor de Weapon
     * @param {Scene} scene Escena en la que aparecerá el arma
     * @param {number} attackSpeed - velocidad de ataque del arma (ataques por segundo)
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
        this.imgKey_Weapon = imgKey_Weapon;
        this.taken = false;
        this.lastFireTime = 0;
        this.scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        // setScale en vez de setDisplaySize para no deformar los frames que no son cuadrados
        this.setScale(WEAPON_SCALE);

        this.keys = this.scene.input.keyboard.addKeys('E');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        const player = this.scene.player;

        //si el arma no se ha cogido, está cerca y se pulsa la tecla E, se coge el arma
        //(JustDown solo es true en el frame en que se pulsa, así no se intercambian las armas cada frame)
        if (!this.taken && player &&
            Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= PICKUP_RADIUS &&
            Phaser.Input.Keyboard.JustDown(this.keys.E)) {
            //si el jugador ya llevaba un arma, la suelta
            if (player.weapon) player.weapon.drop();

            this.taken = true;
            player.weapon = this;
            this.stop();
            this.setTexture(this.imgKey_Weapon, 0);
        }

        //si el arma no se ha cogido, animacion idle
        if (!this.taken) {
            this.play(this.imgKey_Weapon + "_idle", true);
            return;
        }

        //el arma dispara hacia la posicion del raton en caso de que haya pasado tiempo suficiente
        if (this.attackSpeed > 0 && t - this.lastFireTime >= 1000 / this.attackSpeed) {
            this.lastFireTime = t;
            const target = this.getPointerWorld();
            this.Fire(target.x, target.y);
        }
    }
    
    // Posición del ratón en el mundo. Se recalcula con la cámara porque pointer.worldX
    // solo se actualiza al mover el ratón, y si la cámara se mueve quedaría desfasado
    getPointerWorld() {
        const pointer = this.scene.input.activePointer;
        return this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    }

    // Gira el arma para que apunte hacia el ratón
    aimAtPointer() {
        const target = this.getPointerWorld();
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.setRotation(angle);
        //si apunta hacia la izquierda, invertimos en vertical para que el arma no quede boca abajo
        this.setFlipY(Math.abs(angle) > Math.PI / 2);
    }

    // Suelta el arma en la posición en la que está y vuelve a su animación del suelo
    drop() {
        this.taken = false;
        this.setRotation(0);
        this.setFlipX(false);
        this.setFlipY(false);
        this.play(this.imgKey_Weapon + "_idle", true);
    }

    Fire (targetX, targetY) {
        //si se dispara el arma, animacion de disparo
        this.play(this.imgKey_Weapon + "_fire", true);

        //si el arma es de largo alcance, se dispara un proyectil hacia la posicion del raton y se anima
        if ('imgKey_Bullet' in this) {
            const bullet = this.scene.physics.add.sprite(this.x, this.y, this.imgKey_Bullet);
            bullet.setScale(WEAPON_SCALE);
            bullet.setRotation(Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY));
            bullet.play(this.imgKey_Weapon + "_proyectile", true);
            this.scene.physics.moveTo(bullet, targetX, targetY, this.proyectileSpeed, this.range);
            bullet.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
        }
    }
}