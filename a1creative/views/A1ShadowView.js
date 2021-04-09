/*
 * Copyright (c) 2020. Abe Davis
 */

/*
 * Copyright (c) 2020. Abe Davis
 */

import A1View from "../../mvc/views/A1View";
import Matrix3x3 from "../../math/Matrix3x3";
import Vec2 from "../../math/Vec2";
import tinycolor from "tinycolor2";

export default class A1ShadowView extends A1View{
    constructor(args) {
        super(args);
    }

    /**
     * We'll create a small box to represent our light.
     * @param lightSize
     * @returns {Vec2[]}
     */
    getBoxVertices(lightSize){

        return [
            new Vec2(-lightSize, -lightSize),
            new Vec2(lightSize, -lightSize),
            new Vec2(lightSize, lightSize),
            new Vec2(-lightSize, lightSize)
        ]
    }

    /**
     * Initialize the graphics. In this case, our view represents a single shape element.
     *
     */
    initGeometry() {
        // This looks much the same as in the box example
        const m = this.getModel();
        this.shadow = this.createShapeElement(this.getModel());
        this.shape = this.createShapeElement(this.getModel());
        this.light = this.createShapeWithVertices(this.getBoxVertices(10));


        this.addGraphic(this.shadow);
        this.addGraphic(this.shape);
        this.addGraphic(this.light);
        this.updateShapes(m);
    }
    // views rendering
    updateShapes(model){
        this.shape.setAttributes(model.getAttributes());
        this.shape.setVertices(model.getVertices());

        this.shadow.setAttributes(model.getAttributes());
        this.shadow.setAttribute('fill', '#000000');
        this.shadow.setAttribute('stroke', '#000000');

        // Here we get shadowSize from the model to use as a parameter
        const shadowSize = model.getProperty('shadowSize');

        // And here we get shadowOpacity, controlled by a slider in A1CreativeToolPanel, to set the opacity attribute of our svg element
        this.shadow.setAttribute('opacity', this.getComponentAppState('shadowOpacity'))

        // for now we will just translate the shadow a bit to the right...
        // You are welcome to implement the demo I showed as one option for your creative component,
        // but we encourage you to explore other stuff as well!
        const simpleShadowTranslation = Matrix3x3.Translation(new Vec2(shadowSize, 0).times(10));

        // And now we set the vertices to this simple translaiton...
        this.shadow.setVertices(
            simpleShadowTranslation.applyToPoints(this.getModel().getVertices())
        );

        this.light.setAttribute('stroke', '#FFCC00');
        this.light.setAttribute('linewidth', 3);

        // Here is a bit of a hint: this next line of code is exacly the same in the demo I showed...
        this.light.setVertices(Matrix3x3.Translation(model.getOrigin()).applyToPoints(this.getBoxVertices(5)));
    }

    /**
     * This gets when we think the view might need to be updated.
     * We get the vertices and attributes from the model and update the svg element.
     */
    updateGraphics(){
        const model = this.getModel();
        this.updateShapes(model);
        this.getGraphicsContext().update();
    }
}