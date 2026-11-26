const HEALTH_GAIN = 20;
const DAMAGE_GAIN = 5;
const ATTACK_SPEED_GAIN = 10;
const SHOP_DISCOUNT_GAIN = 0.1;
const UPGRADE_SCALE = 0.05;
const PICKUP_RADIUS = 30;

export default class Upgrade extends Phaser.GameObjects.Sprite {
    /**
     * Constructor de Upgrade
     * @param {Scene} scene - Escena en la que aparecerá el arma
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     * @param {string} imgKey - Nombre de la imagen que representa al arma
    */
    constructor(scene, x, y, imgKey) {
        super(scene, x, y, imgKey);

        this.imgKey = imgKey;
        this.scene.add.existing(this);
        this.setScale(UPGRADE_SCALE);
        this.keys = this.scene.input.keyboard.addKeys('E');
        this.interactionRadius = PICKUP_RADIUS;
    }

    // Actualiza la entidad en cada frame.
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        const player = this.scene.player;
        if (player &&
            Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= this.interactionRadius &&
            Phaser.Input.Keyboard.JustDown(this.keys.E)) {
            const bounds = this.getBounds();

            this.applyUpgrade();
            
            // Emite un evento que recibe el hud
            this.scene.events.emit('pickup-feedback', {
                x: (bounds.left + bounds.right) / 2,
                y: bounds.top - 12,
                depth: this.depth + 1
            });

            this.destroy();
        }
        else this.play(this.imgKey + "_idle", true);
    }

    // Gestiona applyUpgrade.
    applyUpgrade() {
        const player = this.scene.player;
        switch (this.imgKey) {
            case 'Antivirus':
                player.maxHealth += HEALTH_GAIN;
                player.health = player.maxHealth;
                break;
            case 'Overclock':
                player.damage += DAMAGE_GAIN;
                break;
            case 'Turbo':
                player.attackSpeed += ATTACK_SPEED_GAIN;
                break;
            case 'CrackedLicense':
                player.shopDiscount += SHOP_DISCOUNT_GAIN;
                break;
            case 'Luck':
                player.lucky = true;
                break;
        }
    }
}