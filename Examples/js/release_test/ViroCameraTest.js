/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  ViroSceneNavigator,
  ViroScene,
  ViroBox,
  ViroMaterials,
  ViroNode,
  ViroOrbitCamera,
  ViroCamera,
  ViroAmbientLight,
  ViroOmniLight,
  ViroSpotLight,
  ViroDirectionalLight,
  ViroImage,
  ViroVideo,
  Viro360Image,
  Viro360Video,
  ViroFlexView,
  ViroUtils,
  ViroText,
  ViroAnimations,
  ViroAnimatedComponent,
  ViroSurface,
  ViroSkyBox,
  ViroSphere,
  Viro3DObject,
} from 'react-viro';

let polarToCartesian = ViroUtils.polarToCartesian;
var createReactClass = require('create-react-class');

// **This test has not been done.  This is placeholder for scene and navigation arrows**

var ReleaseMenu = require("./ReleaseMenu.js");

var ViroCameraTest = createReactClass({

  getInitialState() {
    return {
        mainCameraPositionX: 0,
        mainCameraRotation:0,
        activeCamera:1,
        cameraOrienationString:"",
        fov: 60
    };
  },

  render: function() {
    return (
     <ViroScene onClick={this._toggleCamera} ref="cameraScene">
     <ReleaseMenu sceneNavigator={this.props.sceneNavigator}/>

     <ViroOmniLight position={[0, 0, 0]} color="#ffffff" attenuationStartDistance={40} attenuationEndDistance={50}/>

     <ViroImage source={require('./res/poi_dot.png')} position={[-1, 0, 0]} transformBehaviors={["billboard"]} onClick={this._showNext} />

     <ViroCamera
         fieldOfView={this.state.fov}
         position={[0,0,0]}
         active={this.state.activeCamera == 3}
         animation={{name:"testLoopMove",
                     loop:true,
                     run:this.state.activeCamera == 3,
                     onStart:this._onStart,
                     onFinish:this._onFinish}}/>


     <ViroCamera
      position={[this.state.mainCameraPositionX,0,0]}
      rotation={[0,this.state.mainCameraRotation,0]}
      fieldOfView={this.state.fov}
      active={this.state.activeCamera == 1} />

     <ViroOrbitCamera
        fieldOfView={this.state.fov}
        position={[0,0,0]}
        active={this.state.activeCamera == 2}
        focalPoint={[1, 1, -4]}/>

     <ViroBox
        position={[1, 1, -4]}
        scale={[0.8 , 0.8 , 0.8]}
        materials={["redColor"]}
        height={1}
        width={1}
        length={1} />

        <ViroText style={styles.centeredText} position={[-2, -1, -4]} text={"ToggleCamera type: " + this.state.activeCamera}
                width={2} height ={2}  onClick={this._toggleCamera} />

        <ViroText style={styles.centeredText} position={[0, -1, -4]} text={"Toggle Camera Type 1 positionX: " + this.state.mainCameraPositionX}
                width={1.5} height ={2}  onClick={this._toggleCameraPosiion} />

        <ViroText style={styles.centeredText} position={[2, -1, -4]} text={"Toggle Camera Type 1 rotationY: " + this.state.mainCameraRotation}
                width={1.5} height ={2}  onClick={this._toggleCameraRotation} />

        <ViroText style={styles.centeredText} position={[0, -2.5, -4]} text={"Get Camera Orientation Async: " + this.state.cameraOrienationString}
                width={4} height ={4}  onClick={this._getCameraOrientationAsync} />

        <ViroText style={styles.centeredText} position={[0, -3.5, -4]} text={"Toggle Fov on Camera: " + this.state.fov}
                width={4} height ={4}  onClick={this._toggleFov} />
     </ViroScene>

    );
  },

  _onStart(){
    console.log("Animation Camera onStart();");
  },
  _onFinish(){
    console.log("Animation Camera onFinish();");
  },

  _getCameraOrientationAsync(){
    this.refs["cameraScene"].getCameraOrientationAsync().then((orientation) => {
      var cameraOrienationStr = "Position: " + orientation.position[0] + "," + orientation.position[1] + "," + orientation.position[2] + "\n";
      cameraOrienationStr = cameraOrienationStr + "Rotation: " + orientation.rotation[0] + "," + orientation.rotation[1] + "," + orientation.rotation[2];
      this.setState({
        cameraOrienationString:cameraOrienationStr
      });
    });
  },

  _showNext() {
    this.props.sceneNavigator.replace({scene:require('./SceneTest1')});
  },

  _toggleCamera(){
  console.log("Daniel _toggleCamera");
        var newCamera = this.state.activeCamera + 1;
        if (newCamera > 3){
            newCamera = 1;
        }

         this.setState({
                activeCamera:newCamera
               });
  },

  _toggleCameraPosiion(){console.log("Daniel _toggleCameraOnePoistion");
        var newCameraX = this.state.mainCameraPositionX + 0.5;
        if (newCameraX > 3){
            newCameraX = 1;
        }

         this.setState({
                mainCameraPositionX:newCameraX
               });
  },

  _toggleCameraRotation(){console.log("Daniel _toggleCameraOneRotation");
        var newCameraRot = this.state.mainCameraRotation + 10;
        if (newCameraRot > 360){
            newCameraRot = 0;
        }

         this.setState({
                mainCameraRotation:newCameraRot
               });
  },
  _toggleFov(){
    var newFov = this.state.fov + 10;
    if (newFov > 120){
        newFov = 60;
    }

    this.setState({
        fov:newFov
    });
  }


});


var styles = StyleSheet.create({
  centeredText: {
      fontFamily: 'Arial',
      fontSize: 25,
      color: '#ffffff',
      textAlignVertical: 'center',
      textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  redColor: {
  fresnelExponent: .5,
   shininess: 2.0,
    diffuseColor: "#ff0000"
  },
  blue: {
      shininess: 2.0,
      lightingModel: "Lambert",
      diffuseColor: "#0000ff"
    },
  heart: {
      lightingModel: "Phong",
      diffuseTexture: require('../res/heart_d.jpg'),
    },
 });



ViroAnimations.registerAnimations({
    moveRight:{properties:{positionX:"+=2"}, duration: 2000, easing:"Linear"},
    moveLeft:{properties:{positionX:"-=2"}, duration: 2000, easing:"Linear"},
    testLoopMove:[
        ["moveRight", "moveLeft"]
    ],

});


module.exports = ViroCameraTest;
