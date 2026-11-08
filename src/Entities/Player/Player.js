import Entity from "../Entity.js";

/**
 * Clase que representa al jugador
 * Hereda de Entity
 * @extends Entity
 */
export default class Player extends Entity {

    /**
     * @param {number} health 
     * @param {number} maxHealth
     * @param {number} damage 
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed 
     * @param {number} attackSpeed 
     * @param {string} imgKey 
     * @param {Weapon} weapon
     * @param {number} shopDiscount
     * @param {boolean} lucky
     */
    constructor(maxHealth, damage, scene, x, y, speed, attackSpeed, imgKey, frame) {

        // Llamamos al constructor de Entity
        super(maxHealth, damage, scene, x, y, speed, attackSpeed, imgKey, frame);

        // Hitbox solo en los pies, para que en la vista 3/4 choque con la base de los muros
        // (medidas en píxeles del frame original de 192x192; el dibujo acaba en y = 182)
        const bodyW = 60;
        const bodyH = 30;
        const feetY = 182;
        this.body.setSize(bodyW, bodyH);
        this.body.setOffset((this.width - bodyW) / 2, feetY - bodyH);

        // Caja de daño que cubre el dibujo (el dibujo mide unos 47x64 en pantalla)
        this.createHurtbox(32, 50);

        this.weapon = null;
        this.shopDiscount = 0;
        this.lucky = false;
        this.lastDirection = "right";

        // Creamos el objeto keys para saber cuando se han pulsado las teclas W, A, S y D
        this.keys = scene.input.keyboard.addKeys('W,A,S,D');

        // Colocamos el arma en 'postupdate', cuando las físicas ya han movido al jugador,
        // para que no vaya un frame por detrás
        scene.events.on('postupdate', this.followWeapon, this);
        this.once('destroy', () => scene.events.off('postupdate', this.followWeapon, this));
    }

    followWeapon() {
        if (this.weapon) {

            // Redondeamos para que el pixel art no se deforme con posiciones decimales
            this.weapon.setPosition(Math.round(this.x + 1), Math.round(this.y));
            
            // Una vez colocada, la giramos hacia el ratón
            this.weapon.aimAtPointer();
        }
    }

    preUpdate(t, dt) {

        super.preUpdate(t, dt);

        // En función de las teclas pulsadas, actualizamos la posición del jugador
        const x = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
        const y = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);

        this.body.setVelocity(x * this.speed, y * this.speed);
        this.body.velocity.normalize().scale(this.speed);

        // Si el jugador está en movimiento, reproducimos la animación de movimiento
        if (Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0) {
            if (this.body.velocity.x > 0) this.lastDirection = "right";
            else if (this.body.velocity.x < 0) this.lastDirection = "left";

            this.play("player_mov_" + this.lastDirection, true);
        }
        else {
            this.play("player_idle_" + this.lastDirection, true);
        }
    }

    showStats() {
        console.log('Health: ' + this.health + '/' + this.maxHealth);
        console.log('Damage: ' + this.damage);
        console.log('Attack Speed: ' + this.attackSpeed);
        console.log('Shop Discount: ' + this.shopDiscount);
        console.log('Lucky: ' + this.lucky);
    }
}