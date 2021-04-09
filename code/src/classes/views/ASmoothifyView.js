import AView2D from "../../AniGraph/src/amvc/views/AView2D";
import AAnimatedColorPickerSpec from "../../AniGraph/src/acomponent/gui/specs/AAnimatedColorPickerSpec";
import Matrix3x3 from "../../AniGraph/src/amath/Matrix3x3";
import ASliderSpec from "../../AniGraph/src/acomponent/gui/specs/ASliderSpec";
import Vec2 from "../../AniGraph/src/amath/Vec2";
import AObject from "../../AniGraph/src/aobject/AObject";
import ASelectionControlSpec from "../../AniGraph/src/acomponent/gui/specs/ASelectionControlSpec";
import ACheckboxSpec from "../../AniGraph/src/acomponent/gui/specs/ACheckboxSpec";
import Color,{RGBA} from "../../AniGraph/src/amath/Color";

//##################//--Creating Custom Animated Views--\\##################
/***
 * This file demonstrates how to create a custom view class with animatable
 * properties, which you can use as parameters in procedural graphics.
 *
 */
//##################\\----------------------------------//##################

export default class ASmoothifyView extends AView2D{


    static InstancesBehindMainElements = false;
    /**
     * Here we will specify a static list `GUISpecs` of AGUIElementSpec subclasses.
     * You don't need to worry about how exactly the parent classes work---what's
     * important is that each class corresponds to a different type of GUI element
     * that you can use to control a parameter, which will be assigned as a property
     * to this view's model.
     *
     * Below you will find an example of each type of control.
     * @type {[AAnimatedColorPickerSpec, ASliderSpec]}
     */
    static GUISpecs = [
        new ASliderSpec({
            name: 'SmoothnessScale',
            defaultValue: 0,
            minVal: 0,
            maxVal: 5,
            canAnimate: true
        }),
        new ASliderSpec({
            name: 'TensionScale',
            defaultValue: 0,
            minVal: 0,
            maxVal: 1,
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
        this.shape.setAttributes(this.getModel().getAttributes());
        this.shape.setVertices(this.getModel().getVertices());
        const tension = this.getModel().getProperty('TensionScale');
        const smoothness =this.getModel().getProperty('SmoothnessScale');
        this.shape.setVertices(this.chaikin(this.getModel(), tension, smoothness));


    }
    /**
 *  Function for creating smoothing curves using a method called corner cutting.
 *  Reference: http://www.cs.unc.edu/~dm/UNC/COMP258/LECTURES/Chaikins-Algorithm.pdf
 *  @param model Base A1Model used to create smoother shape
 *  @param tension Number determining curve bias. Smoothening occurs between 0.5 and 1.
 *  @param smoothness Number representing the number of iterations being applied. Default set to 0 (Off).
 *  @returns returns pointList the same as before or with modifications (in world space)
 */
    chaikin(model, tension=0.75, smoothness=0){
        let newModel = model;
        let smoothedPoints = newModel.getVertices();

        // We desire at least 3 points for line smoothening
        if (smoothedPoints.length < 3){
            console.assert(smoothedPoints.length < 3,
                "Not enough vertices to apply Chaikin smoothing. Please have at least 3 points.");
            return smoothedPoints;
        }
        else if (smoothness === 0){
            return smoothedPoints;
        }
        // Recursively applying smoothening to the most recent set of points
        else{
            let n = 0;
            while (n < smoothness){
                smoothedPoints = this.smoothPoints(smoothedPoints, tension);
                n += 1;
            }
        }

        return smoothedPoints;
    }

/**
 *  Helper function to apply the Chaikin algorithm once to a set of points
 *  Uses corner cutting and adds to new list
 *  @param pointList List of model vertices
 *  @param tension Number determining curve bias
 *  @returns new PointList with corner-cut vertices
 */
    smoothPoints(pointList=[], tension=0.75){
        let points=[];
        for (let i=0; i < pointList.length-1; i++){
            // here tension is used to bias the curve.
            let Q = pointList[i].times(tension).plus(pointList[i+1].times(1-tension));
            let R = pointList[i].times(1-tension).plus(pointList[i+1].times(tension));
            points.push(Q, R);
        }
        // final case to smooth out first and last vertices
        let Q = pointList[pointList.length-1].times(tension).plus(pointList[0].times(1-tension));
        let R = pointList[pointList.length-1].times(1-tension).plus(pointList[0].times(tension));
        points.push(Q, R);

        return points;
    }
}
AObject.RegisterClass(ASmoothifyView);