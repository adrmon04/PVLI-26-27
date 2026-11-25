import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de corto alcance
 * @extends ShortRangeWeapon
*/
const ATTACK_SPEED = 1, // Ataques por segundo
      DAMAGE = 200, // Daño que inflige el arma
      RANGE = 20; // Rango del arma

export default class CPU extends ShortRangeWeapon {

    // Inicializa los datos de la instancia.
    constructor(scene, x, y) {
        super(scene, x, y, 'CPU', ATTACK_SPEED, DAMAGE, RANGE);
    }
}