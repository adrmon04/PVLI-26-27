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
     */
    constructor(health, damage, scene, x, y, speed, attackSpeed, imgKey) {

        // Llamamos al constructor de Entity
        super(health, damage, scene, x, y, speed, attackSpeed, imgKey);

        // Creamos el objeto keys para saber cuando se han pulsado las teclas W, A, S y D
        this.keys = scene.input.keyboard.addKeys('W,A,S,D');
    }

    update() {

        // En función de las teclas pulsadas, actualizamos la posición del jugador
        const x = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
        const y = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);
        this.body.setVelocity(x * this.speed, y * this.speed);
        this.body.velocity.normalize().scale(this.speed);
    }
}