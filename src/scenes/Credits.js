export default class Credits extends Phaser.Scene {
	constructor() {
		super({ key: 'Credits' });
	}
}

function preload() {

}

function create() {
	this.add.text(400, 225, 'Créditos', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
	this.add.text(400, 275, 'Juego desarrollado por: Adrián, Nicolás, Arturo y Pablo', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
	this.add.text(400, 325, 'PVLI 26/27', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
	this.add.text(400, 375, 'Gracias por jugar!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
}
