import AInstancerView2D from "../../AniGraph/src/amvc/views/AInstancerView2D";
import ASliderSpec from "../../AniGraph/src/acomponent/gui/specs/ASliderSpec";
import AButtonSpec from "../../AniGraph/src/acomponent/gui/specs/AButtonSpec";
import Color from "../../AniGraph/src/amath/Color";
import Matrix3x3 from "../../AniGraph/src/amath/Matrix3x3";
import Vec2 from "../../AniGraph/src/amath/Vec2";


/**
 * This file provides an example of a custom instance view. That is, a view that renders as multiple instances of
 * the subtree in a scene graph rooted at the view's corresponding model.
 *
 * This example renders an instance copy at some translation from the original, and provides the parameters of that
 * translation as controllable and animateable vars. We will also have our instance animate at a slight time shift
 * with our original.
 */
export default class AExampleInstanceView extends AInstancerView2D{

    // You can switch this if you want your instances to go in front or behind your main render elements.
    static InstancesBehindMainElements = true;

    /**
     * We provide three controls: two for translating our instance, and one for shifting it in time (given in seconds).
     */
    static GUISpecs = [
        new ASliderSpec({
            name: 'TranslateInstanceX',
            defaultValue: 100,
            minVal: 0,
            maxVal: 500,
            step: 0.001,
            canAnimate: true
        }),

        new ASliderSpec({
            name: 'TranslateInstanceY',
            defaultValue: 100,
            minVal: 0,
            maxVal: 500,
            step: 0.05,
            canAnimate: true
        }),
        new ASliderSpec({
            name: 'AnimationOffset',
            defaultValue: 0,
            minVal: -5,
            maxVal: 5,
            step: 0.01,
        }),
        new AButtonSpec({
            name: 'ZeroAnimationOffset'
        })
    ];

    initGUISpecVars(){
        // the parent method will set any defaults we specified in GUISpecs...
        super.initGUISpecVars();

        const self=this;
        this.getModel().setProperty('ZeroAnimationOffset', ()=>{
            self.setGUIVar('AnimationOffset', 0);
        })
    }

    initInstanceGeometry() {
        super.initInstanceGeometry();
        // Let's add a new instances.
        var instanceA = this.addNewInstance();

        // New instances will also be stored in this.instances, which is a lists
        console.assert(instanceA === this.instances[0], "New instances are stored in this.instances[#]");

        // We can also set custom attributes on instances to help us do things later...
        // This wont matter much now since we're only creating one instance, but it could help if we want different instances
        // to do different things.
        instanceA.randomExampleDummyVariable = 0;
    }

    /**
     * Get the geometry for an instance.
     * @param instance - the instance
     * @param element - the element being rendered within the instance (e.g., a copy of the shape of some descendent in the scene graph)
     * @param time - the time (in the current animation) that is being animated
     * @returns {any} list of Vec2/Point2D vertices
     */
    getVerticesForInstanceSubElement(instance, element, time){
        // we can access the model that this element corresponds to. For example, if we instance the root of a tree, this
        // might be the model for a leaf that we are rendering...
        var elementModel = element.model;

        // A matrix transforming the default geometry for this element to the geometry for this instance
        var instanceMatrix = instance.matrix;

        // And optional offset in time for animations
        var instanceTimeOffset = (instance.timeOffset!==undefined)?instance.timeOffset : 0;
        var elementTime = time+instanceTimeOffset;

        // Finally, let's get the vertices at the specified time
        var elementVertices = elementModel.getVerticesAtTime(elementTime);

        // ...and return them transformed by our instance matrix
        return instanceMatrix.applyToPoints(elementVertices);
    }

    /**
     * Here we can optionally modify the attributes of instances.
     * @param instance
     * @param element
     * @param time
     */
    updateInstanceSubElement(instance, element, time){
        // First we set the vertices..
        var verts = this.getVerticesForInstanceSubElement(instance, element, time);
        element.setVertices(verts);

        // Next, we can optionally set attributes...
        // element.setAttributes(elementModel.getAttributes());

        // We can set attributes for specific parts and specific instances, too.
        // To change the name of a model, you use the corresponding text input in the graph view
        if(element.model.name==='RandomColor' && instance.randomExampleDummyVariable==0){
            element.setAttribute('fill', Color.Random().toRGBAString());
        }
    }


    updateInstances(){
        super.updateInstances();
    }

    updateViewElements() {
        // First let's calculate a shift matrix to shift our instance by
        // For now it's just a translation
        var position = new Vec2(this.getGUIVar("TranslateInstanceX"), this.getGUIVar("TranslateInstanceY"));
        var rotation = 0;
        var scale = new Vec2(1,1);
        var anchorshift = new Vec2(0,0);

        var shiftMatrix = Matrix3x3.FromProperties(
            {
                position: position,
                rotation: rotation,
                scale: scale,
                anchorshift: anchorshift
            }
        )

        //We'll shift our instance by setting its matrix to shiftMatrix
        //We could to this differently for each instance if we have multiple instances
        this.instances[0].matrix = shiftMatrix;

        //And we'll set a time offset (how far ahead or behind it is in animating, given in seconds)
        this.instances[0].timeOffset = this.getGUIVar("AnimationOffset");

        // Remember that your instances will only animate if at least one keyframe track is activated!
        // If you don't want to animate the root group of the instances, just put one keyframe down in the AnimationOffset
        // track at time 0, with whatever value you want the offset to be.

        super.updateViewElements();
    }
}