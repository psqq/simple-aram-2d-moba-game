import BaseGame from '../classes/base-game';
import Victor from 'victor';
import Entity from '../classes/entity';
import Stats from '../classes/stats';
import GameEntity from './game-entity';


export default class BulletEntity extends Entity {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {GameEntity} o.source
     * @param {GameEntity} o.target
     * @param {number} [o.speed=4] - zindex for draw
     */
    constructor(o = {}) {
        _.defaults(o, {
            mainloop: o.game.mainloop,
            size: new Victor(1, 1),
            position: o.source.position.clone(),
            speed: 0.15,
        });
        super(o);
        this.source = o.source;
        this.target = o.target;
        this.game = o.game;
        this.speed = o.speed;
    }
    update() {
        super.update();
        var dir = this.target.position.clone().subtract(this.position);
        var len = dir.length();
        if (len < this.size.x) {
            this.target.damage(this.source);
            this.kill();
        } else {
            dir.norm().multiplyScalar(this.speed * this.mainloop.dt);
            this.position.add(dir);
        }
    }
    draw() {
        var ctx = this.game.canvas.context;
        var r = Math.max(this.size.x, this.size.y);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.source.side;
        ctx.fill();
        ctx.restore();
    }
}
