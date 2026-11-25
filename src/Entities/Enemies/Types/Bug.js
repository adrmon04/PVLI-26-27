import Enemy from '../Enemy.js';

export default class Bug extends Enemy {
    /**
     * Constructor del enemigo Bug con sus parametros
     * @param {number} health - Vida
     * @param {number} damage - Daño que inflige al jugador
     * @param {Phaser.Scene} scene - Escena en la que aparece
     * @param {number} x - Coordenada x que ocupa en la escena
     * @param {number} y - Coordenada y que ocupa en la escena
     * @param {number} speed - Velocidad de desplazamiento
     * @param {number} attackSpeed - Velocidad de ataque
     * @param {string} spritesheetKey - Nombre de la hoja de sprites
     * @param {number} frame - Frame de la hoja de sprites que le representa cuando aparece en la escena
     * @param {Player} player - Referencia al jugador
     * @param {number} range - Rango de ataque
     */
    constructor(health, damage, scene, x, y, speed, spritesheetKey, frame, player, range, attackSpeed) {
        super(health, damage, scene, x, y, speed, attackSpeed, spritesheetKey, frame, player);

        this.range = range;
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {

        // Llamamos al preUpdate de la clase padre
        super.preUpdate(t, dt);

        // Comprobamos si está muerto el enemigo
        if (this.isDead) return;

        // Si el jugador está vivo
        if (this.player) {

            const target = this.player.hurtbox;
            const from = this.hurtbox;
            const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);
    
            const isHurt = (this.anims.isPlaying 
                && this.anims.currentAnim.key === 'bug_hurt');

            // Si ya está encima, se para (evita que tiemble al llegar)
            if (dir.length() >= this.range) {
                dir.normalize();
                this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
                if(!isHurt) this.play('bug_walk', true);
            }
            else {

                this.body.setVelocity(0, 0);

                // Comprobamos si el jugador puede atacar
                this.play('bug_attack', true);

                if(!isHurt) this.play('bug_attack', true);
                
            }
        }

    }
}