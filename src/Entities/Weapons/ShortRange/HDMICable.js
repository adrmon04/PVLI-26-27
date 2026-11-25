import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de corto alcance
 * @extends ShortRangeWeapon
*/
const ATTACK_SPEED = 10, // Ataques por segundo
      DAMAGE = 30, // Daño que inflige el arma
      RANGE = 10; // Rango del arma

export default class HDMICable extends ShortRangeWeapon {

    // Inicializa los datos de la instancia.
    constructor(scene, x, y) {
        super(scene, x, y, 'HDMICable', ATTACK_SPEED, DAMAGE, RANGE);
    }
}