import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de corto alcance para crear el arma CPU
 * @extends ShortRangeWeapon
*/

// Inicializa los datos de la instancia.
const ATTACK_SPEED = 0.5, // Ataques por segundo
      DAMAGE = 200, // Daño que inflige
      RANGE = 62.5, // Rango
      C_ORIGIN_X = 0.2,
      C_ORIGIN_Y = 0.5;

export default class CPU extends ShortRangeWeapon {
    /**
     * @param {Phaser.Scene} scene - Escena en la que se genera  
     * @param {number} x - Coordenada x 
     * @param {number} y - Coordenada y  
     */
    constructor(scene, x, y) {

        // Llamada al constructor de ShortRangeWeapon
        super(scene, x, y, 'CPU', ATTACK_SPEED, DAMAGE, RANGE);

        // Fijamos el punto de origen de la CPU
        this.setOrigin(C_ORIGIN_X, C_ORIGIN_Y);

        // Definimos el tamaño de la hitbox de la CPU
        this.body.setSize(this.range / this.scale, this.range / this.scale);
    }
}

