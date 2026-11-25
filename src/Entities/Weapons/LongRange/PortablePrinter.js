import LongRangeWeapon from './LongRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends LongRangeWeapon
*/
const ATTACK_SPEED = 2, // Ataques por segundo
      DAMAGE = 10, // Daño que inflige el arma
      RANGE = 150, // Rango del arma
      PROJECTILE_SPEED = 200, // Velocidad del proyectil
      PENETRATION = 1, // nº enemigos que puede atravesar el proyectil
      BURST_SIZE = 3; // nº de proyectiles que dispara en ráfaga

export default class PortablePrinter extends LongRangeWeapon {

    // Inicializa los datos de la instancia.
    constructor(scene, x, y) {
        super(scene, x, y, 'PortablePrinter', ATTACK_SPEED, DAMAGE, RANGE, PROJECTILE_SPEED, PENETRATION, BURST_SIZE);
    }
}