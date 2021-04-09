import AView2D from "../../AniGraph/src/amvc/views/AView2D";
import AAnimatedColorPickerSpec from "../../AniGraph/src/acomponent/gui/specs/AAnimatedColorPickerSpec";
import Matrix3x3 from "../../AniGraph/src/amath/Matrix3x3";
import ASliderSpec from "../../AniGraph/src/acomponent/gui/specs/ASliderSpec";
import Vector from "../../AniGraph/src/amath/Vector";
import AObject from "../../AniGraph/src/aobject/AObject";
import ASelectionControlSpec from "../../AniGraph/src/acomponent/gui/specs/ASelectionControlSpec";
import ACheckboxSpec from "../../AniGraph/src/acomponent/gui/specs/ACheckboxSpec";
import AButtonSpec from "../../AniGraph/src/acomponent/gui/specs/AButtonSpec";
import Color,{RGBA} from "../../AniGraph/src/amath/Color";

//##################//--Creating Custom Animated Views--\\##################
/***
 * This file demonstrates how to create a custom view class with animatable
 * properties, which you can use as parameters in procedural graphics.
 *
 * The comments in this file assume you have looked at and understood the AExampleAnimatedView
 * I released last week.
 */
//##################\\----------------------------------//##################

export default class AAnimateColorView extends AView2D{


    /**
     * Here we will declare animate-able colors for the fill and stroke
     * @type {[AAnimatedColorPickerSpec, AAnimatedColorPickerSpec]}
     */
    static GUISpecs = [
        new AAnimatedColorPickerSpec({
            name: 'AnimateFillColor',
            defaultValue: RGBA(0.5, 0.5, 0.5, 1),
            canAnimate: true
        }),
        new AAnimatedColorPickerSpec({
            name: 'AnimateStrokeColor',
            defaultValue: RGBA(0, 0, 0, 0),
            canAnimate: true
        })
    ];

    initGUISpecVars(){
        // the parent method will set any defaults we specified in GUISpecs...
        super.initGUISpecVars();
    }

    initGeometry() {
        super.initGeometry();
    }

    updateViewElements() {
        super.updateViewElements();
        this.shape.setAttribute('fill', this.getAnimatedColorString('AnimateFillColor'));
        this.shape.setAttribute('stroke', this.getAnimatedColorString('AnimateStrokeColor'));
    }
}
AObject.RegisterClass(AAnimateColorView);