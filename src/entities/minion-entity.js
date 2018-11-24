import BaseGame from '../classes/base-game';
import Victor from 'victor';
import Entity from '../classes/entity';
import Stats from '../classes/stats';
import GameEntity from './game-entity';


export default class MinionEntity extends GameEntity {
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
            size: new Victor(12, 16),
            side: 'blue',
            attackRange: 50,
            maxHp: 20,
            maxMp: 0,
        });
        super(o);
        this.createBody();
        if (this.side === 'blue')
            this.image = this.game.imageManager.getImage('BlueMinion');
        else
            this.image = this.game.imageManager.getImage('RedMinion');
    }
    createBody() {
        this.body = this.game.physicsEngine.addBody({
            isArcade: true,
            shape: 'rectangle',
            position: this.position,
            size: this.size,
        });
    }
    update() {
        super.update();
        var enemy = this.searchForNearestEnemy();
        if (this.isInRange(enemy)) {
            this.game.physicsEngine.setVelocityForBody(this.body, new Victor(0, 0));
            this.attack(enemy);
        } else {
            this.gotoEntity(enemy);
        }
    }
    draw() {
        this.game.canvas.drawImage(this.image, this.position);
    }
}
