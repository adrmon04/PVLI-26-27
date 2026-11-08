import Weapon, { WEAPON_SCALE } from "./Weapon.js";
/**
 * Clase base para armas de largo alcance
 * @extends Weapon
 */
export default class LongRangeWeapon extends Weapon {
    
    /**
     * Constructor de LongRangeWeapon
     * @param {Scene} scene - Escena en la que aparecerá el arma
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {string} imgKey - nombre de la imagen que representa al arma
     * @param {number} attackSpeed - velocidad de ataque del arma (ataques por segundo)
     * @param {number} damage - daño que inflige el arma
     * @param {number} range - rango del arma 
     * @param {string} proyectileImgKey - Nombre de la imagen del proyectil
     * @param {number} proyectileSpeed - Velocidad del proyectil
     * @param {number} penetration - nº enemigos que puede atravesar el proyectil
     * @param {number} burstSize - nº de proyectiles que dispara en ráfaga
    */
    constructor(scene, x, y, imgKey, attackSpeed, damage, range, proyectileSpeed, penetration, burstSize) {
        // Llamamos al constructor de la clase weapon
        super(scene, x, y, imgKey, attackSpeed, damage, range);

        // Creamos un grupo de entidades físicas para almacenar los proyectiles generados por el arma        
        // Las entidades creadas serán Sprites que podrán colisionar con los límites del mundo y que,
        // al crearse, modificarán su escala de acuerdo a WEAPON_SCALE y reproducirán su animación
        this.proyectiles = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            defaultKey: this.imgKey + "Proyectile",
            collideWorldBounds: true,
            enemiesPenetrated: penetration,
            createCallback: (proyectile) => {
                proyectile.setScale(WEAPON_SCALE);
                proyectile.play(this.imgKey + "_proyectile", true);
            }
        });
        this.proyectileSpeed = proyectileSpeed; 
        this.penetration = penetration;
        this.burstSize = burstSize;
    }

    preUpdate(t, dt) {

        // Llamamos al método preUpdate de Weapon
        super.preUpdate(t, dt);

        // Hacemos una copia para la comprobación para evitar que se deje proyectiles sin comprobar
        [...this.proyectiles.getChildren()].forEach(proyectile => {

            // Recuperamos la información enviada con el proyectil sobre su posición inicial
            const initialX = proyectile.getData('initialX');
            const initialY = proyectile.getData('initialY');

            // Comprobamos que la distancia entre su posición inicial y la actual no supere el rango y
            // que el proyectil no haya colisionado con nada
            if (Phaser.Math.Distance.Between(initialX, initialY, proyectile.x, proyectile.y) >= this.range || 
            !proyectile.body.blocked.none) {
                proyectile.destroy();
            }
        });

    }
    
    // Dispara un proyectil hacia el objetivo
    Fire(targetX, targetY, remainingBullets = this.burstSize) {
        const fireInterval = 1000 / this.attackSpeed; // Intervalo entre disparos en milisegundos

        // Si se dispara el arma, reproducimos la animacion de disparo
        this.play(this.imgKey + "_fire", true);

        // Se crea el proyectil dentro del grupo proyectiles
        const proyectile = this.proyectiles.create(this.x, this.y);

        // Guardamos la posición inicial en la que se crea el proyectil con él
        proyectile.setDataEnabled();
        proyectile.setData({ initialX: this.x, initialY: this.y, damage: this.damage});
        
        // Configuramos su rotación y su velocidad
        proyectile.setRotation(Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY)); 
        proyectile.body.setVelocity(targetX - this.x, targetY - this.y);
        proyectile.body.velocity.normalize().scale(this.proyectileSpeed);        

        remainingBullets--;

        if (remainingBullets > 0) setTimeout(() => {
            this.Fire(targetX, targetY, remainingBullets);
        }, fireInterval);
    }
}