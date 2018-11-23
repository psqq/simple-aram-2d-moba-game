import BaseGame from './base-game';
import Entity from './entity';


export default class Stats {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {Entity} o.entity
     * @param {number} [o.maxMp]
     */
    constructor(o = {}) {
        _.defaults(o, {
            maxMp: 100,
            maxHp: 100,
        });
        this.game = o.game;
        this.entity = o.entity;
        this.hp = o.maxHp * 0.8;
        this.maxHp = o.maxHp;
        this.mp = o.maxMp / 3;
        this.maxMp = o.maxMp;
        this.barHeight = 2;
        this.bottomPadding = 2;
    }
    getBarLeft() {
        return this.entity.position.x - this.entity.size.x / 2;
    }
    getBarBottom() {
        return this.entity.position.y - this.entity.size.y / 2 - this.bottomPadding;
    }
    getCountBars() {
        var countBars = 0;
        if (this.maxMp > 0) {
            countBars++;
        }
        if (this.maxHp > 0) {
            countBars++;
        }
        return countBars;
    }
    drawBarsBackground(padding = 0) {
        var ctx = this.game.canvas.context;
        var countBars = this.getCountBars();
        var x = this.getBarLeft(), y = this.getBarBottom();
        var w = this.entity.size.x;
        ctx.fillStyle = '#555';
        ctx.fillRect(
            x - padding, y - countBars * this.barHeight - padding,
            w + 2 * padding,
            2 * this.barHeight + 2 * padding
        );
    }
    drawBar(value, maxValue, lineNumber = 0, color = 'white') {
        var x = this.getBarLeft(), y = this.getBarBottom() - lineNumber * this.barHeight;
        var w = this.entity.size.x * (value / maxValue);
        var ctx = this.game.canvas.context;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, this.barHeight);
    }
    draw() {
        if (this.getCountBars() <= 0) {
            return;
        }
        var ctx = this.game.canvas.context;
        ctx.save();
        this.drawBarsBackground();
        if (this.maxHp > 0) {
            this.drawBar(this.hp, this.maxHp, 1, 'red');
        }
        if (this.maxMp > 0) {
            this.drawBar(this.mp, this.maxMp, 2, 'blue');
        }
        ctx.restore();
    }
}
