import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends ShortRangeWeapon
*/

const ATTACK_SPEED = 3, // Ataques por segundo
      DAMAGE = 100, // Daño que inflige el arma
      RANGE = 10; // Rango del arma

export default class MechanicalKeyboard extends ShortRangeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'MechanicalKeyboard', ATTACK_SPEED, DAMAGE, RANGE);
    }
}