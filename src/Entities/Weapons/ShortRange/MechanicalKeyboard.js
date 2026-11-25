import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de corto alcance
 * @extends ShortRangeWeapon
*/
const ATTACK_SPEED = 3, // Ataques por segundo
      DAMAGE = 100, // Daño que inflige el arma
      RANGE = 10; // Rango del arma

export default class MechanicalKeyboard extends ShortRangeWeapon {

    // Inicializa los datos de la instancia.
    constructor(scene, x, y) {
        super(scene, x, y, 'MechanicalKeyboard', ATTACK_SPEED, DAMAGE, RANGE);
    }
}