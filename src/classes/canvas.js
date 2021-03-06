import Victor from 'victor';


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
    /**
     * @param {Object} img
     * @param {string} [img.name]
     * @param {string} [img.src]
     * @param {HTMLImageElement} [img.image]
     * @param {Victor} [img.size]
     * @param {Victor} [img.tileSize]
     * @param {Victor} pos
     */
    drawImage(img, pos) {
        this.context.drawImage(
            img.image,
            0, 0,
            img.size.x, img.size.y,
            pos.x - img.size.x / 2, pos.y - img.size.y / 2,
            img.size.x, img.size.y,
        );
    }
    drawCircle(pos, r, color='black') {
        var ctx = this.context;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    drawLine(p1, p2, color='black') {
        var ctx = this.context;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
    }
}
