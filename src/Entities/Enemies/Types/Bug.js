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

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        const target = this.player.hurtbox;
        const from = this.hurtbox;
        const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);

        // Si ya está encima, se para (evita que tiemble al llegar)
        if (dir.length() >= this.range) {
            dir.normalize();
            this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
            this.play('bug_walk', true);
        }
        else {
            this.body.setVelocity(0, 0);
            this.play('bug_attack', true);
        }
    }
}