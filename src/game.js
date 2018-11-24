import BaseGame from './classes/base-game';
import key from 'keymaster';
import Victor from 'victor';
import TowerEntity from './entities/tower';
import MinionEntity from './entities/minion-entity';
import Player from './player';
import GameEntity from './entities/game-entity';


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
        this.imageManager.addImage({
            src: './assets/images/dungeon_sheet-red-tower-22x34.png',
            name: 'RedTower',
        });
        this.imageManager.addImage({
            src: './assets/images/blue-minion-12x16.png',
            name: 'BlueMinion',
        });
        this.imageManager.addImage({
            src: './assets/images/blue-minion-12x16.png',
            name: 'RedMinion',
        });
        this.addMap('aram', './assets/tiled/maps/aram.json');
        this.bindEvents();
        this.viewport.changeScale(1.4);
        this.addEntities();
    }
    addEntities() {
        this.player = new Player({ game: this });
        this.tower = this.entityManager.addEntity(
            new TowerEntity({
                game: this,
                side: 'blue',
            })
        );
        this.tower2 = this.entityManager.addEntity(
            new TowerEntity({
                game: this,
                side: 'red',
            })
        );
        this.minion = this.entityManager.addEntity(
            new MinionEntity({
                game: this,
                side: 'blue',
            })
        );
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
        this.physicsEngine.drawStaticBodyes();
        this.physicsEngine.drawDynamicBodyes();
        super.drawBody();
        this.drawAttackRanges();
        this.drawStats();
    }
    drawAttackRanges() {
        for(var e of this.entityManager.entities) {
            if (e instanceof GameEntity) {
                this.canvas.drawCircle(e.position, e.attackRange, 'yellow');
            }
        }
    }
    drawStats() {
        for(var e of this.entityManager.entities) {
            if (e instanceof GameEntity) {
                e.drawHpAndMpBars();
            }
        }
    }
}
