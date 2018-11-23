import Canvas from './classes/canvas';
import Mainloop from './classes/mainloop';
import Viewport from './classes/viewport';
import BaseGame from './classes/base-game';
import ImageManager from './classes/image-manager';
import key from 'keymaster';
import Victor from 'victor';
import TiledMap from './classes/tiled-map';
import HeroEntity from './entities/hero-entity';
import TowerEntity from './entities/tower';
import Player from './player';


export default class Game extends BaseGame {
    constructor() {
        super();
        this.canvas.makeAlwaysCanvasFullscreen();
        this.imageManager.addImage({
            src: './assets/images/Hero.png',
            tileSize: new Victor(16, 16),
        });
        this.imageManager.addImage({
            src: './assets/images/dungeon_sheet-blue-tower-22x34.png',
            name: 'BlueTower',
        });
        this.addMap('aram', './assets/tiled/maps/aram.json');
        this.bindEvents();
        this.player = new Player({ game: this });
        this.tower = this.entityManager.addEntity(
            new TowerEntity({
                game: this,
            })
        );
        this.viewport.changeScale(1.4);
    }
    bindEvents() {
        key('z', () => {
            this.viewport.changeScale(-0.1);
        });
        key('x', () => {
            this.viewport.changeScale(0.1);
        });
        key('r', () => {
            this.pos.x = this.pos.y = 0;
        });
    }
    afterLoad() {
        this.player.entity.createAnimations();
        this.maps.aram.createStaticObjects();
    }
    update() {
        this.player.update();
        super.update();
    }
    drawBody() {
        this.drawMap('aram');
        // this.maps.aram.drawStaticObjects();
        // this.physicsEngine.drawStaticBodyes();
        // this.physicsEngine.drawDynamicBodyes();
        super.drawBody();
    }
}


async function main() {
    var game = new Game();
    await game.load();
    game.player.entity.setPosition(
        new Victor(
            50,
            game.maps.aram.pixelSize.y - 50,
        )
    );
    game.tower.setPosition(
        new Victor(
            100,
            game.maps.aram.pixelSize.y - 100,
        )
    );
    game.viewport.setBounds({
        left: 0, right: game.maps.aram.pixelSize.x,
        top: 0, bottom: game.maps.aram.pixelSize.y,
        
    });
    game.mainloop.run();
}

main();
