import ImageManager from './image-manager';
import Victor from 'victor';
import Canvas from './canvas';
import AnimationFrame from './animation-frame';
import Animation from './animation';
import Mainloop from './mainloop';


export default class AnimationManager {
    /**
     * @param {Object} o - options
     * @param {ImageManager} o.imagesManager
     * @param {Canvas} o.canvas
     * @param {Mainloop} o.mainloop
     */
    constructor(o = {}) {
        /**
         * @type {AnimationFrame[]}
         */
        this.frames = [];
        this.canvas = o.canvas;
        this.imagesManager = o.imagesManager;
        this.mainloop = o.mainloop;
        /**
         * @type {Object.<string, AnimationFrame[]>}
         */
        this.animationFrames = {};
    }
    getFrameIndex(frameName) {
        var i = 0;
        for(var frame of this.frames) {
            if (frame.name === frameName) {
                return i;
            }
            i++;
        }
        return -1;
    }
    /**
     * @param {string} name
     * @param {string} imageName
     * @param {Victor} [tileCellPosition=null]
     */
    addFrame(name, imageName, tileCellPosition=null) {
        this.frames.push(new AnimationFrame({
            name,
            imagesManager: this.imagesManager,
            canvas: this.canvas,
            imageName,
            tileCellPosition,
        }));
    }
    /**
     * @param {Object} name
     * @param {string[]} frameNames
     */
    addAnimation(name, frameNames) {
        this.animationFrames[name] = [];
        for(var frameName of frameNames) {
            this.animationFrames[name].push(
                this.frames[this.getFrameIndex(frameName)]
            );
        }
    }
    /**
     * @param {Object} o - options
     * @param {number} [o.frameRate=1000/30]
     * @param {number} [o.duration]
     * @param {boolean} [o.loop=true]
     */
    getAnimation(name, o = {}) {
        o = _.defaults(o, {
            mainloop: this.mainloop,
            animationManager: this,
            frames: this.animationFrames[name],
        });
        return new Animation(o);
    }
}
