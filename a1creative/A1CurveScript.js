/*
 *  Math for creating curves for creative portion of A1
 */

import A1Model from "../mvc/A1Model";
import Vec2 from "../math/Vec2";

/**
 *  Function for creating smoothing curves using a method called corner cutting.
 *  Reference: http://www.cs.unc.edu/~dm/UNC/COMP258/LECTURES/Chaikins-Algorithm.pdf
 *  @param model Base A1Model used to create smoother shape
 *  @param tension Number determining curve bias. Smoothening occurs between 0.5 and 1.
 *  @param smoothness Number representing the number of iterations being applied. Default set to 0 (Off).
 *  @returns returns pointList the same as before or with modifications (in world space)
 */
export function chaikin(model, tension=0.75, smoothness=0){
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
            smoothedPoints = smoothPoints(smoothedPoints, tension);
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
export function smoothPoints(pointList=[], tension=0.75){
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