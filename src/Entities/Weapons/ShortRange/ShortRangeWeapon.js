import Weapon from "../Weapon.js";

// Frame de la animación de ataque en el que se activa la hitbox
const HITBOX_ACTIVE_FRAME = 3; 

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

        // Llamamos al constructor de la clase Weapon 
        super(scene, x, y, imgKey, attackSpeed, damage, range);

        // Añadimos una hitbox al arma
        this.scene.physics.add.existing(this);

        // Creamos un set para almacenar los enemigos afectados por la hitbox para que así no reciban varios golpes
        this.enemiesAffectedByHit = new Set();

        // Impacto de la explosión, se activa en el frame de impacto de la animación 
        // Lo creamos, lo escalamos de acuerdo a la escala del arma, lo ocultamos y nos encargamos de que cuando
        // termine su animación, se vuelva a ocultar
        this.weaponImpact = this.scene.add.sprite(this.x, this.y, this.imgKey, 12);
        this.weaponImpact.setScale(this.scale);
        this.weaponImpact.setVisible(false);
        this.weaponImpact.on('animationcomplete-' + this.imgKey + '_impact', () => {
            this.weaponImpact.setVisible(false);
        });

        // Hacemos que hasta que no se haya llegado al frame deseado de la animación de ataque, no se active la hitbox
        this.on('animationupdate', (animation, frame) => {

            // Si se trata de la animación de ataque, cuando llega al frame 3, se activa la hitbox
            if (animation.key === this.imgKey + '_fire' && frame.index === HITBOX_ACTIVE_FRAME) { 

                // Vaciamos el set y activamos la hitbox
                this.enemiesAffectedByHit.clear();
                this.body.enable = true;
            } 
            else {
                this.body.enable = false;
            }
        });
    }

    preUpdate(t, dt) {

        // Llamamos al método preUpdate de Weapon
        super.preUpdate(t, dt);
        
        // Si la hitbox del arma es activada por la animación
        if (this.body.enable) {

            // Distancia entre el ratón y el arma en píxeles del mundo
            const target = this.getPointerWorld();
            const dx = target.x - this.x; 
            const dy = target.y - this.y;
            const distance = Math.hypot(dx, dy);
    
            // Usamos reachFactor para que la longitud del deplazamiento no supere
            // el rango del arma
            const reachFactor = ((distance === 0) ? 0 : Math.min(distance, this.range) / distance);
    
            // Esquina superior izquierda de la hitbox en píxeles del mundo
            const topLeftX = this.x + dx * reachFactor - this.body.width / 2;
            const topLeftY = this.y + dy * reachFactor - this.body.height / 2;
    
            // Ajustamos el offset de la hitbox
            this.body.setOffset(
                this.displayOriginX + (topLeftX - this.x) / this.scaleX,
                this.displayOriginY + (topLeftY - this.y) / this.scaleY);

            // Situamos weaponImpact, lo hacemos visible y reproducimos su animación
            this.weaponImpact.x = this.body.x + this.body.width / 2;
            this.weaponImpact.y = this.body.y + this.body.height / 2;
            this.weaponImpact.setVisible(true);
            this.weaponImpact.play(this.imgKey + '_impact', true);
       }
    }

    // Un golpe no puede empezar hasta que termine el anterior
    canFire(t, player) {
        return !this.isAttacking() && super.canFire(t, player);
    }

    // Método de disparo de las armas de corto alcance *a definir*
    Fire() {

        // Cada golpe reproduce la animación de ataque una vez
        this.play(this.imgKey + "_fire");
    }
}
