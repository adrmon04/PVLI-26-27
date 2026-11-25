import LongRangeWeapon from './LongRangeWeapon.js';
/**
 * Clase que extiende la clase arma de largo alcance
 * @extends LongRangeWeapon
*/
const ATTACK_SPEED = 1, // Ataques por segundo
      DAMAGE = 75, // Daño que inflige el arma
      RANGE = 175, // Rango del arma
      PROJECTILE_SPEED = 200, // Velocidad del proyectil
      PENETRATION = 1, // nº enemigos que puede atravesar el proyectil
      BURST_SIZE = 1, // nº de proyectiles que dispara en ráfaga
      BULLET_GAP = 20;

export default class Router extends LongRangeWeapon {

    // Inicializa los datos de la instancia.
    constructor(scene, x, y) {
        super(scene, x, y, 'Router', ATTACK_SPEED, DAMAGE, RANGE, PROJECTILE_SPEED, PENETRATION, BURST_SIZE);
    }

    // Dispara el proyectil hacia el objetivo.
    Fire (targetX, targetY, remainingBullets = this.burstSize) {
        for (let i = 0; i < 5; i++)
            super.Fire(targetX, (targetY - BULLET_GAP * 2) + BULLET_GAP * i, remainingBullets = this.burstSize);
    }
}