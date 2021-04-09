import tinycolor from "tinycolor2";
import Vector from "./Vector";
import {hslToRgb} from "tinycolor2"

export default class Color extends Vector{
    static Random(randomAlpha=false){
        if(randomAlpha) {
            return new Color(Math.random(), Math.random(), Math.random(), Math.Random());
        }else{
            return new Color(Math.random(), Math.random(), Math.random(), 1);
        }
    }

    constructor(r,g,b,a=1){
        if(r===undefined){
            super([0,0,0,1]);
        }else if(Array.isArray(r)){
            console.assert(g===undefined, {inputs: [r,g,b,a], errorMsg: "problem with Color inputs"});
            if(r.length===3){
                super([r[0],r[1],r[2], 1]);
            }else if(r.length===4){
                super(r);
            }else {
                throw Error(`cannot create Color with array ${x} of length ${x.length}`);
            }
        }else if(r.elements!==undefined) {
            if(r.elements.length===3) {
                super([r.elements[0], r.elements[1], r.elements[2], 1]);
            }else {
                super(r.elements);
            }
        }else{
            super([r,g,b,a]);
        }
    }

    /** Get set r */
    set r(value){this.elements[0] = value;}
    get r(){return this.elements[0];}

    /** Get set g */
    set g(value){this.elements[1] = value;}
    get g(){return this.elements[1];}

    /** Get set b */
    set b(value){this.elements[2] = value;}
    get b(){return this.elements[2];}

    /** Get set a */
    set a(value){this.elements[3] = value;}
    get a(){return this.elements[3];}

    toHexString(){
        return this._tinycolor().toHexString();
    }


    static FromHSVA(h,s,v,a=1){
        var rgbob = tinycolor(`hsv(${parseInt(h*100)}%, ${parseInt(s*100)}%, ${parseInt(v*100)}%)`).toRgb();
        return new Color(rgbob.r, rgbob.g, rgbob.b, a);
    }

    static FromString(string){
        var tcolor = tinycolor(string).toRgb();
        return new Color(tcolor.r, tcolor.g, tcolor.b, tcolor.a);
    }

    _tinycolor(){
        return tinycolor({
            r:parseInt(this.r * 255),
            g:parseInt(this.g * 255),
            b:parseInt(this.b * 255),
            a:this.a
        });
    }

    toRGBAString(){
        return this._tinycolor().toRgbString();
    }

}

export function RGBA(r,g,b,a){
    return new Color(r,g,b,a);
}