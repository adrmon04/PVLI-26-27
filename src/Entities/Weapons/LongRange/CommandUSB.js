import LongRangeWeapon from './LongRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends LongRangeWeapon
*/
const ATTACK_SPEED = 3, // Ataques por segundo
      DAMAGE = 15, // Daño que inflige el arma
      RANGE = 150, // Rango del arma
      PROJECTILE_SPEED = 300, // Velocidad del proyectil
      PENETRATION = 2, // nº enemigos que puede atravesar el proyectil
      BURST_SIZE = 1; // nº de proyectiles que dispara en ráfaga

export default class CommandUSB extends LongRangeWeapon {

    // Inicializa los datos de la instancia.
    constructor(scene, x, y) {
        super(scene, x, y, 'CommandUSB', ATTACK_SPEED, DAMAGE, RANGE, PROJECTILE_SPEED, PENETRATION, BURST_SIZE);
    }
}