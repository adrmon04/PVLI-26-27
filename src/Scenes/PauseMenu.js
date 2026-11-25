const PANEL_WIDTH = 340;
const PANEL_HEIGHT = 300;
const PANEL_CUT = 12;

const BUTTON_WIDTH = 280;
const BUTTON_HEIGHT = 50;
const BUTTON_CUT = 6;
const BUTTON_GAP = 60;
const FIRST_BUTTON_Y = -25;

// Lee una variable de css/game.css, para que el menú cambie junto con la paleta de la página
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const toColor = (hex) => Phaser.Display.Color.HexStringToColor(hex).color;

// Las mismas esquinas cortadas que .panel en el CSS
const panelShape = (w, h, c) => [
    { x: -w / 2 + c, y: -h / 2 }, { x: w / 2 - c, y: -h / 2 },
    { x: w / 2, y: -h / 2 + c }, { x: w / 2, y: h / 2 - c },
    { x: w / 2 - c, y: h / 2 }, { x: -w / 2 + c, y: h / 2 },
    { x: -w / 2, y: h / 2 - c }, { x: -w / 2, y: -h / 2 + c }
];

// Las mismas esquinas cortadas que .fullscreen-btn en el CSS
const buttonShape = (w, h, c) => [
    { x: -w / 2 + c, y: -h / 2 }, { x: w / 2, y: -h / 2 },
    { x: w / 2, y: h / 2 - c }, { x: w / 2 - c, y: h / 2 },
    { x: -w / 2, y: h / 2 }, { x: -w / 2, y: -h / 2 + c }
];

/**
 * Menú de pausa. Se lanza encima de MainGame, que queda congelada pero visible de fondo.
 * El CSS no se aplica a lo que se dibuja en el canvas, así que los colores y las fuentes
 * Se leen de las variables de css/game.css.
 * @extends Phaser.Scene
 */
export default class PauseMenu extends Phaser.Scene {

    // Inicializa los datos de la instancia.
    constructor() {
        super({ key: 'PauseMenu' });
    }

    // Construye los elementos de la escena.
    create() {
        this.closing = false;
        this.selected = 0;
        this.pressed = null;
        this.texts = [];
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.palette = {
            void: cssVar('--void'),
            panel: cssVar('--panel'),
            phosphor: cssVar('--phosphor'),
            error: cssVar('--error'),
            magenta: cssVar('--magenta'),
            cyan: cssVar('--cyan'),
            ice: cssVar('--ice'),
            muted: cssVar('--muted')
        };
        this.fontDisplay = cssVar('--font-display');
        this.fontTerm = cssVar('--font-term');

        const { width, height } = this.scale;

        // Velo semitransparente: oscurece el juego sin ocultarlo
        this.veil = this.add.rectangle(0, 0, width, height, toColor(this.palette.void), 0.62).setOrigin(0);

        this.panel = this.add.container(width / 2, height / 2);
        this.createPanelBackground();
        this.createHeader();

        this.buttons = [
            this.createButton(0, 'CONTINUAR', this.palette.phosphor, () => this.resumeGame()),
            this.createButton(1, 'REINICIAR', this.palette.phosphor, () => this.leaveTo('MainGame')),
            this.createButton(2, 'SALIR AL MENÚ', this.palette.magenta, () => this.leaveTo('MainMenu'))
        ];
        this.refreshButtons();

        // Se suelta el botón fuera de cualquier opción: se cancela la pulsación
        this.input.on('pointerup', () => { this.pressed = null; });

        this.refreshTextsWhenFontsLoad();
        this.playIntro();

        const resumeOnEscape = (event) => {
            if (event.code !== 'Escape') return;

            event.preventDefault();
            this.resumeGame();
        };
        window.addEventListener('keydown', resumeOnEscape, true);
        this.events.once('shutdown', () => {
            window.removeEventListener('keydown', resumeOnEscape, true);
        });
    }

    // Gestiona createPanelBackground.
    createPanelBackground() {
        const { panel, phosphor } = this.palette;
        const accent = toColor(phosphor);
        const left = -PANEL_WIDTH / 2;
        const right = PANEL_WIDTH / 2;
        const top = -PANEL_HEIGHT / 2;
        const bottom = PANEL_HEIGHT / 2;
        const shape = panelShape(PANEL_WIDTH, PANEL_HEIGHT, PANEL_CUT);

        const background = this.add.graphics();
        background.fillStyle(toColor(panel), 0.94);
        background.fillPoints(shape, true);
        background.lineStyle(1, accent, 0.4);
        background.strokePoints(shape, true, true);

        // Línea de neón superior
        background.fillStyle(accent, 0.2);
        background.fillRect(left + PANEL_CUT, top - 1, PANEL_WIDTH * 0.45, 4);
        background.fillStyle(accent, 1);
        background.fillRect(left + PANEL_CUT, top, PANEL_WIDTH * 0.45, 2);

        // Esquina inferior derecha de HUD
        background.lineStyle(2, accent, 0.6);
        background.beginPath();
        background.moveTo(right - 20, bottom - 7);
        background.lineTo(right - 7, bottom - 7);
        background.lineTo(right - 7, bottom - 20);
        background.strokePath();

        this.panel.add(background);
    }

    // Gestiona createHeader.
    createHeader() {
        const { magenta, cyan, error, ice } = this.palette;

        const tag = this.createText(0, -PANEL_HEIGHT / 2 + 25, '[ ERR_PAUSE ] // PROCESS SUSPENDED', {
            fontFamily: this.fontTerm,
            fontSize: '12px',
            color: magenta
        }).setOrigin(0.5).setLetterSpacing(1);

        // Dos copias desplazadas del título: la separación RGB de --rgb-split
        const titleStyle = { fontFamily: this.fontDisplay, fontSize: '42px', fontStyle: '800' };
        const titleY = -PANEL_HEIGHT / 2 + 62;
        const createTitle = (x, color, alpha) => this.createText(x, titleY, 'PAUSA', { ...titleStyle, color })
            .setOrigin(0.5).setLetterSpacing(6).setAlpha(alpha);

        this.titleGhosts = [createTitle(-2, cyan, 0.55), createTitle(2, error, 0.55)];
        const title = createTitle(0, ice, 1);

        this.panel.add([tag, ...this.titleGhosts, title]);

        if (!this.reduceMotion) {
            this.time.addEvent({ delay: 3200, loop: true, callback: this.glitchTitle, callbackScope: this });
        }
    }

    // Gestiona createButton.
    createButton(index, label, accent, action) {
        const y = FIRST_BUTTON_Y + index * BUTTON_GAP;
        const labelX = -BUTTON_WIDTH / 2 + 32;

        const background = this.add.graphics({ x: 0, y });
        const arrow = this.createText(-BUTTON_WIDTH / 2 + 14, y, '>', {
            fontFamily: this.fontTerm,
            fontSize: '17px',
            color: accent
        }).setOrigin(0, 0.5);
        const text = this.createText(labelX, y, label, {
            fontFamily: this.fontTerm,
            fontSize: '17px',
            color: this.palette.ice
        }).setOrigin(0, 0.5).setLetterSpacing(2);

        const zone = this.add.zone(0, y, BUTTON_WIDTH, BUTTON_HEIGHT).setInteractive();
        zone.on('pointerover', () => this.select(index));
        zone.on('pointerdown', () => { this.pressed = index; });

        // Se actúa al soltar: si fuera al pulsar, el clic seguiría activo al volver al juego
        // Y el arma dispararía
        zone.on('pointerup', () => {
            if (this.pressed === index) this.activate(index);
        });

        this.panel.add([background, arrow, text, zone]);

        return { background, arrow, text, labelX, accent, action };
    }

    // Gestiona createText.
    createText(x, y, content, style) {
        const text = this.add.text(x, y, content, style);
        this.texts.push(text);
        return text;
    }

    // Gestiona select.
    select(index) {
        this.selected = index;
        this.refreshButtons();
    }

    // Gestiona refreshButtons.
    refreshButtons() {
        const shape = buttonShape(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_CUT);
        const offsetShape = (dx) => shape.map(({ x, y }) => ({ x: x + dx, y }));

        this.buttons.forEach(({ background, arrow, text, labelX, accent }, index) => {
            const isSelected = index === this.selected;
            const color = toColor(accent);

            background.clear();
            background.fillStyle(isSelected ? color : 0x040707, isSelected ? 0.14 : 0.45);
            background.fillPoints(shape, true);

            if (isSelected) {
                background.lineStyle(1, toColor(this.palette.cyan), 0.6);
                background.strokePoints(offsetShape(-1), true, true);
                background.lineStyle(1, toColor(this.palette.error), 0.6);
                background.strokePoints(offsetShape(1), true, true);
            }

            background.lineStyle(1, color, isSelected ? 1 : 0.35);
            background.strokePoints(shape, true, true);

            // Como .panel li:hover: el texto se ilumina y se desplaza un poco
            arrow.setVisible(isSelected);
            text.setColor(isSelected ? accent : this.palette.ice);
            text.setX(labelX + (isSelected ? 4 : 0));
        });
    }

    // Gestiona activate.
    activate(index) {
        if (this.closing) return;

        this.closing = true;
        this.buttons[index].action();
    }

    // Gestiona resumeGame.
    resumeGame() {
        this.sound.resumeAll();
        this.scene.resume('MainGame');
        this.scene.stop();
    }

    // Los sonidos son globales: si no se paran, los pausados quedarían pendientes en la siguiente partida
    leaveTo(sceneKey) {
        this.sound.stopAll();
        this.scene.stop('MainGame');
        this.scene.start(sceneKey);
    }

    // Gestiona playIntro.
    playIntro() {
        if (this.reduceMotion) return;

        this.veil.setAlpha(0);
        this.panel.setAlpha(0).setScale(0.94);

        this.tweens.add({ targets: this.veil, alpha: 1, duration: 120 });
        this.tweens.add({
            targets: this.panel,
            alpha: 1,
            scale: 1,
            duration: 140,
            ease: 'Back.easeOut'
        });
    }

    // Ráfaga corta de trozos desplazados, como glitch-burst en el CSS
    glitchTitle() {
        let steps = 5;

        this.time.addEvent({
            delay: 45,
            repeat: steps - 1,
            callback: () => {
                steps--;

                this.titleGhosts.forEach((ghost, index) => {
                    const direction = index === 0 ? -1 : 1;

                    if (steps === 0) {
                        ghost.setCrop().setX(direction * 2).setAlpha(0.55);
                        return;
                    }

                    const sliceY = Phaser.Math.Between(0, ghost.height * 0.7);
                    const sliceHeight = Phaser.Math.Between(6, ghost.height * 0.35);
                    ghost.setCrop(0, sliceY, ghost.width, sliceHeight);
                    ghost.setX(direction * Phaser.Math.Between(3, 7)).setAlpha(1);
                });
            }
        });
    }

    // Si las fuentes de Google aún no han llegado, se redibuja el texto cuando estén
    refreshTextsWhenFontsLoad() {
        Promise.all([
            document.fonts.load(`800 42px ${this.fontDisplay}`),
            document.fonts.load(`17px ${this.fontTerm}`)
        ]).then(() => {
            if (this.sys.isActive()) this.texts.forEach((text) => text.style.update(true));
        }).catch(() => {});
    }
}
