import Canvas from '../classes/canvas';
import Mainloop from '../classes/mainloop';
import BaseGame from '../classes/base-game';
import Viewport from '../classes/viewport';
import key from 'keymaster';
import Victor from 'victor';
import PhysicsEngine from '../classes/physics-engine';
import EntityManager from '../classes/entities-manager';
import Animation from '../classes/animation';
import AnimationManager from '../classes/animation-manager';
import Entity from '../classes/entity';
import Stats from '../classes/stats';
import GameEntity from './game-entity';
import MinionEntity from './minion-entity';


export default class NexusEntity extends GameEntity {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {number} [o.zindex=0] - zindex for draw
     * @param {Victor} [o.position=(0, 0)] - center of entity
     * @param {Victor} [o.size=(0, 0)] - width and height of entity
     * @param {sring} [o.side=blue] - width and height of entity
     */
    constructor(o = {}) {
        _.defaults(o, {
            size: new Victor(24, 24),
            side: 'blue',
            maxMp: 0,
            maxHp: 2000,
            attackRange: 0,
        });
        super(o);
        this.createBody();
        if (this.side === 'blue')
            this.image = this.game.imageManager.getImage('BlueNexus');
        else
            this.image = this.game.imageManager.getImage('RedNexus');
        this.minionSpawnPosition = this.position;
        this.spawnInterval = 1000;
        this.previousSpawnTime = 0;
    }
    createBody() {
        this.body = this.game.physicsEngine.addBody({
            isArcade: true,
            isStatic: true,
            shape: 'rectangle',
            position: this.position,
            size: this.size,
        });
    }
    spawnMinion() {
        this.game.entityManager.addEntity(
            new MinionEntity({
                game: this.game,
                side: this.side,
                position: this.minionSpawnPosition.clone(),
            })
        );
    }
    update() {
        super.update();
        if (this.mainloop.timestamp - this.previousSpawnTime < this.spawnInterval) {
            return;
        }
        this.previousSpawnTime = this.mainloop.timestamp;
        this.spawnMinion();
    }
    draw() {
        this.game.canvas.drawImage(this.image, this.position);
    }
}
