import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

class Slider extends Component {
  constructor(props){
    super(props);
    this.state={
      value:this.props.initVal,
    }
    this.handleInput = this.handleInput.bind(this);
  }
  handleInput(){
    this.setState({value:this.refs.slider.value});
    this.props.setValue(this.props.label,this.refs.slider.value);
  }
  render(){
    return(
      <div id="slidecontainer" >
        <p className='inlineblock'>{this.props.label}</p>
        <div className='inlineblock' style={{width:150}}><input type="range" min="0" max="2000" onInput={this.handleInput}
          value={this.state.value} ref='slider'/></div>
        <div className='inlineblock' style={{widht:30}}> <p>{this.state.value}</p></div>
      </div>
    )
  }
}

class Simple extends React.Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);
    //this.lightPosition = new THREE.Vector3(0, 500, 2000);

    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.005,
          this.state.cubeRotation.y + 0.005,
          0
        ),
      });
    };
  }

  render() {
    const width = 0.8*window.innerWidth; // canvas width
    const height = 0.8*window.innerHeight; // canvas height
    let lightPos = this.props.lightPos;
    this.lightPosition = new THREE.Vector3(lightPos.x, lightPos.y, lightPos.z);
    console.log(this.lightPosition);
    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}
      onAnimate={this._onAnimate}
      shadowMapEnabled
      shadowMapType={THREE.PCFShadowMap}
      clearColor={0x333333}

    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.cameraPosition}
        />
        <ambientLight
            color={0x505050}
          />
        <spotLight
            color={0xffffff}
            intensity={1.5}
            position={this.lightPosition}
            lookAt={this.lightTarget}

            castShadow
            shadowCameraNear={200}
            shadowCameraFar={10000}
            shadowCameraFov={50}

            shadowBias={-0.00022}

            shadowMapWidth={2048}
            shadowMapHeight={2048}
          />
        <mesh
          rotation={this.state.cubeRotation}
          castShadow
          receiveShadow
          position={new THREE.Vector3(0, 0, 0)}
        >
          <boxGeometry
            width={2}
            height={2}
            depth={2}
          />
          <meshLambertMaterial
            color={0x00ffff}
          />
        </mesh>


      </scene>

    </React3>);
  }
}


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      lightPos:{
        x:500,
        y:500,
        z:500,
      }
    }
    this.setValue = this.setValue.bind(this);
  }
  setValue(stat,value){
    let lightPos = this.state.lightPos;
    lightPos[stat] = parseInt(value);
    this.setState({
      lightPos
    })
    console.log(lightPos);
  }
  render() {
    return (
      <div className="App">

        <Simple lightPos={this.state.lightPos}/>
        <Slider label={'x'} initVal={this.state.lightPos.x} setValue={this.setValue}/>
        <Slider label={'y'} initVal={this.state.lightPos.y} setValue={this.setValue}/>
        <Slider label={'z'} initVal={this.state.lightPos.z} setValue={this.setValue}/>
      </div>
    );
  }
}

export default App;
