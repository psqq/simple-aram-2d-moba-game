import BaseGame from './classes/base-game';
import key from 'keymaster';
import Victor from 'victor';
import TowerEntity from './entities/tower';
import NexusEntity from './entities/nexus-entity';
import MinionEntity from './entities/minion-entity';
import Player from './player';
import GameEntity from './entities/game-entity';
import UI from './ui';


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
            src: './assets/images/red-minion-12x16.png',
            name: 'RedMinion',
        });
        this.imageManager.addImage({
            src: './assets/images/blue-nexus-24x24.png',
            name: 'BlueNexus',
        });
        this.imageManager.addImage({
            src: './assets/images/red-nexus-24x24.png',
            name: 'RedNexus',
        });
        this.addMap('aram', './assets/tiled/maps/aram.json');
        this.bindEvents();
        this.viewport.changeScale(1.4);
        this.addEntities();
        /**
         * @type {Object.<string, Victor>}
         */
        this.heroSpawn = {};
        this.ui = new UI({ game: this });
        this.ui.bindEvents();
    }
    /**
     * @param {Victor} pos
     */
    findEntityUnderThisPosition(pos) {
        var res = null;
        for(var e of this.entityManager.entities) {
            if (e.side) {
                var len = e.position.clone().subtract(pos).length();
                if (len < e.getMinSize()) {
                    res = e;
                    break;
                }
            }
        }
        return res;
    }
    afterLoad() {
        this.player.entity.createAnimations();
        this.maps.aram.createStaticObjects();
        this.addTowers();
        this.addNexues();
        this.addHeroesSpawnPositions();
        this.player.entity.setPosition(
            this.heroSpawn[this.player.entity.side]
        );
        this.ui.update();
    }
    addTowers() {
        var layerName = 'towers';
        for (var layer of this.maps.aram.mapJSON.layers) {
            if (layer.type === 'objectgroup' && layer.name === layerName) {
                for (var obj of layer.objects) {
                    var o = {
                        game: this,
                        position: new Victor(obj.x, obj.y),
                    };
                    for (var prop of obj.properties) {
                        o[prop.name] = prop.value;
                    }
                    var tower = new TowerEntity(o);
                    this.entityManager.addEntity(tower);
                }
            }
        }
    }
    addNexues() {
        var layerName = 'nexuses';
        for (var layer of this.maps.aram.mapJSON.layers) {
            if (layer.type === 'objectgroup' && layer.name === layerName) {
                for (var obj of layer.objects) {
                    var o = {
                        game: this,
                        position: new Victor(obj.x, obj.y),
                    };
                    for (var prop of obj.properties) {
                        o[prop.name] = prop.value;
                    }
                    var nexus = new NexusEntity(o);
                    this.entityManager.addEntity(nexus);
                }
            }
        }
    }
    addHeroesSpawnPositions() {
        var layerName = 'hero-spawn';
        for (var layer of this.maps.aram.mapJSON.layers) {
            if (layer.type === 'objectgroup' && layer.name === layerName) {
                for (var obj of layer.objects) {
                    for (var prop of obj.properties) {
                        if (prop.name == 'side') {
                            this.heroSpawn[prop.value] = new Victor(obj.x, obj.y);
                        }
                    }
                }
            }
        }
    }
    addEntities() {
        this.player = new Player({ game: this });
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
    update() {
        this.player.update();
        super.update();
    }
    drawBody() {
        this.drawMap('aram');
        // this.maps.aram.drawStaticObjects();
        super.drawBody();
        this.drawStats();
        this.player.drawTarget();
        // this.physicsEngine.drawStaticBodyes();
        // this.physicsEngine.drawDynamicBodyes();
        // this.drawAttackRanges();
    }
    drawAttackRanges() {
        for (var e of this.entityManager.entities) {
            if (e instanceof GameEntity) {
                this.canvas.drawCircle(e.position, e.attackRange, 'yellow');
            }
        }
    }
    drawStats() {
        for (var e of this.entityManager.entities) {
            if (e instanceof GameEntity) {
                e.drawHpAndMpBars();
            }
        }
    }
}
