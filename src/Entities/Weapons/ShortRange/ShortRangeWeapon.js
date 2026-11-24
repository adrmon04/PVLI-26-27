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

        // Cuando termina la animación, volvemos al frame 0
        this.on('animationcomplete-' + this.imgKey + '_fire', () => {
            this.setFrame(0);
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
    
            // Este es el calculo que hace setOffset (Lo pongo por claridad)
            // body.position.x = sprite.x + sprite.scaleX * (offset.x - sprite.displayOriginX);
            // body.position.y = sprite.y + sprite.scaleY * (offset.y - sprite.displayOriginY)
            // Ajustamos el offset de la hitbox
            this.body.setOffset(
                this.displayOriginX + (topLeftX - this.x) / this.scaleX,
                this.displayOriginY + (topLeftY - this.y) / this.scaleY);
        }
    }

    // Método de disparo de las armas de corto alcance
    Fire(targetX, targetY) {
        
        // Si se dispara el arma, animacion de disparo
        this.play(this.imgKey + '_fire', true);
    }
}