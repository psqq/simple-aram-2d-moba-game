import Mainloop from '../classes/mainloop';


class Timer {
    /**
     * @param {Object} o - options
     * @param {Mainloop} o.mainloop
     * @param {number} o.interval
     */
    constructor(o = {}) {
        _.defaults(o, {
            interval: 1000,
        });
        this.mainloop = o.mainloop;
        this.interval = o.interval;
        this.time = 0;
    }
    update() {
        this.time += this.mainloop.dt;
        if (this.time > this.interval) {

        }
    }
    tick() {}
}
