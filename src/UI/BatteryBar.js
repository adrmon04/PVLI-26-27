/**
 * Vida como pila de 10 barras 
 * Cada barra = 1/bars de la vida máxima. 
 * Al recibir daño se lanza una animación de glitch.
 */
export default class BatteryBar {
    constructor(scene, x, y, { bars = 10, depth = 1000, alpha = 0.9, lowBars = 3 } = {}) {
        this.scene = scene;
        this.x = x;                  // posición de la pila en pantalla
        this.y = y;
        this.bars = bars;            // nº de barras
        this.lowBars = lowBars;      // con este nº o menos, barras rojas
        this.pct = 1;                // vida actual, de 0 a 1
        this.lastHealth = null;      // vida del frame anterior (detecta el golpe)
        this.glitching = false;      // true mientras dura el glitch
        this.glitchEvent = null;     // temporizador del glitch

        // Fija el objeto a la pantalla (no sigue a la cámara) y lo dibuja por encima del juego
        const fix = (o) => o.setOrigin(0).setScrollFactor(0).setDepth(depth);

        // Copias cian y magenta de la carcasa para el efecto glitch (ocultas al inicio)
        this.ghostCyan = fix(scene.add.image(x, y, 'hudPila')).setTint(0x00e5ff).setAlpha(0.6).setVisible(false);
        this.ghostMagenta = fix(scene.add.image(x, y, 'hudPila')).setTint(0xff2d95).setAlpha(0.6).setVisible(false);

        // Carcasa de la pila
        this.shell = fix(scene.add.image(x, y, 'hudPila')).setAlpha(alpha);

        // Las barras, una junto a otra, dentro de la carcasa
        this.barSprites = Array.from({ length: bars }, (_, i) =>
            fix(scene.add.image(this.barX(i), y + 6, 'hudPilaBarra', 0)).setAlpha(alpha).setDepth(depth + 1));

        // Franja clara que salta de sitio durante el glitch
        this.slice = fix(scene.add.rectangle(x, y, 104, 2, 0xd6dbe6)).setDepth(depth + 2).setVisible(false);

        this.alpha = alpha;
        this.applyBars();            // dibuja el estado inicial
    }

    // Posición X de la barra i (6 px de margen, 9 px por barra)
    barX(i) { return this.x + 6 + i * 9; }

    /** Llamar cada frame (desde HUD.update) */
    update(player) {
        // Porcentaje de vida entre 0 y 1
        this.pct = Phaser.Math.Clamp(player.health / player.maxHealth, 0, 1);

        // Si la vida ha bajado respecto al frame anterior: golpe -> glitch
        if (this.lastHealth !== null && player.health < this.lastHealth) this.glitch();
        this.lastHealth = player.health;

        // Durante el glitch las barras las controla el propio glitch
        if (!this.glitching) this.applyBars();
    }

    /** Enciende las barras según la vida; flicker = probabilidad de apagar una al azar */
    applyBars(flicker = 0) {
        const exact = this.pct * this.bars;            // barras exactas (p. ej. 5,5)
        const lit = Math.ceil(exact - 1e-6);           // barras encendidas (redondeo arriba)
        const frame = lit <= this.lowBars ? 1 : 0;     // rojo si queda poca vida, si no verde
        this.barSprites.forEach((b, i) => {
            const on = i < lit && Math.random() >= flicker;           // visible o no
            const partial = i === lit - 1 ? exact - i : 1;            // fracción de la última barra
            b.setVisible(on).setFrame(frame).setAlpha(this.alpha * Phaser.Math.Linear(0.45, 1, partial));
        });
    }

    /** Animación de glitch al recibir daño (~0,35 s: 9 pasos de 40 ms) */
    glitch() {
        if (this.glitchEvent) this.glitchEvent.remove(false);   // reinicia si ya había uno
        this.glitching = true;
        const steps = 9;
        let n = 0;
        this.glitchEvent = this.scene.time.addEvent({
            delay: 40,
            repeat: steps - 1,
            callback: () => {
                n++;
                if (n >= steps) return this.endGlitch();        // último paso: limpiar
                const j = () => Phaser.Math.Between(-3, 3);     // desplazamiento aleatorio
                const { x, y } = this;
                // Carcasa: tiembla y alterna rojo / blanco
                this.shell.setPosition(x + j(), y + Phaser.Math.Between(-1, 1)).setTint(n % 2 ? 0xff6a4d : 0xffffff);
                // Fantasmas cian (izquierda) y magenta (derecha): separación RGB
                this.ghostCyan.setVisible(true).setPosition(x - 2 + j(), y + Phaser.Math.Between(-1, 1));
                this.ghostMagenta.setVisible(true).setPosition(x + 2 + j(), y + Phaser.Math.Between(-1, 1));
                // Franja en una altura aleatoria (a veces oculta)
                this.slice.setVisible(Math.random() < 0.7).setPosition(x + j(), y + Phaser.Math.Between(2, 28));
                // Barras: algunas se apagan al azar y se mueven 1 px arriba o abajo
                this.applyBars(0.3);
                this.barSprites.forEach((b) => b.setPosition(b.x, this.y + 6 + Phaser.Math.Between(-1, 1)));
            }
        });
    }

    /** Termina el glitch y deja todo en su sitio */
    endGlitch() {
        this.glitching = false;
        this.shell.setPosition(this.x, this.y).clearTint();     // carcasa a su posición, sin tinte
        this.ghostCyan.setVisible(false);
        this.ghostMagenta.setVisible(false);
        this.slice.setVisible(false);
        this.barSprites.forEach((b, i) => b.setPosition(this.barX(i), this.y + 6));
        this.applyBars();                                       // barras según la vida real
    }

    /** Elimina el temporizador y todos los objetos de la pila */
    destroy() {
        if (this.glitchEvent) this.glitchEvent.remove(false);
        [this.shell, this.ghostCyan, this.ghostMagenta, this.slice, ...this.barSprites].forEach((o) => o.destroy());
    }
}