import Weapon from '../Weapon.js';

/**
 * Briefly immobilizes the player when triggered.
 * @extends Weapon
 */
export default class PortablePrinter extends Weapon {
    /**
     * @param {Scene} scene Escena en la que aparecerá el arma
     * @param {number} attackSpeed - velocidad de ataque del arma
     * @param {number} damage - daño que inflige el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
     * @param {number} proyectileSpeed - velocidad del proyectil
     * @param {number} range - rango del arma
     * @param {number} burstSize - tamaño de la ráfaga de disparos, nº de proyectiles que se disparan en cada ráfaga
     */

    constructor(scene, x, y, attackSpeed, damage, imgKey, proyectileSpeed, range, burstSize) {
        super(scene, x, y, attackSpeed, damage, imgKey);
        this.proyectileSpeed = proyectileSpeed;
        this.range = range;
        this.burstSize = burstSize;
    }
}