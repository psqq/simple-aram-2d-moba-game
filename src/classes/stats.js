import BaseGame from './base-game';
import Entity from './entity';


export default class Stats {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {Entity} o.entity
     */
    constructor(o) {
        this.game = o.game;
        this.entity = o.entity;
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 100;
        this.maxMp = 100;
        this.barHeight = 2;
    }
    draw() {
        var ctx = this.game.canvas.context;
        var y = this.entity.position.y - this.entity.size.y / 2 - 2;
        var x = this.entity.position.x - this.entity.size.x / 2;
        var w = this.entity.size.x;
        ctx.save();
        var padding = 1;
        ctx.fillStyle = 'black';
        ctx.fillRect(
            x - padding, y - 2 * this.barHeight - padding,
            w + 2 * padding,
            2 * this.barHeight + 2 * padding
        );
        y -= this.barHeight;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, y, w, this.barHeight);
        y -= this.barHeight;
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, w, this.barHeight);
        ctx.restore();
    }
}
