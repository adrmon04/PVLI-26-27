import Room from './Room.js';

/**
 * Level: el nivel completo, formado por varias salas (Room) colocadas en el mundo.
 * Se encarga de cargar y crear todas las salas, ajustar los límites del mundo de físicas
 * y conectar las entidades con todas las salas.
 * La cámara no se gestiona aquí: sigue al jugador desde MainGame (startFollow).
 *
 * ---------- ROOMS ----------
 * Lista de salas del nivel. Cada sala es un objeto con:
 * @property {string} key - Nombre interno del mapa (no se puede repetir)
 * @property {string} path - Ruta al .json exportado de Tiled
 * @property {number} x - Posición X de la sala en el mundo (esquina superior izquierda)
 * @property {number} y - Posición Y de la sala en el mundo (esquina superior izquierda)
 *
 * ---------- static preload(scene) ----------
 * Carga los archivos de todas las salas. Llamar desde el preload() de la escena.
 * @param {Phaser.Scene} scene - Escena que carga los archivos
 *
 * ---------- constructor(scene) ----------
 * Crea todas las salas y ajusta los límites del mundo de físicas. Llamar desde el create() de la escena,
 * ANTES de crear al jugador y a los enemigos.
 * @param {Phaser.Scene} scene - Escena donde se crea el nivel
 *
 * ---------- addEntity(entity) ----------
 * Hace que una entidad choque con los muros/puertas y active las trampas de todas las salas.
 * @param {Phaser.GameObjects.GameObject} entity - Jugador o enemigo
 */

const ROOMS = [
    { key: 'room1', path: 'assets/tiles/Sala1.json', x: 0, y: 0 },
     // { key: 'sala2', path: 'assets/tiles/Sala2.json', x: 1920, y: 0 }, Esto se aplicara en el futuro con una generacion procedural de salas
];

export default class Level{

    static preload(scene){
        for(const room of ROOMS){
            Room.preload(scene, room.key, room.path);
        }
    }

    constructor(scene){
        this.scene = scene;

        // Se crean las salas en las ubicaciones generadas
        this.rooms = ROOMS.map(room => new Room(scene, room.key, room.x, room.y));

        // Rectangulo/tamaño del nivel
        const total = this.rooms.map(room => room.bounds)
            .reduce((a, b) => Phaser.Geom.Rectangle.Union(a, b));

        scene.physics.world.setBounds(total.x, total.y, total.width, total.height);
    }

    addEntity(entity){
        for(const room of this.rooms){
            room.addEntity(entity);
        }
    }
}