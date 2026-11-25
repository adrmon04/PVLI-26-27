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
        // Tupla del iconos y keys del arma
        this.weaponIcons = [null, null];
        this.weaponKeys = [null, null];

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

        // Metodo auxiliar para que se updateen los iconos de arma
        this.updateWeaponIcons(player);
    }

    // Metodo que le llegan dos armas y las pone visibles en el hud
    updateWeaponIcons(player) {
        const slots = [this.weaponSlot, this.weaponSlot1];

        // Bucle explícito para que siempre se vean las dos ranuras
        for (let slotIndex = 0; slotIndex < 2; slotIndex++) {
            const weapon = player.weapons[slotIndex];
            const key = weapon ? weapon.imgKey : null;
            const slot = slots[slotIndex];

            if (key !== this.weaponKeys[slotIndex]) {
                this.weaponIcons[slotIndex]?.destroy();
                this.weaponIcons[slotIndex] = null;
                this.weaponKeys[slotIndex] = key;

                if (key !== null) {
                    const frame = this.setWeapon(key);

                    if (frame !== null) {
                        // ${key} es una plantilla de texto, es como si tuvieras "hudWeapon_NombreDelArma"
                        const animationKey = `hudWeapon_${key}`;

                        // Crea la animacion del arma en el hud
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

                        // Añade el sprite al hud
                        const icon = this.scene.add.sprite(
                            slot.x,
                            slot.y,
                            'FloorWeapons',
                            frame
                        );

                        // Le da una escala al icono y luego activa la animación
                        const iconScale = frame === 0 ? 52 : 64;
                        icon.setScale(iconScale / Math.max(icon.width, icon.height));
                        icon
                            .setScrollFactor(0)
                            .setDepth(this.uiDepth + 1);
                        icon.play(animationKey);

                        this.weaponIcons[slotIndex] = icon;
                    }
                }
            }

            // Cambia la opacidad del slot en uso para que se vea más y el otro menos
            const isSelected = slotIndex === player.activeSlot;
            this.setWeaponSlotFrame(slot, weapon, isSelected);
            slot.setAlpha(isSelected ? 1 : 0.7);
            this.weaponIcons[slotIndex]?.setVisible(key !== null);
            this.weaponIcons[slotIndex]?.setAlpha(isSelected ? 1 : 0.7);
        }
    }

    setWeaponSlotFrame(slot, weapon, isSelected) {
        if (!weapon) {
            slot.setFrame(0);
        }
        else {
            slot.setFrame(isSelected ? 1 : 0);
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