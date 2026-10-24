import Weapon from '../Weapon.js';

/**
 * Briefly immobilizes the player when triggered.
 * @extends Weapon
 */
export default class MechanicalKeyboard extends Weapon {
    /**
     * @param {Scene} scene Escena en la que aparecerá el arma
     * @param {number} attackSpeed - velocidad de ataque del arma
     * @param {number} damage - daño que inflige el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
     * @param {number} damageArea - área de daño del proyectil disparado por el arma
     * @param {number} range - rango del proyectil disparado por el arma
     */

    constructor(scene, x, y, attackSpeed, damage, imgKey, damageArea, range) {
        super(scene, x, y, attackSpeed, damage, imgKey);
        this.damageArea = damageArea;
        this.range = range;
    }
}