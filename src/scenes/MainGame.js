import Player from '../Entities/Player/Player.js';
/**
 * Escena principal.
 * @extends Phaser.Scene
 */

export default class MainGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGame' });
    }

    // preload - método de las escenas donde se pueden cargar los recursos que necesitaremos
    preload() {
        //Cargamos los assets desde nuestra raiz del proyecto
        this.load.image('fondo', 'assets/space.png');
    }

    // create - método de las escenas que se llama una vez la escena está instanciada
    create() {
        //Imagen de fondo
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        this.player = new Player(100, 100, this, this.cameras.main.centerX,
            this.cameras.main.centerY, 300, 400, 'player', 0);

        this.cameras.main.startFollow(this.player);
    }

    update() {
        this.player.update();
    }

}