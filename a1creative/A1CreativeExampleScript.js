/*
 * Copyright (c) 2020. Abe Davis
 */

import A1Model from "../mvc/A1Model";
import Vec2 from "../math/Vec2";

export function spiral(nVerts=50,nRotations=3, radius=200, center){
    const newModel = new A1Model();
    const verts=[];
    if(!center){
        center=new Vec2(250,250);
    }
    var theta=0;
    const nVertsOut = Math.floor(nVerts*0.5);
    for(let i=0;i<nVertsOut;i++){
        theta=(i*nRotations*2*Math.PI)/nVertsOut;
        verts.push(new Vec2(Math.cos(theta), Math.sin(theta)).times((i*radius)/nVertsOut).plus(center))
    }

    const innerRadius = radius*(nRotations-0.5)/nRotations;

    for(let i=nVertsOut;i>0;i--){
        theta=(i*nRotations*2*Math.PI)/nVertsOut;
        verts.push(new Vec2(Math.cos(theta), Math.sin(theta)).times((i*innerRadius)/nVertsOut).plus(center))
    }

    newModel.setVertices(verts);

    // renormalize!
    newModel.renormalizeVertices(true);
    return newModel;
}