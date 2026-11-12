// Clase auxiliar que crea y actualiza la interfaz dentro de la escena del juego.
export default class HUD {
    constructor(scene) {
        this.scene = scene;
        // Profundidad alta para dibujar la interfaz por encima de los elementos del juego.
        this.uiDepth = 1000;

        // Mantiene los elementos fijos en pantalla, ajusta su profundidad y su opacidad.
        const fijarEnPantalla = (obj, alpha = 1) =>
            obj.setScrollFactor(0).setDepth(this.uiDepth).setAlpha(alpha);

        // Cinco iconos de vida en la esquina superior izquierda.
        this.lifeIcons = Array.from({ length: 5 }, (_, i) =>
            fijarEnPantalla(
                scene.add.sprite(16 + i * 24, 30, 'hudLife', 4)
                    .setDisplaySize(16, 32),
                0.9
            )
        );

        // Casillas del arma equipada, en la esquina inferior izquierda.
        this.weaponSlot = fijarEnPantalla(
            scene.add.image(32, scene.scale.height - 80, 'hudWeaponSlot', 1)
                .setDisplaySize(48, 48),
            0.9
        );

        this.weaponSlot1 = fijarEnPantalla(
            scene.add.image(84, scene.scale.height - 80, 'hudWeaponSlot', 2)
                .setDisplaySize(48, 48),
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

        this.coinText = fijarEnPantalla(
            scene.add.text(scene.scale.width - 42, scene.scale.height - 60, '0', {
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0, 0.5),
            0.9
        );
    }

    update(player) {
        // Cada icono representa una fracción de la vida máxima; el frame indica cuánto queda.
        const vidaPorIcono = player.maxHealth / this.lifeIcons.length;

        this.lifeIcons.forEach((icon, i) => {
            const vida = Phaser.Math.Clamp(
                player.health - i * vidaPorIcono,
                0,
                vidaPorIcono
            );
            icon.setFrame(Math.round((vida / vidaPorIcono) * 4));
        });

        // Refleja en pantalla las monedas actuales del jugador.
        this.coinText.setText(String(player.gold || 0));

        // Solo reemplaza el icono cuando cambia el arma equipada.
        const weapon = player.weapon;
        const key = weapon ? weapon.imgKey : null;

        if (key !== this.weaponKey) {
            this.weaponIcon?.destroy();
            this.weaponIcon = null;
            this.weaponKey = key;

            if (weapon) {
                // Escala el icono conservando sus proporciones y lo dibuja sobre la casilla.
                this.weaponIcon = this.scene.add.image(
                    this.weaponSlot.x,
                    this.weaponSlot.y,
                    key,
                    0
                );
                this.weaponIcon.setScale(32 / Math.max(
                    this.weaponIcon.width,
                    this.weaponIcon.height
                ));
                this.weaponIcon
                    .setScrollFactor(0)
                    .setDepth(this.uiDepth + 1)
                    .setAlpha(0.9);
                
                // Segundo hueco de arma
                this.weaponIcon1 = this.scene.add.image(
                    this.weaponSlot.x,
                    this.weaponSlot.y,
                    key,
                    0
                );
                this.weaponIcon1.setScale(32 / Math.max(
                    this.weaponIcon1.width,
                    this.weaponIcon1.height
                ));
                this.weaponIcon1
                    .setScrollFactor(0)
                    .setDepth(this.uiDepth + 1)
                    .setAlpha(0.9);
            }
        }
    }
}