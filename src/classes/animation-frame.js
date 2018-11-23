import ImageManager from './image-manager';
import Victor from 'victor';
import Canvas from './canvas';


export default class AnimationFrame {
    /**
     * @param {Object} o - options
     * @param {string} o.name
     * @param {ImageManager} o.imagesManager
     * @param {Canvas} o.canvas
     * @param {string} o.imageName
     * @param {Victor} [o.tileCellPosition=null]
     */
    constructor(o = {}) {
        _.defaults(o, {
            name: '',
            tileCellPosition: null,
        });
        this.canvas = o.canvas;
        this.name = o.name;
        this.imagesManager = o.imagesManager;
        this.imageName = o.imageName;
        this.image = this.imagesManager.getImage(this.imageName);
        this.tileCellPosition = o.tileCellPosition;
        this.tilePosition = null;
        if (this.tileCellPosition) {
            this.tilePosition = new Victor(
                this.tileCellPosition.x * this.image.tileSize.x,
                this.tileCellPosition.y * this.image.tileSize.y,
            );
        }
    }
    /**
     * @param {Victor} pos
     */
    draw(pos) {
        this.canvas.context.drawImage(
            this.image.image,
            this.tilePosition.x, this.tilePosition.y,
            this.image.tileSize.x, this.image.tileSize.y,
            pos.x - this.image.tileSize.x / 2, pos.y - this.image.tileSize.y / 2,
            this.image.tileSize.x, this.image.tileSize.y,
        );
    }
}
