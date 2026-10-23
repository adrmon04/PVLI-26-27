/**
 * Clase que representa un enemigo
 * @extends Phaser.GameObjects.Sprite
 */
export default class Player extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Player
     * @param {numbre} vida
     * @param {Scene} scene Escena en la que aparecerá el enemigo
     * @param {number} x - coordenada X
     * @param {number} y - coordenada Y
     * @param {number} speed - velocidad de movimiento
     * @param {string} imgKey - nombre de la imagen que representa al enemigo
     */
    constructor(scene, x, y, speed, imgKey) {
        // super(scene, x, y, "player", 0); se tiene en cuenta que como es un sprite este se define en el frame 0

        super(scene, x, y, imgKey);
        this.scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.scene.physics.add.existing(this);
        this.setDisplaySize(100, 100); // asignamos el tamaño con el que queremos que se vea su imagen
        this.speed = speed;
        this.keys = scene.input.keyboard.addKeys('W,A,S,D');

        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds();
        
        // this.on('animaComplete'), (info) =>{
        //     if(this.anims)
        // }
    
    }

    // preUpdate(t, dt){
    //     super.preUpdate(t,dt);
    //     if(this.keys.A.isDown){
    //         this.play("player_move", true);
    //         this.setFlip(true);
    //     }if else {
    //         this.play("player_move", true);
    //         this.setFlip(true);
    //     }
    // }

    update() {
        const x = Number(this.keys.D.isDown) - Number(this.keys.A.isDown);
        const y = Number(this.keys.S.isDown) - Number(this.keys.W.isDown);
        this.body.setVelocity(x * this.speed, y * this.speed);
        this.body.velocity.normalize().scale(this.speed);
    }

}