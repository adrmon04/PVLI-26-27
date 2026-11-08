import BlueScreen from '../Entities/LevelElements/Obstacles/BlueScreen.js';
import CorruptedFloor from '../Entities/LevelElements/Obstacles/CorruptedFloor.js';
import LagZone from '../Entities/LevelElements/Obstacles/LagZone.js';
import LooseCables from '../Entities/LevelElements/Obstacles/LooseCables.js';

/**
 * Room: una sala del juego construida a partir de un mapa exportado de Tiled (.json).
 * Puede colocarse en cualquier posición del mundo para formar un mapa con varias salas.
 *
 * ---------- static preload(scene, key, jsonPath) ----------
 * Carga el JSON de la sala y las imágenes de los tilesets. Llamar desde el preload() de la escena.
 * @param {Phaser.Scene} scene - Escena que carga los archivos
 * @param {string} key - Key con la que se guarda el mapa en la caché
 * @param {string} jsonPath - Ruta al .json exportado de Tiled
 *
 * ---------- constructor(scene, key, x, y) ----------
 * Construye la sala: capas, colisiones y trampas. Llamar desde el create() de la escena.
 * @param {Phaser.Scene} scene - Escena donde se crea la sala
 * @param {string} key - La misma key usada en preload
 * @param {number} [x=0] - Posición X de la sala en el mundo (esquina superior izquierda)
 * @param {number} [y=0] - Posición Y de la sala en el mundo (esquina superior izquierda)
 *
 * ---------- createTraps() ----------
 * Recorre la capa Traps y crea un objeto Trap por cada tile con la propiedad "hazard".
 * @returns {Trap[]} Lista de trampas creadas
 *
 * ---------- addEntity(entity) ----------
 * Hace que una entidad choque con los muros/puertas y active las trampas de esta sala.
 * @param {Phaser.GameObjects.GameObject} entity - Jugador o enemigo
 *
 * ---------- Propiedades de Tiled que se leen ----------
 * Capas: Floor (suelo), Traps (trampas), Walls (muros de arriba y laterales, detrás del jugador),
 *        Door (puertas), WallsFront (opcional: muros de abajo, delante del jugador)
 * @property {boolean} solid - El tile bloquea el paso (Walls y Door). En WallsFront solo chocan los wall_face
 * @property {string} hazard - Tipo de trampa: 'slow' → LagZone, 'immobilize' → BlueScreen,
 *                             'damage' → CorruptedFloor, 'cables' → LooseCables
 * @property {number} ralentizacion_pct - % de ralentización de LagZone
 * @property {number} inmovilizacion_s - Segundos de inmovilización de BlueScreen
 * (El daño de 'damage' y 'cables' se define en CORRUPTED_FLOOR_DPS y LOOSE_CABLES_DPS)
 */

const TILESETS = [
    // [nombre en Tiled, key de la imagen, ruta]
    ['faculty_tileset',   'tiles_sala',   'Assets/Tiles/tiledsets/faculty_tileset.png'],
    ['faculty_hazards',   'tiles_hazard', 'Assets/Tiles/tiledsets/faculty_hazards_tileset.png'],
    ['faculty_doors',     'tiles_doors',  'Assets/Tiles/tiledsets/faculty_doors.png'],
    ['faculty_trap_bsod', 'tiles_bsod',   'Assets/Tiles/tiledsets/faculty_trap_bsod.png'],
    ['faculty_trap_lag',  'tiles_lag',    'Assets/Tiles/tiledsets/faculty_trap_lag.png'],
];

// Daño por segundo de las trampas de daño (se ajusta aquí, no en Tiled)
const CORRUPTED_FLOOR_DPS = 1;
const LOOSE_CABLES_DPS = 1;

// Profundidad de los muros de abajo: por encima de las entidades (3-4) y por debajo del HUD (1000)
const WALLS_FRONT_DEPTH = 10;

export default class Room {

    static preload(scene, key, jsonPath) {
        scene.load.tilemapTiledJSON(key, jsonPath);
        for(const [, imgKey, path] of TILESETS) {
            scene.load.image(imgKey, path);
        }
    }

    constructor(scene, key, x = 0, y = 0){
        this.scene = scene;
        this.tileMap = scene.make.tilemap({ key });

        // Conectamos cada tileset del JSON con su imagen cargada
        const tilesets = TILESETS.map(([name, imgKey]) => this.tileMap.addTilesetImage(name, imgKey));

        // Creamos las capas (el nombre debe coincidir con el de Tiled)
        this.floor = this.tileMap.createLayer('Floor', tilesets, x, y).setDepth(0);
        this.traps = this.tileMap.createLayer('Traps', tilesets, x, y).setDepth(1);
        this.walls = this.tileMap.createLayer('Walls', tilesets, x, y).setDepth(2);
        this.door = this.tileMap.createLayer('Door', tilesets, x, y).setDepth(2);

        // Muros de abajo: se dibujan POR ENCIMA del jugador para que parezca que pasa por detrás.
        // Es opcional: si la sala no tiene esta capa en Tiled, se queda en null
        this.wallsFront = this.tileMap.getLayer('WallsFront')
            ? this.tileMap.createLayer('WallsFront', tilesets, x, y).setDepth(WALLS_FRONT_DEPTH)
            : null;

        // Clasificamos lo tiles solidos
        this.walls.setCollisionByProperty({ solid: true });
        this.door.setCollisionByProperty({ solid: true });

        // En los muros de abajo solo choca el frente (wall_face): el jugador puede meterse
        // en el techo del muro y queda medio tapado por él, como en una vista 3/4
        if (this.wallsFront) {
            this.wallsFront.forEachTile(tile => {
                if (tile.properties?.name?.startsWith('wall_face')) {
                    tile.setCollision(true);
                }
            });
        }

        // Se crean las trampas en base a la capa de trampas 
        this.trapObjects = this.createTraps();

        // Rectangulo que va a ocupar la sala en el nivel, teneindo en cuenta que va a haber mas de una sala
        this.bounds = new Phaser.Geom.Rectangle(x, y, this.tileMap.widthInPixels, this.tileMap.heightInPixels);

    }

    createTraps(){
        const traps = [];

        this.traps.forEachTile((tile) => {
            const p = tile.properties;

            // cada trampa tiene su sombre/tipo hazard (peligro)
            if(p && p.hazard){
                // Si es una trampa se crea el objeto
                const x  = tile.getCenterX();
                const y = tile.getCenterY();

                const s = this.tileMap.tileWidth;
                
                switch(p.hazard){
                    case 'slow':
                        traps.push(new LagZone(this.scene, x, y, s, s, p.ralentizacion_pct));
                        break;
                    case 'immobilize':
                        traps.push(new BlueScreen(this.scene, x, y, s, s, p.inmovilizacion_s));
                        break;
                    case 'damage':
                        traps.push(new CorruptedFloor(this.scene, x, y, s, s, CORRUPTED_FLOOR_DPS));
                        break;
                    case 'cables':
                        traps.push(new LooseCables(this.scene, x, y, s, s, LOOSE_CABLES_DPS));
                        break;
                }
            }
        });

        return traps;
    }

    addEntity(entity){
        this.scene.physics.add.collider(entity, this.walls);
        this.scene.physics.add.collider(entity, this.door);
        if (this.wallsFront) {
            this.scene.physics.add.collider(entity, this.wallsFront);
        }

        // Mientras el player o el enemigo esté encima de una trampa, se aplica su efecto (cada frame)
        this.scene.physics.add.overlap(entity, this.trapObjects, (e, trap) => {
            if (trap.onOverlap) {
                trap.onOverlap(e);
            }
        });
    }

}