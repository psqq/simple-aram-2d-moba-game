import path from 'path-browserify';
import Victor from 'victor';


export default class ImageManager {
    /**
     * @param {Object} o - options
     * @param {Object[]} [o.images=[]]
     * @param {string} [o.images.name]
     * @param {string} [o.images.src]
     * @param {HTMLImageElement} [o.images.image]
     * @param {Victor} [o.images.size]
     * @param {Victor} [o.images.tileSize]
     * @param {boolean} [o.createImageNamesFromSrc=false]
     */
    constructor(o = {}) {
        _.defaults(o, {
            images: [],
            createImageNamesFromSrc: false,
        });
        this.images = o.images;
        this.createImageNamesFromSrc = o.createImageNamesFromSrc;
        if (this.createImageNamesFromSrc) {
            for (var image of this.images) {
                if (!image.name) {
                    image.name = path.parse(image.src).name;
                }
            }
        }
    }
    /**
     * @param {Object} o - options
     * @param {string} [o.name]
     * @param {string} [o.src]
     * @param {HTMLImageElement} [o.image]
     * @param {Victor} [o.size]
     * @param {Victor} [o.tileSize]
     */
    addImage(o) {
        if (this.createImageNamesFromSrc && !o.name) {
            o.name = path.parse(o.src).name;
        }
        this.images.push(o);
    }
    /**
     * @param {Object} o - options
     * @param {string} [o.name]
     * @param {string} [o.src]
     * @param {HTMLImageElement} [o.image]
     * @param {Victor} [o.size]
     * @param {Victor} [o.tileSize]
     */
    async loadAndGetImage(o) {
        var img = this.getImage(o.src);
        if (img) {
            return img;
        }
        if (this.createImageNamesFromSrc && !o.name) {
            o.name = path.parse(o.src).name;
        }
        o.image = await this.loadImage(o.src);
        this.images.push(o);
        return o;
    }
    async loadAllImages() {
        var promises = [];
        for (var image of this.images) {
            promises.push(this.loadImage(image.src));
        }
        /**
         * @type {HTMLImageElement[]}
         */
        var imagesArr = await Promise.all(promises);
        for (var i = 0; i < this.images.length; i++) {
            this.images[i].image = imagesArr[i];
            this.images[i].size = new Victor(
                imagesArr[i].width,
                imagesArr[i].height,
            );
        }
    }
    /**
     * @param {string} filename
     */
    loadImage(filename) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = err => reject(err);
            img.src = filename;
        });
    }
    getImage(nameOrFilename) {
        for (var image of this.images) {
            if (image.name === nameOrFilename || image.src === nameOrFilename) {
                return image;
            }
        }
        return null;
    }
}
