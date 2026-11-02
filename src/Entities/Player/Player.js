import Entity from "../Entity.js";

/**
 * Clase que representa al jugador
 * Hereda de Entity
 * @extends Entity
 */
export default class Player extends Entity {

    /**
     * @param {number} health 
     * @param {number} damage 
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     * @param {number} attackSpeed 
     * @param {string} imgKey 
     * @param {Weapon} weapon
     */
    constructor(health, damage, scene, x, y, speed, attackSpeed, imgKey, frame) {

        // Llamamos al constructor de Entity
        super(health, damage, scene, x, y, speed, attackSpeed, imgKey, frame);

        this.weapon = null;

        // Creamos el objeto keys para saber cuando se han pulsado las teclas W, A, S y D
        this.keys = scene.input.keyboard.addKeys('W,A,S,D');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // En función de las teclas pulsadas, actualizamos la posición del jugador
        const x = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
        const y = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);

        this.body.setVelocity(x * this.speed, y * this.speed);
        this.body.velocity.normalize().scale(this.speed);

        if (this.weapon) {
            this.weapon.x = this.x + 1;
            this.weapon.y = this.y;
        }

        // Si el jugador está en movimiento, reproducimos la animación de movimiento
        if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
            this.play("player_mov", true);

            // Si va hacia la izquierda, invertimos el sprite tanto del personaje como el arma, si es que tiene arma
            if (this.body.velocity.x > 0) { 
                this.setFlipX(false); 
                if (this.weapon) this.weapon.setFlipX(false); }
            else if (this.body.velocity.x < 0) { 
                this.setFlipX(true); 
                if (this.weapon) this.weapon.setFlipX(true); }
        }
        else {
            this.play("player_idle", true);
        }
    }
}