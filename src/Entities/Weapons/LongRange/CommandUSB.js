import LongRangeWeapon from './LongRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends LongRangeWeapon
*/

const ATTACK_SPEED = 10, // Ataques por segundo
      DAMAGE = 20, // Daño que inflige el arma
      RANGE = 200, // Rango del arma
      PROJECTILE_SPEED = 300, // Velocidad del proyectil
      PENETRATION = 1, // nº enemigos que puede atravesar el proyectil
      BURST_SIZE = 1; // nº de proyectiles que dispara en ráfaga

export default class CommandUSB extends LongRangeWeapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'CommandUSB', ATTACK_SPEED, DAMAGE, RANGE, PROJECTILE_SPEED, PENETRATION, BURST_SIZE);
    }
}