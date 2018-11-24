import BaseGame from '../classes/base-game';
import Victor from 'victor';
import Entity from '../classes/entity';
import Stats from '../classes/stats';
import BulletEntity from './bullet-entity';
import Game from '../game';


export default class GameEntity extends Entity {
    /**
     * @param {Object} o
     * @param {Game} o.game
     * @param {number} [o.zindex=0]
     * @param {Victor} [o.position=(0, 0)]
     * @param {Victor} [o.size=(0, 0)]
     * @param {sring} [o.side=blue]
     * @param {Stats} o.stats
     * @param {number} [o.maxMp=100]
     * @param {number} [o.maxHp=100]
     * @param {number} [o.attackRange=50]
     * @param {number} [o.movementSpeed=1.5]
     * @param {number} [o.attackSpeed=0.5]
     * @param {number} [o.attackDamage=10]
     */
    constructor(o = {}) {
        _.defaults(o, {
            mainloop: o.game.mainloop,
            size: new Victor(12, 16),
            side: 'blue',
            maxMp: 100,
            maxHp: 100,
            attackRange: 50,
            movementSpeed: 1.5,
            attackSpeed: 0.5,
            attackDamage: 10,
        });
        super(o);
        this.game = o.game;
        this.side = o.side;

        this.hp = o.maxHp;
        this.maxHp = o.maxHp;
        this.mp = o.maxMp;
        this.maxMp = o.maxMp;
        this.attackRange = o.attackRange;
        this.movementSpeed = o.movementSpeed;
        this.attackDamage = o.attackDamage;
        this.attackSpeed = o.attackSpeed;
        this.attackInterval = 1 / this.attackSpeed * 1000;
        this.timeOfPreviousAttack = 0;

        this.barHeight = 2;
        this.bottomPadding = 2;
    }
    onDie() {
        this.kill();
    }
    /**
     * @param {GameEntity} e
     */
    damage(e) {
        this.hp -= e.attackDamage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.onDie();
        }
    }
    searchForNearestEnemy(filterCallback = null) {
        var res = null;
        for(var e of this.game.entityManager.entities) {
            if (e.side && e.side != this.side) {
                if (filterCallback && !filterCallback(e)) {
                    continue;
                }
                if (!res) {
                    res = e;
                } else if (this.lenSqTo(e) < this.lenSqTo(res)) {
                    res = e;
                }
            }
        }
        return res;
    }
    /**
     * @param {GameEntity} e
     */
    isInRange(e) {
        var d = e.position.clone().subtract(this.position);
        if (d.length() < this.attackRange) {
            return true;
        }
        return false;
    }
    /**
     * @param {GameEntity} e
     */
    gotoEntity(e) {
        var d = e.position.clone().subtract(this.position).norm();
        d.multiplyScalar(this.movementSpeed);
        this.game.physicsEngine.setVelocityForBody(this.body, d);
    }
    /**
     * @param {GameEntity} e
     */
    attack(e) {
        if (this.game.mainloop.timestamp - this.timeOfPreviousAttack < this.attackInterval) {
            return;
        }
        this.timeOfPreviousAttack = this.game.mainloop.timestamp;
        this.game.entityManager.addEntity(
            new BulletEntity({
                game: this.game,
                source: this,
                target: e,
            })
        );
    }
    // function for drawing hp and mp bars:
    getBarLeft() {
        return this.position.x - this.size.x / 2;
    }
    getBarBottom() {
        return this.position.y - this.size.y / 2 - this.bottomPadding;
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
        var w = this.size.x;
        ctx.fillStyle = '#555';
        ctx.fillRect(
            x - padding, y - countBars * this.barHeight - padding,
            w + 2 * padding,
            2 * this.barHeight + 2 * padding
        );
    }
    drawBar(value, maxValue, lineNumber = 0, color = 'white') {
        var x = this.getBarLeft(), y = this.getBarBottom() - lineNumber * this.barHeight;
        var w = this.size.x * (value / maxValue);
        var ctx = this.game.canvas.context;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, this.barHeight);
    }
    drawHpAndMpBars() {
        if (this.getCountBars() <= 0) {
            return;
        }
        var ctx = this.game.canvas.context;
        ctx.save();
        this.drawBarsBackground();
        var i = 1;
        if (this.maxHp > 0) {
            this.drawBar(this.hp, this.maxHp, i, 'red');
            i++;
        }
        if (this.maxMp > 0) {
            this.drawBar(this.mp, this.maxMp, i, 'blue');
            i++;
        }
        ctx.restore();
    }
}
