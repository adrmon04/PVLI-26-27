import Enemy from '../Enemy.js';
/**
 * Clase que representa al profesor corrupto
 * Hereda de la clase Enemy
 * @extends Enemy
 */
export default class CorruptedTeacher extends Enemy {
    /**
     * Constructor del enemigo Corrupted Teacher con sus parametros
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

        // Velocidad de ataque del profesor corrupto
        this.attackSpeed = attackSpeed;

        // Dirección del movimiento
        this.lastDirection = 'right';
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {

        // Llamada al constructor de la clase Enemy
        super.preUpdate(t, dt);

        // Si el enemigo está muerto, frenamos la ejecución del método
        if (this.isDead) return;

        // Si el jugador está muerto, le perseguimos
        if (this.player) {

            const target = this.player.hurtbox;
            const from = this.hurtbox;
            const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);

            // Actualizamos la dirección de movimiento
            const isHurt = (this.anims.isPlaying 
                && this.anims.currentAnim.key.startsWith('corruptedTeacher_hurt_'));
    
            // Actualizamos la dirección de movimiento 
            if (dir.x > 0) this.lastDirection = 'right';
            else if (dir.x < 0) this.lastDirection = 'left';

            // Si ya está encima, se para (evita que tiemble al llegar)
            if (dir.length() >= this.range) {
                dir.normalize();
                this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
                if(!isHurt) this.play('corruptedTeacher_mov_' + this.lastDirection, true);
            }
            else {

                this.body.setVelocity(0, 0);

                // Reproducimos su animación de ataque
                if(!isHurt) this.play('corruptedTeacher_attack_' + this.lastDirection, true);
            }
        }

    }
}