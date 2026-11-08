/**
 * Clase que representa un arma
 * @extends Phaser.GameObjects.Sprite
 */

// Escala de dibujo de las armas y proyectiles (sus imágenes están escaladas x4).
// Con 0.18 las armas miden unos 36-45 px, en proporción a un jugador de 2 tiles
export const WEAPON_SCALE = 0.18;

// Distancia máxima al jugador para poder coger el arma
const PICKUP_RADIUS = 80;

export default class Weapon extends Phaser.GameObjects.Sprite {
    
    /**
     * Constructor de Weapon
     * @param {Scene} scene - Escena en la que aparecerá el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
     * @param {number} attackSpeed - velocidad de ataque del arma (ataques por segundo)
     * @param {number} damage - daño que inflige el arma
     * @param {number} range - rango del arma 
     * @param {boolean} taken - indica si el arma está en el suelo o cogida por el jugador
    */

    constructor(scene, x, y, imgKey, attackSpeed, damage, range, taken = false) {

        super(scene, x, y, imgKey);

        // Guardamos el imgKey del arma para identificar posteriormente sus animaciones
        this.imgKey = imgKey; 

        // Le asignamos a cada propiedad su valor respectivo
        this.attackSpeed = attackSpeed;
        this.damage = damage;
        this.range = range;
        this.taken = taken;

        // Propiedad que indica si el arma se ha cogido o está en el suelo
        this.taken = false;
        
        // Propiedad que indica cuándo el arma atacó/disparó por última vez
        this.lastFireTime = 0;

        // Añadimos el arma a la escena
        this.scene.add.existing(this);
        
        // setScale en vez de setDisplaySize para no deformar los frames que no son cuadrados
        this.setScale(WEAPON_SCALE);

        // Guardamos el estado de la tecla 'E' (tecla para recoger armas)
        this.keys = this.scene.input.keyboard.addKeys('E');
    }

    preUpdate(t, dt) {

        super.preUpdate(t, dt);

        const player = this.scene.player;

        // Si el arma no se ha cogido, está cerca y se pulsa la tecla E, se coge el arma
        // (JustDown solo es true en el frame en que se pulsa, así no se intercambian las armas cada frame)
        if (!this.taken) {

            if (player && Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= PICKUP_RADIUS &&
            Phaser.Input.Keyboard.JustDown(this.keys.E)) {

                // Si el jugador ya llevaba un arma, la suelta
                if (player.weapon) player.weapon.drop();

                // Actualizamos el estado del arma
                this.taken = true;
                player.weapon = this;
                this.stop(); // Paramos su animación de idle
                this.setTexture(this.imgKey, 0); // Fijamos su frame en el frame 0
            }

            // Si el arma simplemente no se ha cogido, animacion idle
            else {
                this.play(this.imgKey + "_idle", true);
                return;
            }
        }

        // El arma dispara hacia la posicion del raton mientras se mantenga pulsado el clic izquierdo
        // y haya pasado tiempo suficiente desde el último disparo (velocidad de ataque)
        const clickDown = this.scene.input.activePointer.leftButtonDown();

        if (clickDown && this.attackSpeed > 0 && t - this.lastFireTime >= 700 / this.attackSpeed) {
            
            // Sacamos el objetivo al que apunta el arma y disparamos 
            const target = this.getPointerWorld();
            this.Fire(target.x, target.y);
            this.lastFireTime = t; // Actualizamos cuándo se disparó por última vez
        }

        // Al soltar el clic, paramos la animación de ataque y dejamos el arma en reposo (frame 0)
        else if (!clickDown && this.anims.isPlaying) {
            this.stop();
            this.setFrame(0);
        }
    }
    
    // Posición del ratón en el mundo. Se recalcula con la cámara porque pointer.worldX
    // solo se actualiza al mover el ratón, y si la cámara se mueve quedaría desfasado
    getPointerWorld() {
        const pointer = this.scene.input.activePointer;
        return this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    }

    // Gira el arma para que apunte hacia el ratón
    aimAtPointer() {
        const target = this.getPointerWorld();
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.setRotation(angle);

        // Si apunta hacia la izquierda, invertimos en vertical para que el arma no quede boca abajo
        this.setFlipY(Math.abs(angle) > Math.PI / 2);
    }

    // Suelta el arma en la posición en la que está y vuelve a su animación del suelo
    drop() {
        this.taken = false;     
        this.setRotation(0);
        this.setFlipY(false);
        this.play(this.imgKey + "_idle", true);
    }
}