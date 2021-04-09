import AGUIElementSpec from "./AGUIElementSpec";

export default class ASelectionControlSpec extends AGUIElementSpec{
    constructor(args) {
        super(args);
        this.options = (args && args.options!==undefined)? args.options : [];
    }
    get optionsKey(){
        return this.key+"SelectableOptions";
    }
}