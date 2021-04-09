import {PointList2D, Vec2, ASVGParticle} from "AniGraph";

export default class ExplicitPopcornParticle extends ASVGParticle{
    static MAX_SIDES = 6; // Exclusive
    static MIN_SIDES = 3; // Inclusive
    static ANGLE_IRREGULARITY = 0.5;
    static PROTRUSION_MAX = 0.8;
    static PROTRUSION_MIN = 0.4;

    static getInitConfig(){
        // Configuration Variables
        const numSides = Math.floor(Math.random() *
            (ExplicitPopcornParticle.MAX_SIDES - ExplicitPopcornParticle.MIN_SIDES)) +
            ExplicitPopcornParticle.MIN_SIDES;
        const sides = [];
        let angleSum = 0;
        for (let i = 0; i < numSides; i++){
            let angle = Math.random() * ExplicitPopcornParticle.ANGLE_IRREGULARITY +
                (1 - ExplicitPopcornParticle.ANGLE_IRREGULARITY);
            sides.push(angle);
            angleSum += angle;
        }
        for (let i = 0; i < numSides; i++){
            sides[i] = sides[i] / angleSum * Math.PI * 2;
        }
        // First angle is interior, angles alternate
        const angles = [];
        const protrusion = [];
        let currAngle = 0;
        for (let i = 0; i < numSides * 2; i++){
            angles.push(currAngle);
            currAngle += sides[Math.floor(i / 2)] / 2;
            if (i % 2 === 0){
                protrusion.push(Math.random() *
                    (ExplicitPopcornParticle.PROTRUSION_MAX - ExplicitPopcornParticle.PROTRUSION_MIN) + 0.8);
            } else {
                protrusion.push(Math.random() *
                    (ExplicitPopcornParticle.PROTRUSION_MAX - ExplicitPopcornParticle.PROTRUSION_MIN) +
                    ExplicitPopcornParticle.PROTRUSION_MIN);
            }
        }
        return {
            angle: angles,
            protrusion: protrusion
        };
    }

    constructor(args){
        super(args);

        this.particle_type = 'Explicit'
        this._config = ExplicitPopcornParticle.getInitConfig();
        this._position = (args && args.position)? args.position : new Vec2(0,0);
        this._radius = (args && args.radius)? args.radius : 10;
        this._rotation = (args && args.rotation)? args.rotation : 0;
        this.updateVertices();
        this.setAttribute("fill", "yellow");

        // initialize anchorPosition
        this.anchorRotation = this._rotation

        // add velocity if you are doing euler integration
        // this.velocity = new Vec2(...)...

        //Or, you could do the full state as one big vector. *OR* you could even do the whole particle
        //system as one long vector of degrees of freedom. If we were doing this in numpy, that would probably
        //make a big performance difference. In Javascript, probably not quite as significant.
    }

    /** Get set position */
    get position(){return this._position;}

    setPosition(position){
        this._position = position;
        this.updateVertices();
    }

    get rot(){ return this._rotation; }

    setRot(rotation){
        this._rotation = rotation;
        this.updateVertices();
    }

    /** Get set radius */
    get radius(){return this._radius;}
    setRadius(radius){
        this._radius = radius;
        this.updateVertices();
    }

    updateVertices(){
        this.setVertices(PointList2D.Popcorn(this.position, this._config, this._radius, this._rotation));
    }
}