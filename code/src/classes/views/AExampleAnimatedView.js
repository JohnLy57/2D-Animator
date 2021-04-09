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
 */
//##################\\----------------------------------//##################

export default class AExampleAnimatedView extends AView2D{


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
            name: 'ShadowScale',
            defaultValue: 1.5,
            minVal: 0,
            maxVal: 5,
            canAnimate: true
        }),
        new AAnimatedColorPickerSpec({
            name: 'ShadowColor',
            defaultValue: RGBA(0.1, 0.1, 0.1, 0.5),
            canAnimate: true
        }),
        new ACheckboxSpec({
            name: "ShowShadow",
            defaultValue: true
        }),
        new AButtonSpec({
            name: 'RunScript',
        }),
        new ASelectionControlSpec({
            name: 'ButtonDestination',
            defaultValue: 'AMomentOfCalm',
            options: [
                'AMomentOfCalm',
                'Blender',
                'ShaderToy',
                'EvolutionOfTrust'
            ]
        })
    ];

    initGUISpecVars(){
        // the parent method will set any defaults we specified in GUISpecs...
        super.initGUISpecVars();

        //let's bind the script we are going to run when the button is pressed.
        this.buttonScript = this.buttonScript.bind(this);
        //and then set the script to run when our button is pressed to this.buttonScript
        this.getModel().setProperty('RunScript', this.buttonScript)
    }


    //##################//--Button And Selection Box--\\##################
    //<editor-fold desc="Button And Selection Box">
    /**
     * This is just a dummy script that we will execute when you press the example button.
     * Our dummy script will open a different website depending on what you have selected in the check box.
     */
    buttonScript(){
        // Let's get this model's checkbox selection from the ButtonDestination property.
        var buttonDestination = this.getModel().getProperty('ButtonDestination');

        // Now we'll run a different script depending on what is selected.
        // In this case we'll just open a different website in a new tab...
        switch(buttonDestination){
            case 'AMomentOfCalm':
                window.open('https://www.youtube.com/watch?v=W6MdfYtZ8rg', "_blank");
                break;
            case 'ShaderToy':
                window.open('https://www.shadertoy.com/', "_blank");
                break;
            case 'Blender':
                window.open('https://www.blender.org/', "_blank");
                break;
            case 'EvolutionOfTrust':
                window.open('https://ncase.me/trust/', "_blank");
                break;
            default:
                console.log("Congrats! You pressed a button!");
                break;
        }
    }
    //</editor-fold>
    //##################\\--Button And Selection Box--//##################



    initGeometry() {

        // We will add our shadow first so it goes in the back
        this.shadow = this.createShapeElement(this.getModel());
        this.addGraphic(this.shadow);
        this.shadow.setAttribute('fill', 'rgba(0,0,0,0.8)');

        super.initGeometry();

    }

    updateViewElements() {
        //We'll use the ShowShadow checkbox to determine whether we should show or hide the shadows
        if(this.getGUIVar('ShowShadow')){
            this.shadow.show();
            this.shadow.setVertices(Matrix3x3.Scale(this.getModel().getProperty('ShadowScale')).applyToPoints(this.getModel().getVertices()));

            //We can get our color here, which will be of type `Color`. To convert it to a css-compatible string, we can use .toRGBAString()
            this.shadow.setAttribute('fill', this.getGUIVar('ShadowColor').toRGBAString());
        }else{
            //If the ShowShadow box isn't checked, we'll hide the shadow
            this.shadow.hide();
        }

        super.updateViewElements();


    }
}
AObject.RegisterClass(AExampleAnimatedView);