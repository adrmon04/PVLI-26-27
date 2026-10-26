/**
 * Clase que representa una entidad en el juego
 * Heredan de ella Player y Enemy
 * @extends Phaser.GameObjects.Sprite
 */
export default class Entity extends Phaser.GameObjects.Sprite {
    
    /**
     * Constructor de Entity
     * @param {number} health - Vida
     * @param {number} damage - Daño que inflige
     * @param {Scene} scene - Escena de aparición
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     * @param {number} speed - Velocidad de movimiento 
     * @param {number} attackSpeed - Velocidad de ataque
     * @param {string} imgKey - Nombre de la imagen que representa a la entidad
     */
    constructor(health, damage, scene, x, y, speed, attackSpeed, imgKey) {
        
        // super(scene, x, y, "player", 0); se tiene en cuenta que como es un sprite este se define en el frame 0
        super(scene, x, y, imgKey);
        
        // Fijamos la vida y el daño que inflige la entidad
        this.health = health;
        this.damage = damage;
        
        // Añadimos la entidad a la escena
        this.scene.add.existing(this);

        // Le añadimos físicas a la entidad
        this.scene.physics.add.existing(this);
        
        // asignamos el tamaño con el que queremos que se vea su imagen
        this.setDisplaySize(100, 100);
        
        // Le asignamos su velocidad de movimiento y de ataque
        this.speed = speed;
        this.attackSpeed = attackSpeed;

        // Queremos que la entidad no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
    }
}