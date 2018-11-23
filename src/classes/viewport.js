import Victor from 'victor';


export default class Viewport {
    /**
     * @param {Object} o - options
     * @param {HTMLCanvasElement} o.canvasElement
     * @param {CanvasRenderingContext2D} o.context
     * @param {Object} [o.bounds]
     * @param {number} [o.bounds.left]
     * @param {number} [o.bounds.right]
     * @param {number} [o.bounds.top]
     * @param {number} [o.bounds.bottom]
     */
    constructor(o = {}) {
        _.defaults(o, {
            bounds: {},
        });
        this.position = new Victor(0, 0);
        this.size = new Victor(0, 0);
        this.scale = new Victor(1, 1);
        this.canvasElement = o.canvasElement;
        this.context = o.context;
        this.bounds = o.bounds;
    }
    /**
     * @param {number} dScale
     */
    changeScale(dScale) {
        this.scale.x += dScale;
        this.scale.y += dScale;
        this.updateSize();
    }
    updateSize() {
        this.size.x = this.canvasElement.width / this.scale.x;
        this.size.y = this.canvasElement.height / this.scale.y;
    }
    /**
     * @param {Victor} pos
     */
    setLeftTopPosition(pos) {
        this.position.x = pos.x;
        this.position.y = pos.y;
    }
    applyBounds() {
        if (this.bounds.left !== undefined)
            this.position.x = Math.max(this.position.x, this.bounds.left);
        if (this.bounds.top !== undefined)
            this.position.y = Math.max(this.position.y, this.bounds.top);
        if (this.bounds.right !== undefined)
            this.position.x = Math.min(this.position.x, this.bounds.right - this.size.x);
        if (this.bounds.bottom !== undefined)
            this.position.y = Math.min(this.position.y, this.bounds.bottom - this.size.y);
    }
    /**
     * @param {Victor} pos
     */
    centerAt(pos) {
        this.position.x = pos.x - this.size.x / 2;
        this.position.y = pos.y - this.size.y / 2;
        if (this.bounds) {
            this.applyBounds();
        }
    }
    getCenter() {
        return new Victor(
            this.position.x + this.size.x / 2,
            this.position.y + this.size.y / 2,
        );
    }
    begin() {
        this.context.save();
        this.context.translate(-this.position.x * this.scale.x, -this.position.y * this.scale.y);
        this.context.scale(this.scale.x, this.scale.y);
    }
    end() {
        this.context.restore();
    }
}
