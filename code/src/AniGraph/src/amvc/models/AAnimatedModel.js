import AModel2D from "./AModel2D";
import AObject from "../../aobject/AObject";
import AKeyframeTrack from "../../acomponent/atimeline/AKeyframeTrack";
import Vector from "../../amath/Vector";
import Vec2, {P2D} from "../../amath/Vec2";
import Vec3 from "../../amath/Vec3";
import AKeyframe from "../../acomponent/atimeline/AKeyframe";
import Matrix3x3 from "../../amath/Matrix3x3";
export default class AAnimatedModel extends AModel2D{
    static DEFAULT_TRANSFORM_ANIMATION_TRACKS = ['position', 'scale', 'rotation', 'anchorshift'];

    constructor(args) {
        super(args);
        var keyframeTracks = (args && args.keyframeTracks!==undefined)? args.keyframeTracks : undefined;
        if(keyframeTracks){
            this.setKeyframeTracks(keyframeTracks);
        }
        if(this.getKeyframeTracks()===undefined) {
            this._initEmptyKeyframeTracks();
        }
        this.currentDisplayTime=0;
        this.resetObjectMatrixCache();
    }

    /** Get set objectMatrixCache */
    set objectMatrixCache(value){this._tempState['objectMatrixCache'] = value;}
    get objectMatrixCache(){return this._tempState['objectMatrixCache'];}
    resetObjectMatrixCache(){
        this.objectMatrixCache=new Map();
        // this.objectMatrixCache.set(this.currentDisplayTime, this.matrix);
    }

    /** Get set currentDisplayTime */
    set currentDisplayTime(value){this._currentDisplayTime = value;}
    get currentDisplayTime(){return this._currentDisplayTime;}

    _initEmptyKeyframeTracks(){
        if(this._keyframeTracks!==undefined){
            return;
        }
        this.setKeyframeTracks({});
        var transformkeys = this.constructor.DEFAULT_TRANSFORM_ANIMATION_TRACKS;
        for(let t of transformkeys){
            this.addKeyframeTrack(t);
        }
        // console.log(this.getJSONString());

    }

    afterLoadFromJSON(args) {
        super.afterLoadFromJSON(args);
        for(let t in this.getKeyframeTracks()){
            this.getKeyframeTrack(t).calcHandleProgress();
        }
    }

    /**
     * Call this too add a keyframe track for a named model property
     * @param name
     */
    addKeyframeTrack(name){
        this.setKeyframeTrack(name, new AKeyframeTrack({name: name, title: name}))
    }

    getKeyframeTracks(){
        // return this.getProperty('keyframeTracks');
        return this._keyframeTracks;
    }
    setKeyframeTracks(value){
        // this.setProperty('keyframeTracks', value);
        this._keyframeTracks = value;
        this.notifyPropertySet();
    }
    setKeyframeTrack(name, value){
        var kfts = this.getKeyframeTracks();
        if(kfts===undefined){
            this._initEmptyKeyframeTracks();
        }
        // kfts.set(name, value);
        kfts[name]=value;
        // this.setKeyframeTracks(kfts);
        this.notifyPropertySet();
        this.notifyAnimationTrackChanged({
            track: kfts[name]
        });
    }

    takeAnimationsFrom(other){
        this.setKeyframeTracks(other.getKeyframeTracks());
        other._keyframeTracks = undefined;
        other._initEmptyKeyframeTracks();
        this.setMatrixAndPosition(other.matrix, other.getPosition());
        // if(this.getKeyframeTrack('position') && this.getKeyframeTrack('position').keyframes.length>0){
        //     other.setPosition(new Vec2(0,0));
        // }
        // if(this.getKeyframeTrack('scale') && this.getKeyframeTrack('scale').keyframes.length>0){
        //     other.setScale(new Vec2(1,1));
        // }
        // if(this.getKeyframeTrack('rotation') && this.getKeyframeTrack('rotation').keyframes.length>0){
        //     other.setRotation(0);
        // }
        other.setMatrixAndPosition(Matrix3x3.Identity(), new Vec2(0,0));
        this.notifyListeners({
            type: 'animationDataChange',
        })
        other.notifyListeners({
            type: 'animationDataChange',
        })
    }

    copyAnimationsFrom(other){
        this.setKeyframeTracks(other.copyKeyframeTracks());
    }

    copyKeyframeTracks(){
        return this.getKeyframeTracks();
    }

    notifyAnimationTrackChanged(args){
        this.notifyListeners({
            type: 'animationDataChange',
            args: args
        })
    }

    updateCurrentAnimationTime(t){
        this.currentDisplayTime = t;
        this.isUpdatingTime = true;
        var self = this;
        function setprop(key, value){
            switch(key){
                case 'position':
                    self.setPosition(value);
                    break;
                case 'scale':
                    self.setScale(value);
                    break;
                case 'rotation':
                    self.setRotation(value);
                    break;
                case 'anchorshift':
                    self.setAnchorShift(value);
                    break;

                default:
                    self.setProperty(key, value);
            }
        }
        for(let key of this.getKeyframeTrackNames()){
            var track = this.getKeyframeTrack(key);
            var prevkey = track.getPreviousKeyframeForTime(t);
            if(prevkey) {
                setprop(key, prevkey.getValueForTime(t));
            }else{
                if(track.keyframes.length>0){
                    setprop(key, track.keyframes[0].value);
                }
            }
        }
        this.isUpdatingTime = false;
    }

    getModelPropertyAtTime(key, t){
        var track = this.getKeyframeTrack(key);
        if(track!==undefined){
            var prevkey = track.getPreviousKeyframeForTime(t);
            if(prevkey) {
                return prevkey.getValueForTime(t);
            }else{
                if(track.keyframes.length>0){
                    return track.keyframes[0].value;
                }else{
                    return this.getProperty(key);
                }
            }
        }else{
            return this.getProperty(key);
        }
    }

    getObjectToWorldMatrixAtTime(t){
        if(this.getParent()){
            return this.getParent().getObjectToWorldMatrixAtTime(t).times(this.getMatrixAtTime(t));
            // return this.getParentSpaceMatrix().times(this.matrix);
        }else{
            return this.getMatrixAtTime(t);
            // this.objectMatrixCache.set(t, rval);
            // return rval;
        }
    }


    getActiveKeyframeTrackNames(){
        var rval = [];
        for(t of this.getKeyframeTracks()){
            if(t.nKeyframes>0){
                rval.push(t.name);
            }
        }
        return rval;
    }

    getMatrixAtTime(t){
        if(!this.objectMatrixCache){
            this.resetObjectMatrixCache();
        }
        if(this.objectMatrixCache.has(t)){
            return this.objectMatrixCache.get(t);
        }

        var fromPropsArgs = {};
        for(let propname of Matrix3x3.MATRIX_PROPERTY_NAMES){
            fromPropsArgs[propname]=this.getModelPropertyAtTime(propname, t);
        }
        var rval = Matrix3x3.FromProperties(fromPropsArgs);
        this.objectMatrixCache.set(t, rval);
        return rval;
    }

    getVerticesAtTime(t) {
        if(t===undefined){
            return this.getVertices();
        }else {
            return this.objectVertices ? this.getObjectToWorldMatrixAtTime(t).applyToPoints(this.objectVertices) : undefined;
        }
    }


    setSubtreeCurrentAnimationTime(t){
        this.updateCurrentAnimationTime(t);
        this.mapOverChildren(c=>{
            c.setSubtreeCurrentAnimationTime(t);
        });
    }


    setMatrixProperty(name, value, update=true){
        super.setMatrixProperty(name, value, update);
        if(this.isUpdatingTime){
            return;
        }
        this.resetObjectMatrixCache();
        function _are_equal(a,b){
            if(a===b){
                return true;
            }
            if(a instanceof Vector){
                return a.equalTo(b);
            }
            if(a instanceof Vec2 || a instanceof Vec3 || a instanceof P2D){
                return a.equalTo(b);
            }
            return false;
        }
        const track = this.getKeyframeTrack(name);
        if(track && track.keyframes.length>0){
            var prevkey = track.getPreviousKeyframeForTime(this.currentDisplayTime);
            if(!prevkey){
                prevkey = track.keyframes[0];
            }
            var propval = this.getProperty(name);
            if(!_are_equal(propval, prevkey.value)){
                if(prevkey.time===this.currentDisplayTime){
                    prevkey.value =propval;
                }else {
                    var newkey = new AKeyframe({
                        time: this.currentDisplayTime,
                        value: propval
                    });
                    newkey.tween = new (AKeyframe.TweenClass)({startKey: newkey});
                    track.addKeyframe(newkey, true);
                    track.sortKeyframes();
                    this.notifyAnimationTrackChanged();
                }
            }
        }
    }

    setProperty(name, value, update=true){
        super.setProperty(name, value, update);
        if(this.isUpdatingTime){
            return;
        }
        // this.resetObjectMatrixCache();
        function _are_equal(a,b){
            if(a===b){
                return true;
            }
            if(a instanceof Vector){
                return a.equalTo(b);
            }
            if(a instanceof Vec2 || a instanceof Vec3 || a instanceof P2D){
                return a.equalTo(b);
            }
            return false;
        }
        const track = this.getKeyframeTrack(name);
        if(track && track.keyframes.length>0){
            var prevkey = track.getPreviousKeyframeForTime(this.currentDisplayTime);
            if(!prevkey){
                prevkey = track.keyframes[0];
            }
            var propval = this.getProperty(name);
            if(!_are_equal(propval, prevkey.value)){
                if(prevkey.time===this.currentDisplayTime){
                    prevkey.value =propval;
                }else {
                    var newkey = new AKeyframe({
                        time: this.currentDisplayTime,
                        value: propval
                    });
                    newkey.tween = new (AKeyframe.TweenClass)({startKey: newkey});
                    track.addKeyframe(newkey, true);
                    track.sortKeyframes();
                    this.notifyAnimationTrackChanged();
                }
            }
        }
    }

    removeKeyframeTrack(name){
        delete this.getKeyframeTracks()[name];
        this.notifyAnimationTrackChanged();
    }

    getKeyframeTrack(name){
        return (this.getKeyframeTracks())?this.getKeyframeTracks()[name]:undefined;
    }

    getKeyframeTrackNames(){
        var kfts = this.getKeyframeTracks();
        var tracknames =Array.from(Object.keys(kfts));
        if(kfts) {
            return tracknames;
        }
    }

    // interpolateProperty(){
    //
    // }


    // setProperty(name, value, update=true){
    //     super.setProperty(name, value, update);
    //     var kft = this.getKeyframeTrack(name);
    //     if(kft && kft.nKeyframes>0){
    //
    //
    //
    //     }
    // }
}


//ToDO: turn group into a decorator, or deal with it in some other cleaner way
export class AAnimatedModelGroup extends AAnimatedModel{
    constructor(args){
        super(args);
        var loopTime = (args && args.loopTime!==undefined)? args.loopTime : 10.0;
    }

    /** Get set loopTime */
    set loopTime(value){this.setProperty('loopTime', value);}
    get loopTime(){return this.getProperty('loopTime');}

    /**
     * Convenience accessor to see if a model is an A2ModelGroup. So, `model.isModelGroup` will be
     * true if model is an AModelGroup
     * @return {boolean}
     * */
    get isModelGroup(){return true;}

    getWorldSpaceBBoxCorners() {
        if(!this.getChildrenList().length){
            return;
        }
        return this.getChildTreeWorldSpaceBoundingBox();
    }

    /**
     * Groups cannot have their own vertices. They exist only for manipulating other shapes.
     * It is a grim existence: living only to serve others, trapped in the shadows of a
     * hierarchical system... Take a moment to ponder this. Then, perhaps, have a quick stretch.
     * After that, you should probably get back to work on the assignment. Also, now that we've
     * personified model groups, try not to think too much about how that analogy plays out in
     * the implementation for ungroupChildren(). There is enough darkness in the world today;
     * you don't need some kind of imagined ethical dilemma adding to the madness.
     * @param value
     */
    setVertices(value) {
        return;
    }

    /**
     * ungroupChildren works slightly differently on groups than on regular models,
     * in that we remove the group node after promoting its children to siblings.
     * This ensures that `model.groupChildren().ungroupChildren()` leaves the graph unchanged,
     * and brings the fleeting life of an A2ModelGroup to an abrupt end. Don't think about that
     * last part too hard; in the words of Albert Camus, "to understand the world, one has to
     * turn away from it on occasion."
     * @returns {*}
     */
    ungroupChildren() {
        const parent = this.getParent();
        if(!parent){
            return;
        }
        super.ungroupChildren();
        this.release();
        return parent;
    }
}
AAnimatedModel.GroupClass = AAnimatedModelGroup;

AObject.RegisterClass(AAnimatedModel);
AObject.RegisterClass(AAnimatedModelGroup);