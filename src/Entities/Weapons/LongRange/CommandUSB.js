import Weapon from '../Weapon.js';

/**
 * Briefly immobilizes the player when triggered.
 * @extends Weapon
 */
export default class CommandUSB extends Weapon {
    /**
     * @param {Scene} scene Escena en la que aparecerá el arma
     * @param {number} attackSpeed - velocidad de ataque del arma
     * @param {number} damage - daño que inflige el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
     * @param {number} proyectileSpeed - velocidad del proyectil
     * @param {number} range - rango del arma
     * @param {string} imgKey_Bullet - nombre de la imagen que representa a la bala
     */

    constructor(scene, x, y, attackSpeed, damage, imgKey, range, proyectileSpeed, imgKey_Bullet) {
        super(scene, x, y, imgKey, attackSpeed, damage, range);
        this.proyectileSpeed = proyectileSpeed;
        this.imgKey_Bullet = imgKey_Bullet;
        this.range = range;
    }
}