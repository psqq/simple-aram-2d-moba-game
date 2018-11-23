import Mainloop from './mainloop';
import AnimationManager from './animation-manager';
import AnimationFrame from './animation-frame';
import Victor from 'victor';


export default class Animation {
    /**
     * @param {Object} o - options
     * @param {Mainloop} o.mainloop
     * @param {AnimationManager} o.animationManager
     * @param {AnimationFrame[]} o.frames
     * @param {number} [o.frameRate=1000/30]
     * @param {number} [o.duration]
     * @param {boolean} [o.loop=true]
     */
    constructor(o = {}) {
        _.defaults(o, {
            loop: true,
            frameRate: 1000 / 30,
        });
        this.mainloop = o.mainloop;
        this.animationManager = o.animationManager;
        this.frames = o.frames;
        if (o.duration) {
            o.frameRate = o.duration / this.frames.length;
        }
        this.frameRate = o.frameRate;
        this.frameTime = 0;
        this.frame = 0;
        this.loop = o.loop;
        this.done = false;
    }
    update() {
        if (this.done) return;
        var dt = this.mainloop.dt;
        this.frameTime += dt;
        if (this.frameTime > this.frameRate) {
            this.frame = this.frame + 1;
            this.frameTime = 0;
            if (this.frame == this.frames.length) {
                this.frame = 0;
                if (!this.loop) {
                    this.done = true;
                }
            }
        }
    }
    /**
     * @param {Victor} pos
     */
    draw(pos) {
        if (this.done) return;
        this.frames[this.frame].draw(pos);
    }
}
