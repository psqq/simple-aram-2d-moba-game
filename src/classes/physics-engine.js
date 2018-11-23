import Matter from 'matter-js';
import Victor from 'victor';
import Mainloop from './mainloop';

export const
    Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Bodies = Matter.Bodies;


export default class PhysicsEngine {
    /**
     * @param {Object} o - options
     * @param {Mainloop} o.mainloop
     * @param {boolean} [o.noGravity=false]
     */
    constructor(o = {}) {
        _.defaults(o, {
            noGravity: false
        });
        this.mainloop = o.mainloop;
        this.engine = Engine.create();
        this.world = this.engine.world;
        if (o.noGravity) {
            this.world.gravity.y = 0;
            this.world.gravity.x = 0;
        }
        Events.on(this.engine, "collisionStart", e => this.onCollisionStart(e));
    }
    onCollisionStart(event) {
        for (var pair of event.pairs) {
            var a = pair.bodyA, b = pair.bodyB;
            if (a.userData
                && a.userData.entity
                && a.userData.entity.onCollisionStart
            ) {
                a.userData.entity.onCollisionStart(b);
            }
            if (b.userData
                && b.userData.entity
                && b.userData.entity.onCollisionStart
            ) {
                b.userData.entity.onCollisionStart(a);
            }
        }
    }
    /**
     * @param {Body} body
     * @param {Victor} velocity
     */
    setVelocityForBody(body, velocity) {
        Body.setVelocity(
            body,
            new Vector.create(velocity.x, velocity.y)
        );
    }
    update() {
        Engine.update(this.engine, this.mainloop.dt);
    }
    /**
     * @param {Object} o - options
     * @param {boolean} [o.isArcade=false]
     * @param {string} [o.shape='rectangle']
     * @param {boolean} [o.isStatic=false]
     * @param {Victor} o.position
     * @param {Victor} o.size
     */
    addBody(o = {}) {
        _.defaults(o, {
            shape: 'rectangle',
            isArcade: false,
            isStatic: false,
        });
        var bodySettings = {
            isStatic: o.isStatic,
        };
        if (o.isArcade) {
            bodySettings.density = 1;
            bodySettings.friction = 0;
            bodySettings.restitution = 1;
            bodySettings.inertia = Infinity;
        }
        var body;
        if (o.shape === 'rectangle') {
            body = Bodies.rectangle(
                o.position.x, o.position.y,
                o.size.x, o.size.y,
                bodySettings
            );
        }
        World.add(this.world, body);
        return body;
    }
    /**
     * @param {Body} body
     */
    removeBody(body) {
        Composite.remove(this.world, body)
    }
    /**
     * @param {Body} body
     * @param {string} [color=black]
     */
    drawBody(body, color = 'black') {
        ctx.beginPath();
        var p = body.vertices[0];
        ctx.moveTo(p.x, p.y);
        for (var i = 1; i < body.vertices.length; i++) {
            p = body.vertices[i];
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    drawStaticBodyes() {
        var bodies = Composite.allBodies(this.world);
        for (var b of bodies) {
            if (b.isStatic) {
                drawBody(b, 'red');
            }
        }
    }
    drawDynamicBodyes() {
        var bodies = Composite.allBodies(this.world);
        for (var b of bodies) {
            if (!b.isStatic) {
                drawBody(b, 'red');
            }
        }
    }
}
