import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends ShortRangeWeapon
*/

const ATTACK_SPEED = 10, // Ataques por segundo
      DAMAGE = 30, // Daño que inflige el arma
      RANGE = 10; // Rango del arma

export default class HDMICable extends ShortRangeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'HDMICable', ATTACK_SPEED, DAMAGE, RANGE);
    }
}