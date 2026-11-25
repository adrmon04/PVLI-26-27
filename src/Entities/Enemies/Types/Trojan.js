import Enemy from '../Enemy.js';

export default class Trojan extends Enemy {
    /**
     * Constructor del enemigo Trojan con sus parametros
     * @param {number} health - Vida
     * @param {number} damage - Daño que inflige al jugador
     * @param {Phaser.Scene} scene - Escena en la que aparece
     * @param {number} x - Coordenada x que ocupa en la escena
     * @param {number} y - Coordenada y que ocupa en la escena
     * @param {number} speed - Velocidad de desplazamiento
     * @param {number} attackSpeed - Velocidad de ataque
     * @param {number} range - Rango de ataque
     * @param {number} detectionRange - Distancia de detección del jugador
     * @param {string} spritesheetKey - Nombre de la hoja de sprites
     * @param {number} frame - Frame de la hoja de sprites que le representa cuando aparece en la escena
     * @param {Player} player - Referencia al jugador
     */
    constructor(health, damage, scene, x, y, speed, spritesheetKey, frame, player, range, detectionRange, attackSpeed) {
        super(health, damage, scene, x, y, speed, attackSpeed, spritesheetKey, frame, player);

        this.hidden = true;
        this.appearing = false;
        this.range = range;
        this.detectionRange = detectionRange;

        this.on('animationcomplete', (anim) => {
            if (anim.key === 'trojan_appear') {
                this.appearing = false;
                this.hidden = false;
            }
        });
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {

        // Llamamos al método preUpdate de la clase padre
        super.preUpdate(t, dt);

        if (this.isDead) return;

        if (this.player) {

            const target = this.player.hurtbox;
            const from = this.hurtbox;
            const dir = new Phaser.Math.Vector2(target.x - from.x, target.y - from.y);

            if (this.hidden) {
                this.body.setVelocity(0, 0);

                if (Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) <= this.detectionRange) {
                    if (!this.appearing) {
                        this.appearing = true;
                        this.play('trojan_appear', true);
                    }
                }
                else if (!this.appearing) {
                    this.play('trojan_hidden', true);
                }
            }
            else {
                // Si ya está encima, se para (evita que tiemble al llegar)
                if (dir.length() >= this.range) {
                    dir.normalize();
                    this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
                    this.play('trojan_walk', true);
                }
                else {
                    this.body.setVelocity(0, 0);
                    this.play('trojan_attack', true);

                }
            }
        }

    }
}