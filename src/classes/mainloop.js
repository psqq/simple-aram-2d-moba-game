import _ from 'lodash';

export default class Mainloop {
    constructor(o = {}) {
        _.defaults(o, {
            update: () => 0,
            draw: () => 0,
            obj: null,
        });
        this.obj = o.obj;
        this.timestamp = 0;
        this.dt = 0;
        this.timeOfLastUpdate = 0;
        this.update = o.update;
        this.draw = o.draw;
        this.done = false;
    }
    run() {
        this.done = false;
        var go = () => {
            if (this.done) return;
            this.timestamp = performance.now();
            this.dt = this.timestamp - this.timeOfLastUpdate;
            this.timeOfLastUpdate = this.timestamp;
            if (this.obj) {
                if (this.obj.update) this.obj.update.apply(this.obj);
                if (this.obj.draw) this.obj.draw.apply(this.obj);
            } else {
                this.update();
                this.draw();
            }
            requestAnimationFrame(go);
        };
        this.timeOfLastUpdate = performance.now();
        requestAnimationFrame(go);
    }
    stop() {
        this.done = true;
    }
}
