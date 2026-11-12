export default class DefeatMenu extends Phaser.Scene {
    constructor (){
        super({ key: 'DefeatMenu'})
    }
    
    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        this.add.text(width / 2, height / 3, 'HAS PERDIDO', {
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const reiniciar = this.add.text(width/3, height*2/3, 'Reintentar',{
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true});

        reiniciar.on('pointerdown', () => {
            this.scene.stop('MainGame');
            this.scene.start('MainGame');
        })

        const menu = this.add.text(width*2/3, height*2/3, 'Menú principal',{
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true});

        menu.on('pointerdown', () => {
            this.scene.stop('MainGame');
            this.scene.start('MainMenu');
        })

    }

}