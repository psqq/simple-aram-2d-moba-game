import path from 'path-browserify';
import ImageManager from './image-manager';
import Canvas from './canvas';
import PhysicsEngine from './physics-engine';
import EntityManager from './entities-manager';
import AnimationManager from './animation-manager';
import Mainloop from './mainloop';
import Victor from 'victor';
import Utils from './utils';
import Viewport from './viewport';
import TiledMap from './tiled-map';


export default class BaseGame {
    constructor() {
        this.mainloop = new Mainloop({ obj: this });
        this.canvas = new Canvas({
            rootSelector: 'body'
        });
        this.viewport = new Viewport({
            canvasElement: this.canvas.canvas,
            context: this.canvas.context,
            bounds: {
                left: 0,
                top: 0,
            }
        });
        this.imageManager = new ImageManager({
            createImageNamesFromSrc: true,
        });
        this.animationManager = new AnimationManager({
            imagesManager: this.imageManager,
            mainloop: this.mainloop,
            canvas: this.canvas,
        });
        this.physicsEngine = new PhysicsEngine({
            mainloop: this.mainloop,
            noGravity: true,
            canvas: this.canvas,
        });
        this.entityManager = new EntityManager({
            viewport: this.viewport,
        });
        /**
         * @type {Object.<string, TiledMap>}
         */
        this.maps = {};
        window.g = this;
    }
    addMap(mapName, filename) {
        this.maps[mapName] = new TiledMap({
            filename,
            viewport: this.viewport,
            canvas: this.canvas,
            imageManager: this.imageManager,
            physicsEngine: this.physicsEngine,
        });
    }
    async load() {
        await this.imageManager.loadAllImages();
        for(var mapName in this.maps) {
            await this.maps[mapName].loadAndParse();
            this.maps[mapName].makeCache();
        }
        this.afterLoad();
    }
    afterLoad() {}
    drawMap(mapName) {
        this.maps[mapName].drawFromCache();
    }
    update() {
        this.viewport.updateSize();
        this.entityManager.update();
        this.physicsEngine.update();
    }
    drawBody() {
        this.entityManager.draw();
    }
    draw() {
        var ctx = this.canvas.context;
        var w = this.canvas.canvas.width;
        var h = this.canvas.canvas.height;
        ctx.clearRect(0, 0, w, h);
        this.viewport.begin();
        this.drawBody();
        this.viewport.end();
    }
}
