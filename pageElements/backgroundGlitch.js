// Glitches aleatorios en el fondo de la página web (no afecta al juego).
// Cada cierto tiempo aparecen rayas y bloques de neón en sitios al azar durante una fracción de segundo.
// Van detrás de todo el contenido (z-index 0) y no reciben clics.

const COLORS = ['#19e3ff', '#ee3d84', '#5dff3a', '#e4204d'];

// Tiempo entre ráfagas de glitch (ms)
const MIN_WAIT = 400;
const MAX_WAIT = 2000;

// Probabilidad de que una ráfaga venga con "desgarro" de toda la pantalla
const TEAR_CHANCE = 0.15;

/**
 * Número aleatorio entre min y max.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function random(min, max) {
    return min + Math.random() * (max - min);
}

// Si el usuario tiene activado "reducir movimiento" en su sistema, no hacemos nada
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    // Capa fija donde se dibujan los glitches
    const layer = document.createElement('div');
    layer.className = 'bg-glitch';
    layer.setAttribute('aria-hidden', 'true');
    document.body.prepend(layer);

    /**
     * Crea una raya (fina y larga) o un bloque (más alto, con líneas) en un sitio al azar
     * y lo borra al poco tiempo.
     */
    function spawnBar() {
        const bar = document.createElement('span');
        const isBlock = Math.random() < 0.3;

        bar.className = 'bg-glitch__bar';
        if (isBlock) {
            bar.classList.add('bg-glitch__bar--block');
        }

        bar.style.top = random(0, 100) + '%';
        bar.style.left = random(-10, 80) + '%';
        bar.style.width = random(8, 55) + '%';

        if (isBlock) {
            bar.style.height = random(20, 90) + 'px';
        }
        else {
            bar.style.height = random(1, 5) + 'px';
        }

        bar.style.setProperty('--color', COLORS[Math.floor(Math.random() * COLORS.length)]);

        layer.appendChild(bar);
        setTimeout(() => bar.remove(), random(70, 260));
    }

    /**
     * Ráfaga: varias rayas a la vez y, a veces, un desgarro de toda la pantalla.
     * Se vuelve a programar a sí misma con una espera aleatoria.
     */
    function burst() {
        const count = Math.floor(random(1, 5));
        for (let i = 0; i < count; i++) {
            spawnBar();
        }

        if (Math.random() < TEAR_CHANCE) {
            layer.classList.add('bg-glitch--tear');
            setTimeout(() => layer.classList.remove('bg-glitch--tear'), 180);
        }

        setTimeout(burst, random(MIN_WAIT, MAX_WAIT));
    }

    burst();
}
