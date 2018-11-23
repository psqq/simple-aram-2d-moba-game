import Victor from 'victor';
import _ from 'lodash';
import { Body } from './physics-engine';
import Mainloop from './mainloop';

/** Class representing an game entity. */
export default class Entity {
    /**
     * @param {Object} o - options
     * @param {number} [o.zindex=0] - zindex for draw
     * @param {Victor} [o.position=(0, 0)] - center of entity
     * @param {Victor} [o.size=(0, 0)] - width and height of entity
     * @param {Mainloop} o.mainloop
     */
    constructor(o = {}) {
        _.defaults(o, {
            zindex: 0,
            position: new Victor(0, 0),
            size: new Victor(0, 0),
        });
        this.mainloop = o.mainloop;
        this.position = o.position.clone();
        this.size = o.size.clone();
        this.zindex = o.zindex;
        this._killed = false;
        /**
         * @type {Body}
         */
        this.body = null;
    }
    kill() {
        this._killed = true;
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
