import path from 'path-browserify';
import ImageManager from './image-manager';
import Canvas from './canvas';
import Victor from 'victor';
import Utils from './utils';
import Viewport from './viewport';
import PhysicsEngine from './physics-engine';


export default class TiledMap {
    /**
     * @param {Object} o - options
     * @param {string} o.filename
     * @param {ImageManager} o.imageManager
     * @param {PhysicsEngine} o.physicsEngine
     * @param {Viewport} o.viewport
     * @param {Canvas} o.canvas
     */
    constructor(o = {}) {
        this.filename = o.filename;
        this.imageManager = o.imageManager;
        this.canvas = o.canvas;
        this.physicsEngine = o.physicsEngine;
        this.viewport = o.viewport;
        this.numberOfTiles = new Victor(0, 0);
        this.tileSize = new Victor(0, 0);
        this.pixelSize = new Victor(0, 0);
        this.tileSets = [];
        this.cachedCanvas = null;
    }
    async loadAndParse() {
        var json = await Utils.loadJsonFile(this.filename);
        this.mapJSON = json;
        this.numberOfTiles.x = json.width;
        this.numberOfTiles.y = json.height;
        this.tileSize = {
            x: json.tilewidth, y: json.tileheight
        };
        this.pixelSize = {
            x: this.numberOfTiles.x * this.tileSize.x,
            y: this.numberOfTiles.y * this.tileSize.y
        };
        for (var tileset of json.tilesets) {
            var curDir = path.dirname(this.filename);
            var tilesetDir = curDir;
            if (tileset.source) {
                var tilesetFilename = path.join(curDir, tileset.source);
                tilesetDir = path.dirname(tilesetFilename);
                var tilesetJSON = await Utils.loadJsonFile(tilesetFilename);
                Object.assign(tileset, tilesetJSON);
            }
            var imageFilename = path.join(tilesetDir, tileset.image);
            var img = await this.imageManager.loadAndGetImage({
                src: imageFilename,
            });
            this.tileSets.push({
                image: img.image,
                firstgid: tileset.firstgid,
                imageheight: tileset.imageheight,
                imagewidth: tileset.imagewidth,
                name: tileset.name,
                numXTiles: Math.floor(tileset.imagewidth / this.tileSize.x),
                numYTiles: Math.floor(tileset.imageheight / this.tileSize.y)
            });

        }
    }
    getTilePacket(tileIndex) {
        var pkt = {
            img: null, px: 0, py: 0
        };
        for (var i = this.tileSets.length - 1; i >= 0; i--) {
            var tileset = this.tileSets[i];
            if (tileset.firstgid <= tileIndex) {
                pkt.img = tileset.image;
                var localIdx = tileIndex - tileset.firstgid;
                pkt.py = this.tileSize.y * Math.floor(localIdx / tileset.numXTiles);
                pkt.px = this.tileSize.x * (localIdx % tileset.numXTiles);
                break;
            }
        }
        return pkt;
    }
    draw(aCtx) {
        if (!aCtx) aCtx = this.canvas.context;
        for (var layer of this.mapJSON.layers) {
            if (layer.type === 'tilelayer') {
                for (var i = 0; i < layer.data.length; i++) {
                    var idx = layer.data[i];
                    if (idx <= 0) {
                        continue;
                    }
                    var pkt = this.getTilePacket(idx);
                    var x = this.tileSize.y * (i % this.numberOfTiles.x);
                    var y = this.tileSize.x * Math.floor(i / this.numberOfTiles.x);
                    aCtx.drawImage(
                        pkt.img,
                        pkt.px, pkt.py,
                        this.tileSize.x, this.tileSize.y,
                        x, y,
                        this.tileSize.x, this.tileSize.y
                    );
                }
            }
        }
    }
    drawFromCache() {
        var ctx = this.canvas.context;
        var c = this.cachedCanvas;
        var r = {
            x: this.viewport.position.x,
            y: this.viewport.position.y,
            w: this.viewport.size.x,
            h: this.viewport.size.y,
        }
        ctx.drawImage(
            c,
            r.x, r.y, r.w, r.h,
            r.x, r.y, r.w, r.h,
        );
    }
    makeCache() {
        this.cachedCanvas = document.createElement('canvas');
        this.cachedCanvas.width = this.pixelSize.x;
        this.cachedCanvas.height = this.pixelSize.y;
        var cachedCtx = this.cachedCanvas.getContext('2d');
        this.draw(cachedCtx);
    }
    createStaticObjects() {
        var physicsEngine = this.physicsEngine;
        var layerName = 'collision';
        for (var layer of this.mapJSON.layers) {
            if (layer.type === 'objectgroup' && layer.name === layerName) {
                for (var obj of layer.objects) {
                    physicsEngine.addBody({
                        isArcade: true,
                        isStatic: true,
                        position: new Victor(
                            obj.x + obj.width / 2,
                            obj.y + obj.height / 2,
                        ),
                        size: new Victor(
                            obj.width, obj.height,
                        )
                    })
                }
            }
        }
    }
    drawStaticObjects() {
        var ctx = this.canvas.context;
        for (var layer of this.mapJSON.layers) {
            if (layer.type === 'objectgroup' && layer.name === 'collision') {
                for (var obj of layer.objects) {
                    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                }
            }
        }
    }
    spawnTeleporters() {
        for (var layer of this.mapJSON.layers) {
            if (layer.type === 'objectgroup' && layer.name === 'environment') {
                for (var obj of layer.objects) {
                    if (obj.name === 'TP') {
                        gameEngine.spawnEnitty(
                            new TeleporterEntity({
                                x: obj.x + obj.width / 2,
                                y: obj.y + obj.height / 2,
                                w: obj.width,
                                h: obj.height
                            })
                        );
                    }
                }
            }
        }
    }
}
