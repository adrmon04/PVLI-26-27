import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de corto alcance para crear el arma HDMICable
 * @extends ShortRangeWeapon
*/

const ATTACK_SPEED = 3, // Ataques por segundo
      DAMAGE = 30, // Daño que inflige
      RANGE = 100, // Rango
      HC_ORIGIN_X = 0.1,
      HC_ORIGIN_Y = 0.5,
      HTIBOX_SIZE_DIV = 3;

export default class HDMICable extends ShortRangeWeapon {
    /**
     * @param {Phaser.Scene} scene - Escena en la que se genera  
     * @param {number} x - Coordenada x 
     * @param {number} y - Coordenada y  
     */
    constructor(scene, x, y) {

        // Llamada al constructor de ShortRangeWeapon
        super(scene, x, y, 'HDMICable', ATTACK_SPEED, DAMAGE, RANGE);

        // Fijamos el punto de origen de HDMICable
        this.setOrigin(HC_ORIGIN_X, HC_ORIGIN_Y);

        // Definimos el tamaño de la hitbox de HDMICable
        this.body.setSize((this.range / HTIBOX_SIZE_DIV) / this.scale, 
            (this.range / HTIBOX_SIZE_DIV) / this.scale);
    }
}