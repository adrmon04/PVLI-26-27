// Botón de pantalla completa de la página.
// Se pone en pantalla completa todo #gameContainer (y no solo el canvas) para que el botón
// y el efecto CRT sigan visibles. Phaser (Scale.FIT) reajusta el canvas solo al nuevo tamaño.

const container = document.getElementById('gameContainer');
const button = document.getElementById('fullscreenBtn');

button.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    else {
        container.requestFullscreen().catch((err) => {
            console.warn('No se pudo activar la pantalla completa:', err);
        });
    }

    // Quitamos el foco del botón: si no, al pulsar Espacio/Enter jugando se volvería a pulsar
    button.blur();
});

// Se ejecuta al entrar y al salir (también al salir con Esc), para actualizar el texto del botón
document.addEventListener('fullscreenchange', () => {
    let text = 'Pantalla completa';

    if (document.fullscreenElement === container) {
        text = 'Salir de pantalla completa';
    }

    button.setAttribute('aria-label', text);
    button.title = text;
});
