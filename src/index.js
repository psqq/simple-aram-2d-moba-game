import Canvas from './classes/canvas';
import Mainloop from './classes/mainloop';
import Viewport from './classes/viewport';
import BaseGame from './classes/base-game';
import ImageManager from './classes/image-manager';
import key from 'keymaster';
import Victor from 'victor';
import TiledMap from './classes/tiled-map';
import HeroEntity from './entities/hero-entity';


const keyScope = 'SimpleGameExample';


class Player {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     */
    constructor(o = {}) {
        this.game = o.game;
        this.animations = {};
        this.currentAnimation = 'hero_walk_up';
        /**
         * @type {HeroEntity}
         */
        this.entity = o.game.entityManager.addEntity(
            new HeroEntity({
                position: new Victor(225, 230),
                game: this.game,
            })
        );
        this.speed = 2;
    }
    update() {
        var dir = new Victor(0, 0);
        if (key.isPressed('a')) dir.x -= 1;
        if (key.isPressed('d')) dir.x += 1;
        if (key.isPressed('w')) dir.y -= 1;
        if (key.isPressed('s')) dir.y += 1;
        if (dir.length() > 0) {
            dir.norm().multiplyScalar(this.speed);
        }
        this.entity.move(dir);
        this.game.viewport.centerAt(this.entity.position);
    }
    draw() {
        this.entity.draw();
    }
}


export default class Game extends BaseGame {
    constructor() {
        super();
        this.canvas.makeAlwaysCanvasFullscreen();
        this.canvas.hide();
        this.imageManager.addImage({
            src: './assets/images/Hero.png',
            tileSize: new Victor(16, 16),
        });
        this.addMap('map2', './assets/tiled/maps/map2.json');
        this.bindEvents();
        this.player = new Player({ game: this });
        this.viewport.changeScale(2);
    }
    bindEvents() {
        key('z', keyScope, () => {
            this.viewport.changeScale(-0.1);
        });
        key('x', keyScope, () => {
            this.viewport.changeScale(0.1);
        });
        key('r', keyScope, () => {
            this.pos.x = this.pos.y = 0;
        });
    }
    afterLoad() {
        this.player.entity.createAnimations();
        this.maps.map2.createStaticObjects(this.physicsEngine, 'collision');
    }
    update() {
        this.player.update();
        super.update();
    }
    run() {
        this.canvas.show();
        key.setScope(keyScope);
        this.mainloop.run();
    }
    stop() {
        this.canvas.hide();
        key.setScope('');
        this.mainloop.stop();
    }
    drawBody() {
        this.drawMap('map2');
        super.drawBody();
    }
}


async function main() {
    var game = new Game();
    await game.load();
    game.run();
}

main();
