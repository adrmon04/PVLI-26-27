import BatteryBar from "./BatteryBar.js";
// Clase auxiliar que crea y actualiza la interfaz dentro de la escena del juego.
export default class HUD {

    // Inicializa los datos de la instancia.
    constructor(scene) {
        this.scene = scene;
        // Profundidad alta para dibujar la interfaz por encima de los elementos del juego.
        this.uiDepth = 1000;

        // Mantiene los elementos fijos en pantalla, ajusta su profundidad y su opacidad.
        const fijarEnPantalla = (obj, alpha = 1) =>
            obj.setScrollFactor(0).setDepth(this.uiDepth).setAlpha(alpha);

        // Barra de vida en la esquina superior izquierda.
        this.BatteryBar = new BatteryBar(scene, 12, 12)

        // Casillas del arma equipada, en la esquina inferior izquierda.
        this.weaponSlot = fijarEnPantalla(
            scene.add.image(40, scene.scale.height - 60, 'hudWeaponSlot', 0)
                .setDisplaySize(64, 64),
            0.9
        );

        this.weaponSlot1 = fijarEnPantalla(
            scene.add.image(116, scene.scale.height - 60, 'hudWeaponSlot', 0)
                .setDisplaySize(64, 64),
            0.9
        );
        this.weaponIcon = null;
        this.weaponKey = null;

        // Crea la animación de la moneda solo una vez para evitar duplicar su clave.
        if (!scene.anims.exists('hudCoinSpin')) {
            scene.anims.create({
                key: 'hudCoinSpin',
                frames: scene.anims.generateFrameNumbers('hudCoin', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }

        // Moneda animada y contador en la esquina inferior derecha.
        this.coinIcon = fijarEnPantalla(
            scene.add.sprite(scene.scale.width - 58, scene.scale.height - 60, 'hudCoin')
                .setDisplaySize(24, 24),
            0.9
        );
        this.coinIcon.play('hudCoinSpin');

        // Texto de cuantas monedas tiene el player
        this.coinText = fijarEnPantalla(
            scene.add.text(scene.scale.width - 42, scene.scale.height - 60, '0', {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0, 0.5),
            0.9
        );
    }

    // Actualiza la escena en cada frame.
    update(player) {
        // Llama al update de battery para cambiar la vida
        this.BatteryBar.update(player);

        // Refleja en pantalla las monedas actuales del jugador.
        this.coinText.setText(String(player.gold || 0));

        // Solo reemplaza el icono cuando cambia el arma equipada.
        const weapon = player.weapon;
        const key = weapon ? weapon.imgKey : null;

        if (key !== this.weaponKey) {
            this.weaponIcon?.destroy();
            this.weaponIcon = null;
            this.weaponKey = key;

            if (key !== null) {
                const frame = this.setWeapon(key);
                if (frame !== null) {
                    // ${key} es una plantilla de texto, como tal es como si tuvieras el hudWeapon_NombreDelArma
                    const animationKey = `hudWeapon_${key}`;
                    if (!this.scene.anims.exists(animationKey)) {
                        this.scene.anims.create({
                            key: animationKey,
                            frames: this.scene.anims.generateFrameNumbers('FloorWeapons', {
                                start: frame,
                                end: frame + 3
                            }),
                            frameRate: 6,
                            repeat: -1
                        });
                    }

                    this.weaponIcon = this.scene.add.sprite(
                        this.weaponSlot.x,
                        this.weaponSlot.y,
                        'FloorWeapons',
                        frame
                    );
                    if (frame === 0) {
                       this.weaponIcon.setScale(52 / Math.max(this.weaponIcon.width, this.weaponIcon.height))
                    }
                    else this.weaponIcon.setScale(64 / Math.max(this.weaponIcon.width, this.weaponIcon.height))
                    this.weaponIcon
                        .setScrollFactor(0)
                        .setDepth(this.uiDepth + 1)
                        .setAlpha(1);
                    this.weaponIcon.play(animationKey);
                }
            }
        }
    }

    // SetWeapon pone el frame de inicio de cada arma en el frame correspondiente de la imagen usada
    setWeapon(string){
        switch(string){
            case 'MechanicalKeyboard': return 0;
            case 'CPU': return 4;
            case 'HDMICable': return 8;
            case 'CommandUSB': return 12;
            case 'PortablePrinter': return 16;
            case 'Router': return 20;
            default: return null;
        }
    }
}