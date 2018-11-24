import BaseGame from './classes/base-game';
import key from 'keymaster';
import Victor from 'victor';
import HeroEntity from './entities/hero-entity';
import Game from './game';


export default class Player {
    /**
     * @param {Object} o - options
     * @param {Game} o.game
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
                side: 'blue',
            })
        );
        this.target = null;
    }
    onClick(pos) {
        var e = this.game.findEntityUnderThisPosition(pos);
        if (!e) return;
        if (e.side === 'red')
            this.target = e;
    }
    bindEvents() {
        window.addEventListener('mousedown', e => {
            var w = this.game.canvas.canvas.width;
            var h = this.game.canvas.canvas.height;
            var nw = this.game.viewport.size.x;
            var nh = this.game.viewport.size.y;
            var x = nw * (e.clientX / w) + this.game.viewport.position.x;
            var y = nh * (e.clientY / h) + this.game.viewport.position.y;
            this.onClick(new Victor(x, y));
        });
    }
    update() {
        if (this.target && this.target._killed) {
            this.target = null;
        }
        var dir = new Victor(0, 0);
        if (key.isPressed('a')) dir.x -= 1;
        if (key.isPressed('d')) dir.x += 1;
        if (key.isPressed('w')) dir.y -= 1;
        if (key.isPressed('s')) dir.y += 1;
        if (dir.length() > 0) {
            this.target = null;
            dir.norm().multiplyScalar(this.entity.movementSpeed);
        } else if (this.target) {
            dir = this.target.position.clone().subtract(this.entity.position);
            if (dir.length() < this.entity.attackRange) {
                this.entity.attack(this.target);
                dir.x = dir.y = 0;
            } else {
                dir.norm().multiplyScalar(this.entity.movementSpeed);
            }
        }
        this.entity.move(dir);
        this.game.viewport.centerAt(this.entity.position);
    }
    drawTarget() {
        if (!this.target) return;
        this.game.canvas.drawCircle(this.target.position, this.target.getMinSize(), 'red');
    }
    drawCs() {
        var ctx = this.game.canvas.context;
        this.game.beginHud();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        var msg = 'CS: ' + this.entity.cs;
        msg += '  GOLD: ' + this.entity.cs * 20;
        ctx.fillText(msg, 0, 0);
        this.game.endHud();
    }
    draw() {
        this.entity.draw();
    }
}
