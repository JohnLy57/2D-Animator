import AObject from "../../../aobject/AObject";


export default class AGUIElementSpec extends AObject{
    constructor(args) {
        super(args);

        // The label is what will display in the control window
        this.label = args && args.label? args.label : this.name;

        // The key is what you will use to reference the corresponding property,
        // either in AppState or using model.getProperty(guispec.key).
        this.key = args && args.key? args.key : this.name;

        // set canAnimate to true if you want the property to be keyframe-able.
        this.canAnimate = args && args.canAnimate? args.canAnimate: undefined;

        this.type=args && args.type? args.type : undefined;
        this.defaultValue = args && (args.defaultValue!==undefined)? args.defaultValue : undefined;

    }
}
