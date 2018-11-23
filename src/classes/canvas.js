
export default class Canvas {
    /**
     * @param {Object} o - options
     * @param {string} [o.selector]
     * @param {string} [o.rootSelector]
     * @param {number} [o.width]
     * @param {number} [o.height]
     */
    constructor(o = {}) {
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas = null;
        if (o.selector) {
            this.canvas = document.querySelector(o.selector);
        } else {
            o.rootSelector = o.rootSelector || 'body';
            this.canvas = document.createElement('canvas');
            document.querySelector(o.rootSelector).append(this.canvas);
        }
        if (o.width) this.canvas.width = o.width;
        if (o.height) this.canvas.height = o.height;
        this.context = this.canvas.getContext('2d');
        this.onresize = () => this.setFullscreenSize();
        this.displayStyleForShow = '';
    }
    setFullscreenSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    setFullscreenStyles() {
        this.canvas.style.position = 'fixed';
        this.displayStyleForShow = 'fixed';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
    }
    makeCanvasFullscreen() {
        this.setFullscreenSize();
        this.setFullscreenStyles();
    }
    makeAlwaysCanvasFullscreen() {
        this.makeCanvasFullscreen();
        window.addEventListener('resize', this.onresize);
    }
    remove() {
        this.canvas.parentNode.removeChild(this.canvas);
        window.removeEventListener('resize', this.onresize);
    }
    show() {
        this.canvas.style.display = this.displayStyleForShow;
    }
    hide() {
        this.displayStyleForShow = this.canvas.style.display;
        this.canvas.style.display = 'none';
    }
}
