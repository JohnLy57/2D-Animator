import AView2D from "../../AniGraph/src/amvc/views/AView2D";
import AAnimatedColorPickerSpec from "../../AniGraph/src/acomponent/gui/specs/AAnimatedColorPickerSpec";
import Matrix3x3 from "../../AniGraph/src/amath/Matrix3x3";
import ASliderSpec from "../../AniGraph/src/acomponent/gui/specs/ASliderSpec";
import Vec2 from "../../AniGraph/src/amath/Vec2";
import Vec3 from "../../AniGraph/src/amath/Vec3";
import AObject from "../../AniGraph/src/aobject/AObject";
import ASelectionControlSpec from "../../AniGraph/src/acomponent/gui/specs/ASelectionControlSpec";
import ACheckboxSpec from "../../AniGraph/src/acomponent/gui/specs/ACheckboxSpec";
import AButtonSpec from "../../AniGraph/src/acomponent/gui/specs/AButtonSpec";
import Color,{RGBA} from "../../AniGraph/src/amath/Color";
import AParticleView from "../../AniGraph/src/amvc/views/AParticleView.js"
import ASVGParticle from "../../AniGraph/src/aweb/svg/ASVGParticle.js";


// import {
//     AParticleView,
//     P2D, Vec2, Vec3,
//     Matrix3x3, Precision,
//     ASVGParticle,
//     ASliderSpec,
//     ACheckboxSpec
// } from "AniGraph";
import RainDropParticle from "../elements/RainDropParticle";

export default class RainDropView extends AParticleView{
    static DefaultParticleClass = RainDropParticle;
    static DefaultNParticles = 20;
    static EmitCooldown = 200; // milliseconds

    //Define the sliders that you want to appear in the controls tab when the selected view is set to this view
    static GUISpecs = [
        new ASliderSpec({
            name: 'XVelocity',
            minVal: 10,
            maxVal: 50,
        }),
        new ASliderSpec({
            name: 'YVelocity',
            minVal: 10,
            maxVal: 50,
        }),
        new ASliderSpec({
            name: 'ParticleSize',
            minVal: 0,
            maxVal: 100,
        }),
        new ASliderSpec({
            name: 'RotationVelocity',
            minVal: 0,
            maxVal: 2 * Math.PI,
        })
    ];


    /**
     * Initialize slider variables that are global to the app
     * Their values will only be set if they are currently undefined
     */
    initSliderVariablesApp(){
        super.initSliderVariablesApp();

        this._initAppVariable("Speed", 1);
        this._initAppVariable("Gravity", 5);
    }

    /**
     * Initialize slider variables that control model properties
     * Their values will only be set if they are currently undefined
     */
    initSliderVariablesModel(){
        super.initSliderVariablesModel();
        this._initModelVariable("XVelocity", 10);
        this._initModelVariable("YVelocity", 20);
        this._initModelVariable("ParticleSize", 10);
        this._initModelVariable("RotationVelocity", 1.0);
    }

    // constructor(args){
    //     super(args);
    //     // get root model - this is used for collecting all shape vertices & edges for collision detection
    //     this.rootModel = this.controller.model
    //     while (this.rootModel.getParent()) {
    //         this.rootModel = this.rootModel.getParent()
    //     }
    // }

    initGeometry() {
        super.initGeometry();
        this.nParticles = this.constructor.DefaultNParticles;
        console.log(this.getComponentAppState('currentTime'));
        this.lastEmitTime=0;
        this.particles = [];
        this.particleNum = 0;
        for(let p=0;p<this.nParticles;p++){
            this.particles.push(this.createParticle());
            this.particles[p].hide(); // potentially hide particles that have not been emitted yet.
        }
    }

    emitParticle(pt, args){
        console.log("here");
        if(pt.hidden){
            pt.show();
        }
        // set initial state
        const bbox = this.getModel().getWorldSpaceBBoxCorners();
        const startingPosX = bbox[0].x + Math.random() * (bbox[2].x - bbox[0].x);
        const startingPos = new Vec2(startingPosX,bbox[0].y)
        pt.anchorPosition = startingPos;
        pt.setPosition(startingPos);

        //We'll store the last time the particle was emitted
        pt.t0 = (args && args.time)? args.time : 0;
        pt.velX = Math.random() * 0.7 + 0.3;
        if (Math.random() > 0.5){
            pt.velX = - pt.velX;
        }
        pt.velY = Math.random() * 0.7 + 0.3;
        pt.size = Math.random() * 0.5 + 0.5;
        pt.rotVel = Math.random() * 0.5 + 0.5;
    }

    updateParticle(particle, edges, args){

        const time = (args && args.time)? args.time:0;
        const maxVelX = (args && args.maxX)? args.maxX : 10;
        const maxVelY = (args && args.maxY) ? args.maxY : 20;
        const gravity = (args && args.gravity) ? args.gravity : 1;
        const size = (args && args.size) ? args.size : 10;
        const maxRotVel = (args && args.rotVelocity) ? args.rotVelocity : 1.0;
        const speed = (args && args.speed) ? args.speed : 1.0;

        // customize this...
        const radius = size * particle.size;
        const xVel = particle.velX * maxVelX;
        const yVel = particle.velY * maxVelY;
        const yAccl = - gravity * 9.81;
        const rotVel = particle.rotVel * maxRotVel;

        const age = speed * (time-particle.t0)/1000;//in seconds

        // // assign properties to particle, so collision detection can reset them when needed
        // particle.vX = particle.velX;
        // particle.vY = particle.velY + yAccl * age / maxVelY;
        // particle.vRot = particle.rotVel;
        // particle.time = time;

        // explicit position determination
        // y(t) = at^2 + vt + y
        const rotation = particle.anchorRotation + age * rotVel;
        const xOffset = xVel * age;
        const yOffset = yVel * age + 0.5 * yAccl * age * age;
        const newPosition = particle.anchorPosition.plus(
            new Vec2(- xOffset,- yOffset)
        );
    }


    updateViewElements(){
        console.log(this.getComponentAppState('currentTime'));
        super.updateViewElements();
        var time = this.getComponentAppState('appTime');
        time = (time!==undefined)? time : 0;
        const model = this.getModel();
        // ...

        if(!this.particles){return;}

        // If you wanted to emit at a regular interval, or under some condition, you could change this logic.
        // you could also keep track of the last particle you emitted.
        if(time - this.lastEmitTime > RainDropView.EmitCooldown){
            this.emitParticle(this.particles[this.particleNum],
                {
                    time: this.getComponentAppState('appTime')
                });
            this.lastEmitTime = time;
            this.particleNum = (this.particleNum + 1) % this.particles.length;
        }

        for(let p=0;p<this.particles.length;p++) {
            const particle = this.particles[p];
            ///
            if (!particle.hidden) {
                this.updateParticle(particle, allEdges, {
                    time: time,
                    speed: this.getComponentAppState('Speed'),
                    gravity: this.getComponentAppState('Gravity'),
                    maxX: this.getSliderVariable('XVelocity'),
                    maxY: this.getSliderVariable('YVelocity'),
                    size: this.getSliderVariable('ParticleSize'),
                    rotVelocity: this.getSliderVariable('RotationVelocity')
                });
            }

            // or you could skip particles that haven't been emitted yet:
            // if(!particle.hidden) {
            //     this.updateParticle(args);
            // }
        }
    }
}
