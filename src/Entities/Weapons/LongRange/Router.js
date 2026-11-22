import LongRangeWeapon from './LongRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends LongRangeWeapon
*/

const ATTACK_SPEED = 1, // Ataques por segundo
      DAMAGE = 200, // Daño que inflige el arma
      RANGE = 200, // Rango del arma
      PROJECTILE_SPEED = 300, // Velocidad del proyectil
      PENETRATION = 2, // nº enemigos que puede atravesar el proyectil
      BURST_SIZE = 1; // nº de proyectiles que dispara en ráfaga

export default class Router extends LongRangeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'Router', ATTACK_SPEED, DAMAGE, RANGE, PROJECTILE_SPEED, PENETRATION, BURST_SIZE);
    }
}