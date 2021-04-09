/*
 * Copyright (c) 2020. Abe Davis
 */

import React from "react"
import AGUIComponent from "../../AniGraph/components/GUIComponents/AGUIComponent";
import {Toggle} from "rsuite";
import {Uploader} from "rsuite";
import {Slider} from "rsuite";
import ASelectPicker from "../../AniGraph/components/GUIComponents/ASelectPicker";


export default class A1CreativeToolPanel extends AGUIComponent{

    constructor(props){
        super(props);
    }

    /**
     * See how this is set in A1CreativeComponent
     */
    saveSVG(){
        this.getAppState('saveCreativeSVG')();
    }


    //##################//--App State--\\##################
    //<editor-fold desc="App State">

    getSelectedModel(){
        return this.getAppState('selectedModel');
    }

    setCurrentCreativeViewMode(value){
        this.setAppState('currentCreativeViewMode', value);
    }

    getCurrentCreativeViewMode(){
        return this.getAppState('currentCreativeViewMode');
    }

    onRunScriptButtonClick(){
        this.getAppState('onRunCreativeScriptButtonClick')();
    }

    /**
     * Demonstrates how to set app state (global / not specific to model)
     * @param value
     */
    setShadowOpacity(value){
        this.setAppState('shadowOpacity', value);
        this.model.notifyChildren();
    }

    /**
     * Demonstrates how to set a model property
     * @param value
     */
    setShadowSize(value){
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            selectedModel.setProperty('shadowSize', value);
        }
    }

    /**
     * Set's model property for tension under the Chaikin View
     * @param value
     */
    setTension(value){
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            selectedModel.setProperty('tension', value);
        }
    }

    /**
     * Set's model property for smoothness under the Chaikin View
     * @param value
     */
    setSmoothness(value){
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            selectedModel.setProperty('smoothness', value);
        }
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.addAppStateListener('availableCreativeViewModes', function(availableCreativeViewModes){
            self.setState({creativeViewModeDataItems: self._getCreativeViewModeDataItems(availableCreativeViewModes)});
        });

        this.addAppStateListener('selectedModel', function(selectedModel){
            self.setState({selectedModel: selectedModel});
            if(selectedModel) {
                self.setState({shadowSize: selectedModel.getProperty('shadowSize')});
                self.setState({tension: selectedModel.getProperty('tension')});
                self.setState({smoothness: selectedModel.getProperty('smoothness')});
            }
        });

        // Here we will add a listener to update the React component's state whenever shadowSize changes
        this.addAppStateListener('shadowOpacity', function(value){
            self.setState({shadowOpacity: value});
        });
    }


    //</editor-fold>
    //##################\\--App State--//##################



    _getCreativeViewModeDataItems(modes){
        if(!modes){
            return [];
        }
        const rval = [];
        if(Array.isArray(modes)){
            for(let m of modes){
                rval.push({value: m, label:m});
            }
        }else{
            for(let m in modes){
                rval.push({value: m, label:m});
            }
        }
        return rval;
    }

    bindMethods() {
        super.bindMethods();
        this.setCurrentCreativeViewMode = this.setCurrentCreativeViewMode.bind(this);
        this.getCurrentCreativeViewMode = this.getCurrentCreativeViewMode.bind(this);
        this.getSelectedModel = this.getSelectedModel.bind(this);
        this.onRunScriptButtonClick = this.onRunScriptButtonClick.bind(this);
        this.saveSVG = this.saveSVG.bind(this);
        this.setShadowSize = this.setShadowSize.bind(this);
        this.setShadowOpacity = this.setShadowOpacity.bind(this);
        this.setTension = this.setTension.bind(this);
        this.setSmoothness = this.setSmoothness.bind(this);
    }
    render(){

        const uploaderStyles = {
            lineHeight: '15px'
        }

        return (
            <div className={"row shape-tools-stage"} key={"row" +this.constructor.name}>
                {/*<div className={""} key={"col" + this.constructor.name}>*/}
                <div className={"container atoolpanel"}>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onRunScriptButtonClick}>
                                RunScript
                            </button>
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            Shadow:
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            ShadowSize
                            <Slider
                                onChange={this.setShadowSize}
                                value={this.state.shadowSize}
                                min={1}
                                max={5}
                                step={0.05}
                            />
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            ShadowOpacity
                            <Slider
                                onChange={this.setShadowOpacity}
                                value={this.state.shadowOpacity}
                                min={0}
                                max={1}
                                step={0.01}
                            />
                        </div>
                    </div>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick={this.saveSVG}>SaveSVG</button>
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            Chaikin Smooth:
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            Tension
                            <Slider
                                onChange={this.setTension}
                                value={this.state.tension}
                                min={0}
                                max={1}
                                step={0.01}
                            />
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            Smoothness
                            <Slider
                                onChange={this.setSmoothness}
                                value={this.state.smoothness}
                                min={0}
                                max={5}
                                step={1}
                            />
                        </div>
                    </div>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            <ASelectPicker
                                placeholder={"ViewMode"}
                                onChange={this.setCurrentCreativeViewMode}
                                data={this.state.creativeViewModeDataItems}
                                value={this.getCurrentCreativeViewMode()}
                                defaultValue={this.getCurrentCreativeViewMode()}
                            />
                        </div>
                    </div>

                    {this.props.children}
                </div>
                {/*</div>*/}
            </div>
        )
    }
}