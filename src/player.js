import BaseGame from './classes/base-game';
import key from 'keymaster';
import Victor from 'victor';
import HeroEntity from './entities/hero-entity';


export default class Player {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
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
            })
        );
        this.speed = 2;
    }
    update() {
        var dir = new Victor(0, 0);
        if (key.isPressed('a')) dir.x -= 1;
        if (key.isPressed('d')) dir.x += 1;
        if (key.isPressed('w')) dir.y -= 1;
        if (key.isPressed('s')) dir.y += 1;
        if (dir.length() > 0) {
            dir.norm().multiplyScalar(this.speed);
        }
        this.entity.move(dir);
        this.game.viewport.centerAt(this.entity.position);
    }
    draw() {
        this.entity.draw();
    }
}
