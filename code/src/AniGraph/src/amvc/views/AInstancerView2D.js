import AView2D from "./AView2D";
import AObject from "../../aobject/AObject";
import ASVGSubtreeInstanceElement from "../../aweb/svg/ASVGSubtreeInstanceElement";

//##################//--Creating Custom Animated Views--\\##################
/***
 * This file demonstrates how to create a custom view class with animatable
 * properties, which you can use as parameters in procedural graphics.
 *
 */
//##################\\----------------------------------//##################



export default class AInstancerView2D extends AView2D{
    static GUISpecs = [];
    static InstancesBehindMainElements = true;

    constructor(args){
        super(args);
        this.instancesGoBehind = (args && args.instancesGoBehind!==undefined)? args.instancesGoBehind : this.constructor.InstancesBehindMainElements;
    }

    addNewInstance(args){
        var passArgs = Object.assign({
            view: this,
        }, args);
        if(passArgs.twoJSObject===undefined){
            passArgs.twoJSObject = this.getGraphicsContext().two.makeGroup()
        }
        if(passArgs.context===undefined){
            passArgs.context = this.getGraphicsContext();
        }
        var newInstance = new ASVGSubtreeInstanceElement(passArgs);
        // this.instances.push(newInstance);
        this.instances.push(newInstance);
        this.addGraphic(newInstance);
        return newInstance;
    }


    getVerticesForInstanceSubElement(instance, element, time){
        var elementModel = element.model;
        var instanceMatrix = instance.matrix;
        var instanceTimeOffset = (instance.timeOffset!==undefined)?instance.timeOffset : 0;
        var elementTime = time+instanceTimeOffset;
        var elementVertices = elementModel.getVerticesAtTime(elementTime);
        return instanceMatrix.applyToPoints(elementVertices);
    }

    updateInstanceSubElement(instance, element, time){
        // First we set the vertices..
        var verts = this.getVerticesForInstanceSubElement(instance, element, time);
        element.setVertices(verts);
        // Next, we can optionally set attributes...
        // element.setAttributes(elementModel.getAttributes());
    }

    initGeometry() {
        // We will add our shadow first so it goes in the back
        var otherChildren;
        if(this.instancesGoBehind){
            otherChildren = this.getGroup().getChildrenList();
            for(let c of otherChildren){
                c.hide();
            }
        }
        this.initInstanceGeometry();
        var otherChildren;
        if(this.instancesGoBehind){
            for(let c of otherChildren){
                c.show();
            }
        }
        super.initGeometry();
    }

    initInstanceGeometry(){
        if(this.instances===undefined){
            this.instances = [];
        }
    }

    resetGraphics(){
        // for(let i of this.instances){
        //     i.release();
        // }
        super.clearGraphicsElements();
        this.instances = [];
        this.initGeometry();
    }

    updateInstances(){
        for(let i of this.instances) {
            if (!i.updateInstanceElements(this.getModel().currentDisplayTime)) {
                this.resetGraphics();
                this.updateViewElements();
                return;
            }
        }
    }

    updateViewElements() {
        this.updateInstances();
        super.updateViewElements();
    }
}
AObject.RegisterClass(AInstancerView2D);