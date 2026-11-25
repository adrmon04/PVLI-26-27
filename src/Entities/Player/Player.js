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

        // Dos ranuras de arma, cada una puede tener cualquier arma. Solo ataca la activa
        this.weapons = [null, null];
        this.activeSlot = 0;
        this.gold = 0;
        this.shopDiscount = 0;
        this.lucky = false;
        this.lastDirection = "right";

        // Creamos el objeto keys para saber cuando se han pulsado las teclas W, A, S y D
        this.keys = scene.input.keyboard.addKeys('W,A,S,D');

        // Colocamos el arma en 'postupdate', cuando las físicas ya han movido al jugador,
        // Para que no vaya un frame por detrás
        scene.events.on('postupdate', this.followWeapon, this);
        this.once('destroy', () => scene.events.off('postupdate', this.followWeapon, this));

        // Con el clic derecho se cambia de arma (y se quita el menú contextual del navegador)
        scene.input.mouse.disableContextMenu();
        scene.input.on('pointerdown', this.onPointerDown, this);
        this.once('destroy', () => scene.input.off('pointerdown', this.onPointerDown, this));
    }

    // Arma activa (la que se ve, se coloca en la mano y ataca)
    get weapon() {
        return this.weapons[this.activeSlot];
    }

    // Gestiona el clic realizado con el raton.
    onPointerDown(pointer) {
        if (pointer.rightButtonDown()) this.switchWeapon();
    }

    // Cambia a la otra ranura, si tiene arma
    switchWeapon() {
        const other = 1 - this.activeSlot;
        if (!this.weapons[other]) return;

        this.holsterWeapon();
        this.activeSlot = other;
        this.weapon.setVisible(true);
    }

    // Guarda el arma activa: corta su ataque y la oculta
    holsterWeapon() {
        if (!this.weapon) return;
        this.weapon.stop();
        this.weapon.setFrame(0);
        this.weapon.setVisible(false);
    }

    // Equipa un arma recogida del suelo y pasa a ser la activa:
    // - si hay una ranura libre, va ahí (el arma que se llevaba se guarda)
    // - si las dos están llenas, sustituye al arma activa, que se suelta en el sitio de la nueva
    equipWeapon(weapon) {
        const freeSlot = this.weapons.indexOf(null);

        if (freeSlot !== -1) {
            this.holsterWeapon();
            this.activeSlot = freeSlot;
        }
        else {
            this.weapon.setPosition(weapon.x, weapon.y);
            this.weapon.drop();
        }

        this.weapons[this.activeSlot] = weapon;
    }

    // Mantiene el arma junto al jugador.
    followWeapon() {
        if (this.weapon) {

            // Posición de la mano propia de cada arma (opcional, en píxeles de pantalla).
            // La X se refleja cuando se apunta a la izquierda
            const [handX, handY] = this.weapon.spriteData.hand ?? [0, 0];
            const side = this.weapon.getPointerWorld().x < this.x ? -1 : 1;

            // Redondeamos para que el pixel art no se deforme con posiciones decimales
            this.weapon.setPosition(Math.round(this.x + 1 + handX * side), Math.round(this.y + 15 + handY));

            // Una vez colocada, la giramos hacia el ratón
            this.weapon.aimAtPointer();
        }
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {

        super.preUpdate(t, dt);

        // En función de las teclas pulsadas, actualizamos la posición del jugador
        const x = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
        const y = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);

        if (x !== 0 || y !== 0) {
            this.body.setVelocity(x * this.speed, y * this.speed);
            this.body.velocity.normalize().scale(this.speed);
        }
        else {
            this.body.setVelocity(0, 0);
        }

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

    // Muestra las estadisticas del jugador.
    showStats() {
        console.log('Health: ' + this.health + '/' + this.maxHealth);
        console.log('Damage: ' + this.damage);
        console.log('Attack Speed: ' + this.attackSpeed);
        console.log('Shop Discount: ' + this.shopDiscount);
        console.log('Lucky: ' + this.lucky);
    }
}