import Victor from 'victor';
import _ from 'lodash';
import { Body, Vector, Composite } from './physics-engine';
import Mainloop from './mainloop';
import BaseGame from './base-game';

/** Class representing an game entity. */
export default class Entity {
    /**
     * @param {Object} o - options
     * @param {number} [o.zindex=0] - zindex for draw
     * @param {Victor} [o.position=(0, 0)] - center of entity
     * @param {Victor} [o.size=(0, 0)] - width and height of entity
     * @param {BaseGame} o.game
     */
    constructor(o = {}) {
        _.defaults(o, {
            zindex: 0,
            position: new Victor(0, 0),
            size: new Victor(0, 0),
        });
        this.position = o.position.clone();
        this.size = o.size.clone();
        this.zindex = o.zindex;
        this._killed = false;
        this.game = o.game;
        this.mainloop = this.game.mainloop;
        /**
         * @type {Body}
         */
        this.body = null;
    }
    /**
     * @param {Entity} e
     */
    lenSqTo(e) {
        return e.position.clone().subtract(this.position).lengthSq();
    }
    getMinSize() {
        return Math.min(this.size.x, this.size.y);
    }
    /**
     * @param {Victor} pos
     */
    setPosition(pos) {
        Body.setPosition(
            this.body,
            new Vector.create(pos.x, pos.y)
        );
        this.position.x = this.body.position.x;
        this.position.y = this.body.position.y;
    }
    kill() {
        this._killed = true;
        if (this.body) {
            Composite.remove(this.game.physicsEngine.world, this.body);
            this.body = null;
        }
    }
    /**
     * @param {Body} body
     */
    onCollisionStart(body) { }
    update() {
        if (this.body) {
            this.position.x = this.body.position.x;
            this.position.y = this.body.position.y;
        }
    }
    draw() { }
}
