import Canvas from '../classes/canvas';
import Mainloop from '../classes/mainloop';
import BaseGame from '../classes/base-game';
import Viewport from '../classes/viewport';
import key from 'keymaster';
import Victor from 'victor';
import PhysicsEngine from '../classes/physics-engine';
import EntityManager from '../classes/entities-manager';
import Animation from '../classes/animation';
import AnimationManager from '../classes/animation-manager';
import Entity from '../classes/entity';
import Stats from '../classes/stats';
import GameEntity from './game-entity';


export default class HeroEnity extends GameEntity {
    /**
     * @param {Object} o - options
     * @param {BaseGame} o.game
     * @param {number} [o.zindex=0] - zindex for draw
     * @param {Victor} [o.position=(0, 0)] - center of entity
     * @param {Victor} [o.size=(0, 0)] - width and height of entity
     */
    constructor(o = {}) {
        _.defaults(o, {
            size: new Victor(16, 16),
            zindex: 10,
            attackRange: 40,
            movementSpeed: 2,
        });
        super(o);
        this.createBody();
        /**
         * @type {Object.<string, Animation]>}
         */
        this.animations = {};
        this.currentAnimation = 'hero_walk_up';
        this.isMoving = false;
    }
    /**
     * @param {Victor} velocity
     */
    move(velocity) {
        var dx = velocity.x, dy = velocity.y;
        if (velocity.length() > 0) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) this.currentAnimation = 'hero_walk_right';
                else this.currentAnimation = 'hero_walk_left';
            } else {
                if (dy > 0) this.currentAnimation = 'hero_walk_down';
                else this.currentAnimation = 'hero_walk_up';
            }
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        this.game.physicsEngine.setVelocityForBody(
            this.body, velocity
        );
    }
    createBody() {
        this.body = this.game.physicsEngine.addBody({
            isArcade: true,
            shape: 'rectangle',
            position: this.position,
            size: this.size,
        });
    }
    /**
     * @param {AnimationManager} animationManager
     */
    createAnimations() {
        var animationManager = this.game.animationManager;
        for (var i = 0; i < 4; i++) {
            animationManager.addFrame(
                'hero_walk_up_' + i,
                'Hero',
                new Victor(i, 0)
            );
            animationManager.addFrame(
                'hero_walk_down_' + i,
                'Hero',
                new Victor(4 + i, 0)
            );
            animationManager.addFrame(
                'hero_walk_left_' + i,
                'Hero',
                new Victor(i, 1)
            );
            animationManager.addFrame(
                'hero_walk_right_' + i,
                'Hero',
                new Victor(4 + i, 1)
            );
        }
        var prefixes = [
            'hero_walk_up', 'hero_walk_down',
            'hero_walk_left', 'hero_walk_right',
        ];
        for (var prefix of prefixes) {
            var frameNames = [];
            for (var i = 0; i < 4; i++) {
                frameNames.push(prefix + '_' + i);
            }
            animationManager.addAnimation(
                prefix, frameNames
            );
        }
        this.addAnimations();
    }
    addAnimations() {
        var prefixes = [
            'hero_walk_up', 'hero_walk_down',
            'hero_walk_left', 'hero_walk_right',
        ];
        for (var prefix of prefixes) {
            this.animations[prefix] = this.game.animationManager.getAnimation(
                prefix,
                { duration: 1000 }
            );
        }
    }
    update() {
        super.update();
        if (this.isMoving)
            this.animations[this.currentAnimation].update();
    }
    draw() {
        this.animations[this.currentAnimation].draw(this.position);
    }
}
