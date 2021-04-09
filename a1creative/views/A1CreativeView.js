/*
 * A1 Creative View: Chaikin Smooth
 * Using this view allows the user to take a model and smooth out its corners
 */

import A1View from "../../mvc/views/A1View";
import Matrix3x3 from "../../math/Matrix3x3";
import {chaikin,smoothPoints} from "../A1CurveScript.js";

export default class A1CreativeView extends A1View{
    constructor(args) {
        super(args);
    }
    /**
     * Initialize the graphics. In this case, our view represents a single shape element.
     *
     */
    initGeometry() {
        const model = this.getModel();
        this.shape = this.createShapeElement(this.getModel());
        this.addGraphic(this.shape);
        this.updateShapes(model);
    }

    /**
     * Update the shapes based on the current state of the model. This will be called every time the model changes.
     * @param model
     */
    updateShapes(model){
        this.shape.setAttributes(model.getAttributes());
        this.shape.setVertices(model.getVertices());
        const tension = model.getProperty('tension');
        const smoothness = model.getProperty('smoothness');
        this.shape.setVertices(chaikin(model, tension, smoothness));
    }

    /**
     * This gets when we think the view might need to be updated.
     * We get the vertices and attributes from the model and update the svg element.
     */
    updateGraphics(){
        //
        const model = this.getModel();
        this.updateShapes(model);
        this.getGraphicsContext().update();
    }
}