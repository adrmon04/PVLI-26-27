import ShortRangeWeapon from './ShortRangeWeapon.js';
/**
 * Clase que extiende la clase arma de corto alcance para crear el arma MechanicalKeyboard
 * @extends ShortRangeWeapon
*/

const ATTACK_SPEED = 0.75, // Ataques por segundo
      DAMAGE = 50, // Daño que inflige 
      RANGE = 50, // Rango
      MK_ORIGIN_X = 0.3,
      MK_ORIGIN_Y = 0.5;
      
// Inicializa los datos de la instancia.
export default class MechanicalKeyboard extends ShortRangeWeapon {
    /**
     * @param {Phaser.Scene} scene - Escena en la que se genera  
     * @param {number} x - Coordenada x 
     * @param {number} y - Coordenada y  
     */
    constructor(scene, x, y) {

        // Llamada al constructor de ShortRangeWeapon
        super(scene, x, y, 'MechanicalKeyboard', ATTACK_SPEED, DAMAGE, RANGE);

        // Fijamos el punto de origen de MechanicalKeyboard
        this.setOrigin(MK_ORIGIN_X, MK_ORIGIN_Y);

        // Definimos el tamaño de la hitbox de MechanicalKeyboard
        this.body.setSize(this.range / this.scale, this.range / this.scale);
    }
}