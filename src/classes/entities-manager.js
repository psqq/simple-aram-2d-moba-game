import Viewport from './viewport';
import Entity from './entity';


export default class EntitiesManager {
    /**
     * @param {Object} o - options
     * @param {Viewport} o.viewport - zindex (for draw)
     * @param {number} [o.maxEntitySize=128] - max size of entity (for draw)
     */
    constructor(o = {}) {
        _.defaults(o, {
            maxEntitySize: 128,
        });
        this.viewport = o.viewport;
        this.maxEntitySize = o.maxEntitySize;
        /**
         * @type {Entity[]}
         */
        this.entities = [];
    }
    /**
     * @param {Entity} ent 
     */
    addEntity(ent) {
        this.entities.push(ent);
        return ent;
    }
    update(dt) {
        var _deferredKill = [];
        for (var ent of this.entities) {
            if (!ent._killed) {
                if (ent.update) ent.update(dt);
            } else {
                _deferredKill.push(ent);
            }
        }
        if (_deferredKill.length > 0) {
            this.entities = this.entities.filter(e => !(_deferredKill.indexOf(e) >= 0));
        }
    }
    draw() {
        var zIndexArray = [];
        var entitiesBucketByZIndex = {};
        var viewRect = {
            x: this.viewport.position.x,
            y: this.viewport.position.y,
            w: this.viewport.size.x,
            h: this.viewport.size.y,
        }
        for (var ent of this.entities) {
            var fudgeVariance = Math.max(this.maxEntitySize, ent.size.x, ent.size.y);
            if (
                ent.position.x < viewRect.x - fudgeVariance
                || ent.position.x > viewRect.x + viewRect.w + fudgeVariance
                || ent.position.y < viewRect.y - fudgeVariance
                || ent.position.y > viewRect.y + viewRect.h + fudgeVariance
            ) {
                continue;
            }
            if (zIndexArray.indexOf(ent.zindex) < 0) {
                zIndexArray.push(ent.zindex);
                entitiesBucketByZIndex[ent.zindex] = [];
            }
            entitiesBucketByZIndex[ent.zindex].push(ent);
        }
        zIndexArray.sort((a, b) => a - b);
        for (var zIndex of zIndexArray) {
            for (var ent of entitiesBucketByZIndex[zIndex]) {
                if (ent.draw) ent.draw();
            }
        }
    }
}
