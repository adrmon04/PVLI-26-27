import LongRangeWeapon from './Types/LongRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends LongRangeWeapon
*/

const ATTACK_SPEED = 3, // Ataques por segundo
      DAMAGE = 100, // Daño que inflige el arma
      RANGE = 200, // Rango del arma
      PROJECTILE_SPEED = 300, // Velocidad del proyectil
      PENETRATION = 1, // nº enemigos que puede atravesar el proyectil
      BURST_SIZE = 3; // nº de proyectiles que dispara en ráfaga

export default class PortablePrinter extends LongRangeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'PortablePrinter', ATTACK_SPEED, DAMAGE, RANGE, PROJECTILE_SPEED, PENETRATION, BURST_SIZE);
    }
}