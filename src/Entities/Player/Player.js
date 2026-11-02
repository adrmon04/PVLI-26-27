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
        this.lastDirection = "right";

        // Creamos el objeto keys para saber cuando se han pulsado las teclas W, A, S y D
        this.keys = scene.input.keyboard.addKeys('W,A,S,D');

        // Colocamos el arma en 'postupdate', cuando las físicas ya han movido al jugador,
        // para que no vaya un frame por detrás
        scene.events.on('postupdate', this.followWeapon, this);
        this.once('destroy', () => scene.events.off('postupdate', this.followWeapon, this));
    }

    followWeapon() {
        if (this.weapon) {
            // Redondeamos para que el pixel art no se deforme con posiciones decimales
            this.weapon.setPosition(Math.round(this.x + 1), Math.round(this.y));
            // Una vez colocada, la giramos hacia el ratón
            this.weapon.aimAtPointer();
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // En función de las teclas pulsadas, actualizamos la posición del jugador
        const x = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
        const y = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);

        this.body.setVelocity(x * this.speed, y * this.speed);
        this.body.velocity.normalize().scale(this.speed);

        // Si el jugador está en movimiento, reproducimos la animación de movimiento
        if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
            if (this.body.velocity.x > 0) this.lastDirection = "right";
            else if (this.body.velocity.x < 0) this.lastDirection = "left";

            this.play("player_mov_" + this.lastDirection, true);
        }
        else {
            this.play("player_idle_" + this.lastDirection, true);
        }
    }
}