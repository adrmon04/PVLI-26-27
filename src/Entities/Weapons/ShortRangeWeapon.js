import Weapon from "./Weapon.js";
/**
 * Clase que extiende la clase arma adaptada para armas de corto alcance
 * @extends Weapon
 */

export default class ShortRangeWeapon extends Weapon {

    /**
     * Constructor de Weapon
     * @param {Scene} scene - Escena en la que aparecerá el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
     * @param {number} attackSpeed - velocidad de ataque del arma (ataques por segundo)
     * @param {number} damage - daño que inflige el arma
     * @param {number} range - rango del arma
    */
    constructor(scene, x, y, imgKey, attackSpeed, damage, range) {

        // Llamamos al constructor de la clase weapon
        // (la escala en el suelo y en la mano se define con floorScale y heldScale en WEAPON_SPRITES)
        super(scene, x, y, imgKey, attackSpeed, damage, range);
    }

    preUpdate(t, dt) {

        // Llamamos al método preUpdate de Weapon
        super.preUpdate(t, dt);
    }

    // Un golpe no puede empezar hasta que termine el anterior
    canFire(t, player) {
        return !this.isAttacking() && super.canFire(t, player);
    }

    // Método de disparo de las armas de corto alcance *a definir*
    Fire(targetX, targetY) {

        // Cada golpe reproduce la animación de ataque una vez
        this.play(this.imgKey + "_fire");
    }
}
