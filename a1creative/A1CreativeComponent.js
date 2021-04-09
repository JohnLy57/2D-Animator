/*
 * Copyright (c) 2020. Abe Davis
 */

import A1Model from "../mvc/A1Model";
import A1CreativeView from "./views/A1CreativeView";
import AGraphicsComponent2D from "../../AniGraph/components/AGraphicsComponent2D";
import AController2D from "../../AniGraph/amvc/2d/mvc/AController2D";
import React from "react";
import AComponentController2D from "../../AniGraph/amvc/2d/components/AComponentController2D";
import A1CreativeToolPanel from "./A1CreativeToolPanel";
import A1ShadowView from "./views/A1ShadowView";

import {spiral} from "./A1CreativeExampleScript";
import {chaikin} from "./A1CurveScript";

export default class A1CreativeComponent extends AGraphicsComponent2D{
    static ComponentControllerClass = AComponentController2D;
    static ModelClassMap = {
        'default': {
            controllerClass: AController2D,
            viewClass: A1CreativeView,
            modelClass: A1Model
        }
    }

    constructor(props) {
        super(props);
    }

    saveSVG(){
        this.getGraphicsContext().saveSVG();
    }

    onCreativeScriptButtonClick(){
        this.model.addChild(spiral());
    }

    setCurrentViewMode(value){
        this.setAppState('currentCreativeViewMode', value);
    }

    getCurrentViewMode(){
        return this.getAppState('currentCreativeViewMode');
    }
    initAppState(){
        super.initAppState();
        const self = this;
        this.viewClassesDict = {
            Chaikin_Smooth: A1CreativeView,
            Shadow: A1ShadowView,
        }
        this.setAppState('availableCreativeViewModes',
            Object.keys(this.viewClassesDict)
        );
        this.addAppStateListener('currentCreativeViewMode', function(currentCreativeViewMode){
            self.setViewMode(currentCreativeViewMode);
        })
        this.setAppState('saveCreativeSVG', this.saveSVG);
        this.setAppState('onRunCreativeScriptButtonClick', this.onCreativeScriptButtonClick);

        //##################//--initialize shadow app state--\\##################
        //<editor-fold desc="initialize shadow app state">
        this.setAppState('shadowOpacity', 1);
        //</editor-fold>
        //##################\\--initialize shadow app state--//##################
        this.setAppState('tension', 0.75);
        this.setAppState('smoothness', 1);

    }

    bindMethods() {
        super.bindMethods();
        this.saveSVG = this.saveSVG.bind(this);
        this.onCreativeScriptButtonClick = this.onCreativeScriptButtonClick.bind(this);
        this.setCurrentViewMode = this.setCurrentViewMode.bind(this);
        this.getCurrentViewMode = this.getCurrentViewMode.bind(this);
    }


    setViewMode(viewMode){
        this.componentController.replaceViewClass(this.viewClassesDict[viewMode]);
    }

}