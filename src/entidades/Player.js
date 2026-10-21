/**
 * Clase que representa un enemigo
 * @extends Phaser.GameObjects.Sprite
 */
export default class Player extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de Enemy
	 * @param {Scene} scene Escena en la que aparecerá el enemigo
	 * @param {number} x - coordenada X
	 * @param {number} y - coordenada Y
	 * @param {number} speed - velocidad de movimiento
	 * @param {string} imgKey - nombre de la imagen que representa al enemigo
	 */
	constructor(scene, x, y, speed, imgKey) {
		super(scene, x, y, imgKey);
		this.scene.add.existing(this);
		this.setOrigin(0.5, 0.5);
		this.scene.physics.add.existing(this);
        this.setDisplaySize(100,100); // asignamos el tamaño con el que queremos que se vea su imagen
		
		this.setFlip(true, false)
		
		// Queremos que el jugador no se salga de los límites del mundo
		this.body.setCollideWorldBounds();
		// this.body.setBounce(1, 1);
		
		this.body.setVelocity(speed, 0)
		// Escuchamos el evento en el que el sprite choca con la pared del mundo
		// Si esto sucede hacemos flip
		// Tenemos que guardar el identificador del enemigo en el body
		this.body.onWorldBounds=true;
		this.body.key = imgKey; 
		// nos guardamos a nostroso en self para poder acceder desde el evento
		// que detecta las colisiones con el límite del mundo
		let self = this;
		this.body.world.on('worldbounds', function(body, up, down, left, right)
		{
			// comprobamos si somos nosotros los que hemos llegado al final
			// del mundo y en ese caso hacemos flip
			// !!!! Cuidado, en este caso todos los enemigos con el mismo imgKey harán el flip
			console.log(body.key, self.body.key)
			if(body.key === self.body.key){
				self.setFlip(left, false)
			}
			
		})
	}
	
}