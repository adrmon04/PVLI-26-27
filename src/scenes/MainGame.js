import Player from '../entity/Player.js';
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
        this.load.image('player', 'assets/player.png');
        this.load.image('fondo', 'assets/space.png');
    }

    // create - método de las escenas que se llama una vez la escena está instanciada
    create() {
        //Imagen de fondo
        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            300,
            'player'
        );

        // this.cameras.main.startFollow(this.player);
    }

    update() {
        this.player.update();
    }

}