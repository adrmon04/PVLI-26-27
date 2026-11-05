import Entity from "../Entity.js";

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

        // El tamaño en pantalla (2x2 tiles) ya lo fija Entity

        // Origen en el pivote definido en los pies del fantasma)
        this.setOrigin(0.54, 0.73);

        // Hitbox en los pies, para chocar con los muros igual que el jugador
        // (en píxeles del frame original de 1448x788: centrado en el origen y terminando
        // donde acaba el dibujo, y = 588)
        const bodyW = 200;
        const bodyH = 80;
        this.body.setSize(bodyW, bodyH);
        this.body.setOffset(this.width * 0.54 - bodyW / 2, 588 - bodyH);

        // Caja de daño que cubre el dibujo. El dibujo está un poco por encima del centro
        // del frame, por eso se sube 8 px
        this.createHurtbox(32, 50, -8);
    }

    preUpdate(t, dt) {
        
        // Llamamos al preUpdate de la clase padre
        super.preUpdate(t, dt);

        // Perseguimos al jugador de centro a centro de las hurtboxes (la parte media del dibujo)
        const target = this.player.hurtbox;
        const from = this.hurtbox;
        const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);

        // Si ya está encima, se para (evita que tiemble al llegar)
        if (dir.length() < 2) {
            this.body.setVelocity(0, 0);
        }
        else {
            dir.normalize();
            this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
        }

        // Si el enemigo está en movimiento, reproducimos la animación de movimiento
        if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
            this.play('pop-up_mov', true);
            if (this.body.velocity.x > 0) {
                this.setFlipX(false);
            }
            else {
                this.setFlipX(true);
            }
        }
        else {
            this.play('pop-up_idle', true);
        }
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
