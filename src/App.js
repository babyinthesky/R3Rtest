import React, { Component } from 'react';
import './App.css';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

const ROTATION_SPEED = 0.005;
const r = 30;

class SettingTitle extends Component {
  render(){
    return(
      <div>
        <h3>{this.props.title}</h3>
      </div>
    )
  }
}

class CheckBox extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(){
    this.props.doChange(this.refs.checkbox.checked);
  }
  render(){
    return(
      <div>
        <input className='inlineblock' type='checkbox' ref='checkbox' checked={this.props.checked} onChange={this.handleChange}/>
        <p className="inlineblock">{this.props.label}</p>
      </div>
    )
  }
}

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
      <div>
        <p className='inlineblock'>{this.props.label}</p>
        <div className='inlineblock' style={{width:150}}><input type="range" min="-2000" max="2000" onInput={this.handleInput}
          value={this.state.value} ref='slider'/></div>
        <div className='inlineblock' style={{widht:30}}> <p>{this.state.value}</p></div>
      </div>
    )
  }
}

class Canvas extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cubeRotation: new THREE.Euler(),
      startMoveCamera:false,
      initPageX:0,
      initPageY:0,
      pageX:0,
      pageY:0,
      cameraPosition:new THREE.Vector3(0,-1,r),
      cameraRotation:new THREE.Euler(),
    };

    //this.cameraPosition = new THREE.Vector3(10, 2, 0);
    this.cameraQuaternion = new THREE.Quaternion()
    this.lightTarget = new THREE.Vector3(0, 2, 3);
    this.groundQuaternion = new THREE.Quaternion();

    this.onAnimate = this.onAnimate.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  handleMouseDown(event){
    this.setState({
      startMoveCamera:true,
      initPageX: event.pageX,
      initPageY: event.pageY,
    })
    this.initCameraPosition = new THREE.Vector3();
    this.initCameraPosition.copy(this.state.cameraPosition);
  }
  handleMouseMove(event){
    if(this.state.startMoveCamera){
      let offsetX = event.pageX - this.state.initPageX;
      let offsetY = event.pageY - this.state.initPageY;


      let angle = offsetX / this.props.canvasWidth * Math.PI;
      console.log(angle);
      // let newCameraX = this.state.cameraPosition.x - offsetX;
      // let newCameraY = this.state.cameraPosition.y - offsetY;
      // let sin = offsetX / this.state.cameraPosition.z;
      // let delta = offsetX * sin;
      // let newCameraZ = this.state.cameraPosition.z - delta;
      //let rotationX = offsetX/Math.PI*r;
      //let rotationY = offsetY/Math.PI*r;
      let newCameraX = this.initCameraPosition.x-Math.sin(angle) * r;
      let newCameraZ = this.initCameraPosition.z-(r-Math.cos(angle) * r);
      console.log(newCameraX, newCameraZ);
      this.setState({
        // pageX: event.pageX,
        // pageY: event.pageY,
        cameraPosition: new THREE.Vector3(newCameraX, this.state.cameraPosition.y, newCameraZ),
        //cameraRotation: new THREE.Euler(1, 0),
      })
    }
  }
  handleMouseUp(event){
    this.setState({
      startMoveCamera:false,
    })
  }
  onAnimate(){
    this.setState({
      cubeRotation: new THREE.Euler(
        this.state.cubeRotation.x + this.props.rotationSpeed,
        this.state.cubeRotation.y + this.props.rotationSpeed,
      ),
    });
  }
  render() {

    let lightPos = this.props.lightPos;
    this.lightPosition = new THREE.Vector3(lightPos.x, lightPos.y, lightPos.z);
    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}>
        <React3
          antialias
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={this.props.canvasWidth}
          height={this.props.canvasHeight}
          onAnimate={this.onAnimate}
          shadowMapEnabled
          shadowMapType={THREE.PCFShadowMap}
          clearColor={0x333333}
          ref="camera"
          >

          <scene>
            <perspectiveCamera
              name="camera"
              fov={30}
              aspect={ this.props.canvasWidth / this.props.canvasHeight}
              near={2}
              far={10000}
              position={this.state.cameraPosition}
              quaternion={this.cameraQuaternion}
              rotation={this.state.cameraRotation}
              lookAt={this.lightTarget}/>
            <ambientLight
              color={0x666666}
            />
            <directionalLight
                color={0xffffff}
                intensity={1.5}
                position={this.lightPosition}
                lookAt={this.lightTarget}
                castShadow
                visible
                shadowCameraNear={200}
                shadowCameraFar={10000}
                shadowCameraFov={50}
                shadowBias={-0.00022}
                shadowMapWidth={2048}
                shadowMapHeight={2048}/>
            <mesh
              rotation={this.state.cubeRotation}
              castShadow
              receiveShadow
              position={this.lightTarget}>
              <boxGeometry
                width={2}
                height={2}
                depth={2}/>
              <meshLambertMaterial
                color={0x00ffff}/>
            </mesh>

            <mesh
              castShadow
              receiveShadow
              position = {new THREE.Vector3(0, -2, 0)}
              rotation={new THREE.Euler(-1.2,0)}
            >
              <circleBufferGeometry
                radius={10}
                segments={200}
              />
              <meshPhongMaterial
                color={0x777777}
              />
            </mesh>

          </scene>
        </React3>
      </div>);
  }
}


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      lightPos:{
        x:0,
        y:500,
        z:500,
      },
      canvasWidth:1,
      canvasHeight:1,
      rotationSpeed:ROTATION_SPEED,
    }
    this.setValue = this.setValue.bind(this);
    this.stopRotaion = this.stopRotaion.bind(this);
  }
  setValue(stat,value){
    let lightPos = this.state.lightPos;
    lightPos[stat] = parseInt(value);
    this.setState({
      lightPos
    })
  }
  stopRotaion(value){
    if(value){
      this.setState({
        rotationSpeed:0
      })
    }
    else{
      this.setState({
        rotationSpeed:ROTATION_SPEED
      })
    }

  }
  updateDimensions(){
    this.setState({
      canvasWidth:this.refs.canvas.offsetWidth,
      canvasHeight:this.refs.canvas.offsetHeight,
    })
  }
  componentDidMount(nextProps, nextState){
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    return (
      <div className="App" style={{height:window.innerHeight}}>
        <div style={{width:"80%"}} ref='canvas' >
          <Canvas lightPos={this.state.lightPos} canvasWidth={this.state.canvasWidth}
            canvasHeight={this.state.canvasHeight} rotationSpeed={this.state.rotationSpeed}/>
        </div>
        <div style={{width:"20%", overflow:'visible', paddingLeft:10, backgroundColor:'#dddddd'}}>
          <SettingTitle title='Light Position'/>
          <Slider label={'x'} initVal={this.state.lightPos.x} setValue={this.setValue}/>
          <Slider label={'y'} initVal={this.state.lightPos.y} setValue={this.setValue}/>
          <Slider label={'z'} initVal={this.state.lightPos.z} setValue={this.setValue}/>

          <SettingTitle title='Cubes'/>
          <CheckBox label='Stop rotation' doChange={this.stopRotaion} checked={(this.state.rotationSpeed==0)?true:false}/>

        </div>
      </div>
    );
  }
}

export default App;
