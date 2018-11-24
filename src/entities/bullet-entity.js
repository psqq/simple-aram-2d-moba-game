import BaseGame from '../classes/base-game';
import Victor from 'victor';
import Entity from '../classes/entity';
import Stats from '../classes/stats';


export default class BulletEntity extends Entity {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {Entity} o.source
     * @param {Entity} o.target
     * @param {number} [o.speed=4] - zindex for draw
     */
    constructor(o = {}) {
        _.defaults(o, {
            mainloop: o.game.mainloop,
            size: new Victor(3, 3),
            position: o.source.position.clone(),
            speed: 4,
        });
        super(o);
        this.source = o.source;
        this.target = o.target;
        this.game = o.game;
    }
    update() {
        super.update();
    }
    draw() {
        var ctx = this.game.canvas.context;
        var r = Math.max(this.size.x, this.size.y);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.restore();
    }
}
