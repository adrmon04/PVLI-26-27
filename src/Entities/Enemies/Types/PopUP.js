import Enemy from "../Enemy.js";
/**
 * Clase que representa al enemigo Pop-up y que hereda de Enemy
 * @extends Enemy
 */
export default class Popup extends Enemy {
    /**
     * Constructor del enemigo Pop-up con sus parametros
     * @param {number} health - Vida 
     * @param {number} damage - Daño de la explosión
     * @param {Phaser.Scene} scene - Escena en la que aparece
     * @param {number} x - Coordenada x que ocupa en la escena
     * @param {number} y - Coordenada y que ocupa en la escena
     * @param {number} speed - Velocidad de desplazamiento
     * @param {string} spritesheetKey - Nombre de la hoja de sprites 
     * @param {number} frame - Frame de la hoja de sprites que le representa cuando aparece en la escena
     * @param {Player} player - Referencia al jugador 
     * @param {number} detectionRange - Distancia de detección del jugador
     * @param {number} explosionRange - Distancia a la que tiene que estar el jugador para que el Pop-up inicie su explosión
     */
    constructor(health, damage, scene, x, y, speed, spritesheetKey, frame, player, detectionRange, explosionRange) {

        /** 
         * Llamamos al constructor de Enemy
         * Sin embargo, el valor de attackSpeed con el que la llamamos es 0 
         * Esto se debe a que el Pop-up no la llega a usar realmente
         */
        super(health, damage, scene, x, y, speed, 1, spritesheetKey, frame, player);

        // Fijamos la distancia de detección del jugador y la distancia de explosión
        this.detectionRange = detectionRange;
        this.explosionRange = explosionRange;

        // Variables booleanas para controlar el estado del Pop-up
        this.hidden = true;
        this.attack = false;
        this.explode = false;
        this.explosion = false;

        // Añadimos estos listeners de las animaciones para gestionarlas y evitar que se interrumpan unas
        // a otras
        this.on('animationcomplete', (anim) => {
            switch (anim.key) {
                case 'pop-up_appear':
                    this.hidden = false;
                    break;
                case 'pop-up_attack':
                    this.explode = true;
                    break;
                case 'pop-up_explode':
                    this.explosion = true;
                    break;
                }
        });
        this.on('animationupdate', (anim, frame) => {
            if (anim.key !== 'pop-up_explode') return;

            // Cuando se haya reproducido la mitad de la animación de la explosión, escalamos la hurtbox
            if (frame.index === 2) {
                this.hurtbox.setScale(6, 3);
            }
        });
    }

    preUpdate(t, dt) {

        // Llamamos al preUpdate de la clase padre
        super.preUpdate(t, dt);

        if (!this.isDead) {

            // Si el jugador se encuentra fuera del rango del Pop-up se mantiene quieto y reproduce su 
            // animación de 'hidden'
            if (this.hidden && Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) > this.detectionRange) {
                this.play('pop-up_hidden', true);
            }
            else {
    
                // Usamos esta condición para que la primera vez que el jugador entre en el rango de detección
                // del Pop-up este reproduzca su animación de 'appear' 
                if (this.hidden) {
                    this.play('pop-up_appear', true);
                }
                else {

                    // Si el Pop-up aún no ha iniciado su secuencia de ataque, reproducimos su movimiento
                    // básico
                    if (!this.attack && Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) > this.explosionRange) {
                        this.play('pop-up_mov', true);
    
                        // Perseguimos al jugador de centro a centro de las hurtboxes (la parte media del dibujo)
                        const target = this.player.hurtbox;
                        const from = this.hurtbox;
                        const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);
                        
                        // Si ya está encima, se para (evita que tiemble al llegar)
                        if (dir.length() >= 2) {
                            dir.normalize();
                            this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
                        }
                        else {
                            this.body.setVelocity(0, 0);
                        }
                        
                        // Si el Pop-up se queda quieto, reproducimos su animación de idle
                        if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
            
                            // En función del sentido en el que se desplace (derecha o izquierda), setFlipX es false o 
                            // true, respectivamente 
                            if (this.body.velocity.x > 0) {
                                this.setFlipX(false);
                            }
                            else {
                                this.setFlipX(true);
                            }
                        }
                        else {
                            this.play('pop-up_idle', true);
                        }
                    }
                    else {

                        // Si el jugador entra en el rango de explosión del Pop-up, lo paralizamos e 
                        // iniciamos su ataque
                        this.body.setVelocity(0, 0);
                        if (!this.explosion) {
                            if (!this.explode) {
                                this.play('pop-up_attack', true);
                                this.attack = true;
                            }
                            else {
                                this.play('pop-up_explode', true);
                            }
                        }
                        else {
                            this.destroy();
                        }
                    }
                }
            }
        }
    }
}