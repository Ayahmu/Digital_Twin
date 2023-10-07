import './style.css';
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data1 from '../public/json/HydrogenSysInfo.json' assert {type: 'JSON'}
import data2 from '../public/json/pipe.json' assert {type: 'JSON'}
import {camera_config} from './config.js';
import {getJson,getPipeJson} from "./connect.js";
import {home_btn} from './ui.js';

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//将canvas添加到body中
document.body.appendChild(canvas);

export let objectArray;
export let pipeArray;
let idToDoor = {};
idToDoor["Mesh.2971"] = 0;
idToDoor["Mesh.1898"] = 1;
idToDoor["Mesh.633"] = 2;
//读取json数据
function MyObject(ID, Name, Info, Manual, Url, LocID, Animation) {
    this.ID = ID;
    this.Name = Name;
    this.Info = Info;
    this.Manual = Manual;
    this.Url = Url;
    this.LocID = LocID;
    this.Animation = Animation;
}


// 创建对象实例并存储在数组中
objectArray = data1.map(jsonObject => new MyObject(
    jsonObject.ID,
    jsonObject.Name,
    jsonObject.Info,
    jsonObject.Manual,
    jsonObject.Url,
    jsonObject.LocID,
    jsonObject.Animation
));
pipeArray = data2.map(jsonObject => new MyObject(
    jsonObject.ID,
    jsonObject.Name,
    jsonObject.Info,
    jsonObject.Manual,
    jsonObject.Url,
    jsonObject.LocID,
    jsonObject.Animation
));


// 创建一个哈希表，将 ID 映射到数组索引
export const idToIndexMap1 = {};
export const idToIndexMap2 = {};

// 填充哈希表
objectArray.forEach((obj, index) => {
    idToIndexMap1[obj.ID] = index;
});
pipeArray.forEach((obj, index) => {
    idToIndexMap2[obj.ID] = index;
});

// 要查找的特定 ID
const targetID = "10QM001"; // 例如，查找 ID 为 "10QM001" 的对象

// 使用哈希表查找特定 ID 对应的数组索引
let targetIndex = idToIndexMap1[targetID];

console.log("10QM001", objectArray[targetIndex]);

//创建引擎，第二个参数为抗锯齿
const engine = new BABYLON.Engine(canvas,true,{stencil:true});


//创建场景
const scene = new BABYLON.Scene(engine,false);
// const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("texture/hdr/environment.env", scene);
let hdrTexture = new BABYLON.HDRCubeTexture("texture/hdr/env3.hdr", scene, 1024);
scene.environmentTexture = hdrTexture;
scene.createDefaultSkybox(hdrTexture, true);
scene.environmentIntensity = 0.4;

let initTarget = new BABYLON.Vector3(-37.95875211948178, 73.00066611807962, 64.42490800253104); // 相机目标点
let initPos = new BABYLON.Vector3(-37.99717668174966, 86.58864238456036, 333.38193590224483);

// 创建相机
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,                // 相机水平旋转角度
    0,                // 相机垂直旋转角度
    10,               // 相机旋转半径
    new BABYLON.Vector3(-37.95875211948178, 73.00066611807962, 64.42490800253104), // 相机目标点
    scene             // 相机所在场景
);
// 设置相机的灵敏度
camera.panningSensibility = camera_config.camera_panningSensibility; // 增加平移灵敏度
camera.wheelPrecision = 1 / camera_config.camera_wheelPrecision;
camera.inertia = 0; //设置为0以禁用移动和旋转的惯性

camera.position = new BABYLON.Vector3(-37.99717668174966, 86.58864238456036, 333.38193590224483
);

//将相机附加到画布上,
camera.attachControl(canvas);


//创建高亮层
let highLightLayer = new BABYLON.HighlightLayer('highLightLayer',scene,{camera:camera});

//添加鼠标监听事件
const actionManager = new BABYLON.ActionManager(scene);


let childMesh = [];

//模型数组
let models = []

actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,//鼠标悬停触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    removeLabel(rmLabelBuild);
                    highLight(event.meshUnderPointer,event.meshUnderPointer.id);
                    console.log(event.meshUnderPointer.id)
                    createLabel(event);
                    break;
            }
        }
    )
)

actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger, //鼠标移走触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    removeLabel(rmLabelBuild);
                    break;
            }
        }
    )
);

actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger, //鼠标单击触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    displayLabel(event);
                    let pickInfo = scene.pick(scene.pointerX, scene.pointerY);

                    if (pickInfo.hit) {
                        // 鼠标点击位置的世界坐标
                        clickPos = pickInfo.pickedPoint;
                        console.log("鼠标点击位置的世界坐标:", clickPos);
                        console.log("点击模型世界坐标:", event.meshUnderPointer.position)
                    }
                    break;
            }
        }
    )
);

function displayLabel(event){
    let rightLabel = document.getElementById("rightLabel");

    let modelNameElm = document.getElementById("modelName");
    modelNameElm.innerHTML = getJson(event.meshUnderPointer.id,'Name');

    let modelInfoElm = document.getElementById("modelInfo");
    modelInfoElm.innerHTML = getJson(event.meshUnderPointer.id,"Info");

    if(!rightLabel.style.display){
        rightLabel.style.display = "block";
    }
    rightLabel.classList.remove("right-slide-out");
    rightLabel.classList.add("right-slide-in");

}

let rmLabelBuild = []

function createLabel(event){
    let label = new GUI.Rectangle();
    label.background = "rgba(0, 0, 0, 1)";
    label.height = "60px";
    label.alpha = 0.6;
    label.width = "200px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    advancedTexture.addControl(label);
    label.linkWithMesh(event.meshUnderPointer);
    let text1 = new GUI.TextBlock();
    text1.text = getJson(event.meshUnderPointer.id,"Name");
    text1.color = "white";
    label.addControl(text1);
    rmLabelBuild.push(label);
    rmLabelBuild.push(text1);
}

// function createWarningLabel(modelID,model){
//     for(let label of rmLabelBuild){
//         if(label.name === modelID){
//             return;
//         }
//     }
//     let label = new GUI.Rectangle(modelID);
//     label.background = "rgba(0, 0, 0, 1)";
//     label.alpha = 0.6;
//     label.cornerRadius = 20;
//     label.thickness = 1;
//     label.linkOffsetY = -100;
//     label.width = "500px";
//     label.height = "300px";
//     advancedTexture.addControl(label);
//     label.linkWithMesh(model);
//     let text1 = new GUI.TextBlock();
//     text1.text = "报警信息名称:"+getJson(modelID,"Name")  +"\n"+ "报警信息报警信息报警信息报警信息报警信息报警信息";
//     text1.color = "white";
//     label.addControl(text1);
//
//     rmLabelBuild.push(label);
//     rmLabelBuild.push(text1);
// }

let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.renderScale = 1;

let selectMesh, selectName;
let clickPos;
function highLight(mesh, labelName) {

    selectMesh = mesh;
    selectName = labelName;
    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    models.push(mesh);
}

let targetPosCamera, targetPosMesh;
targetPosCamera = new BABYLON.Vector3(-100,-100,-100);
targetPosMesh= new BABYLON.Vector3(-100,-105,-100);


home_btn.addEventListener('click', function(){

    camera.rotation = new BABYLON.Vector3(0, 0, 0);

    camera.position = initPos;
    camera.setTarget(initTarget);

    console.log("Camera reset");
});


// play_btn.addEventListener('click', function(){
//     console.log(camera.position);
//     console.log(camera.rotation);
//     console.log(camera.target);
//     if(selectMesh==null)
//         console.log("no mesh");
//     else
//     {
//         let animation = getJson(selectName, "Animation");
//         playAnimation(animation);
//     }
//
// })

// info_btn.addEventListener('click', function (){
//     getPDF(selectName);
// });

function removeLabel(arr) {
    //清除面板
    for (let i = 0; i < arr.length; i++) {
        arr[i].dispose();
    }
    //清除高光
    models.forEach((mesh)=>{
        highLightLayer.removeMesh(mesh);
    })
    models = [];
    rmLabelBuild = [];
}
function changematerial(){
        // 管道透明
        //氢气管道
        let pipe1=scene.getMeshById("Brep.044");
        let pipe2=scene.getMeshById("Brep.008");
        let hydrogenmaterial = new BABYLON.PBRMaterial("hydrogenmaterial", scene) //创建pbr 氢气管道材料
        hydrogenmaterial.albedoColor=new BABYLON.Color3.Green(); // 反射颜色
        hydrogenmaterial.metallic=1 // 金属
        hydrogenmaterial.roughness=0.5 // 粗糙
        hydrogenmaterial.alpha=0.3;
        pipe1.material = hydrogenmaterial;
        pipe2.material = hydrogenmaterial;
        //二氧化碳管道
        let pipe3=scene.getMeshById("Brep.007")
        let pipe4=scene.getMeshById("Brep.010")
        let carbonmaterial= new BABYLON.PBRMaterial("carbonmaterial", scene) //创建pbr 二氧化碳管道材料
        carbonmaterial.albedoColor=new BABYLON.Color3.Purple(); // 反射颜色
        carbonmaterial.metallic=0.5 // 金属
        carbonmaterial.roughness=0.5 // 粗糙
        carbonmaterial.alpha=0.3;
        pipe3.material = carbonmaterial;
        pipe4.material = carbonmaterial;
        //水管道
        let pipe5=scene.getMeshById("Brep.041")
        let pipe6=scene.getMeshById("Brep.042")
        let watermaterial= new BABYLON.PBRMaterial("watermaterial", scene) //创建pbr 二氧化碳管道材料
        watermaterial.albedoColor=new BABYLON.Color3.Blue(); // 反射颜色
        watermaterial.metallic=0.5 // 金属
        watermaterial.roughness=0.5 // 粗糙
        watermaterial.alpha=0.3;
        pipe5.material = watermaterial;
        pipe6.material = watermaterial;
        //隔板材质
        let clapboard1=scene.getMeshById("Brep");
        let clapboard2=scene.getMeshById("Brep.091");
        let clapboard3=scene.getMeshById("Brep.092");
        let myclapboardMaterial=new BABYLON.PBRMaterial("myclapboardMaterial", scene)
        myclapboardMaterial.albedoColor=new BABYLON.Color3.White(); // 反射颜色
        myclapboardMaterial.metallic=0.2 // 金属
        myclapboardMaterial.roughness=0.8 // 粗糙
        myclapboardMaterial.alpha=1;
        clapboard1.material = myclapboardMaterial;
        clapboard2.material = myclapboardMaterial;
        clapboard3.material = myclapboardMaterial;
}
//flowing流动方案-粒子效果
let countnum=1;
function makeparticle(mesh,particleSystem,color1,color2,colorDead){
    countnum++;
    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("/texture/flare.png", scene);
    // Where the particles come from
    particleSystem.emitter = mesh;//设置emitter发射器
    // Colors of all particles
    particleSystem.color1 = color1;
    particleSystem.color2 = color2;
    particleSystem.colorDead = colorDead;
    // Size of each particle (random between...
    particleSystem.minSize = 0.3;
    particleSystem.maxSize = 0.5;
    // Life time of each particle (random between...
    particleSystem.minLifeTime = 1.5;
    particleSystem.maxLifeTime = 2.0;
    particleSystem.minEmitBox = new BABYLON.Vector3(0.08, 0.08, 0.08); //控制盒子
    particleSystem.maxEmitBox = new BABYLON.Vector3(-0.08, -0.08, -0.08);
    // Emission rate
    particleSystem.emitRate = 1000;
    // Speed
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.3;
    particleSystem.updateSpeed = 0.005;
}
const slide = function (dist,movdirection) { //after covering dist apply turn
    this.dist = dist;
    this.movdirection=movdirection;//正在沿movaxis移动
}
function moveparticle(track,mesh,x,y,z,time){
    setTimeout(function(){
        let distance = 0;
        let step = 1;
        let p = 0;
        scene.onBeforeRenderObservable.add(() => {
            if(track[p].movdirection==="left"){
                mesh.movePOV(-step, 0, 0);
            }
            if(track[p].movdirection==="right"){
                mesh.movePOV(step, 0, 0);
            }
            if(track[p].movdirection==="up"){
                mesh.movePOV(0, step, 0);
            }
            if(track[p].movdirection==="down"){
                mesh.movePOV(0, -step, 0);
            }
            if(track[p].movdirection==="front"){
                mesh.movePOV(0, 0, step);
            }
            if(track[p].movdirection==="behind"){
                mesh.movePOV(0, 0, -step);
            }

            distance += step;
            if (distance > track[p].dist) {        
                // sphere.rotate(track044[p].rotaxis, track044[p].turn, BABYLON.Space.LOCAL);
                // particleSystem.gravity = track044[p].gravity;
                p +=1;
                p %= track.length;
                if (p === 0) {
                    distance = 0;
                    mesh.position = new BABYLON.Vector3(x, y, z); //reset to initial conditions
                    // sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
                }
            }
        });
    },time);
    
}
//发射器们：
let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:0.01, segments: 8}, scene);
// sphere.material = new BABYLON.StandardMaterial("mat", scene);
// sphere.material.wireframe = true;
sphere.position=new BABYLON.Vector3(51, 25, 91);
let sphere004cl1=sphere.clone("sphere004cl1");
sphere004cl1.position=new BABYLON.Vector3(51, 25, 91);
let sphere008=sphere.clone("sphere008");
sphere008.position=new BABYLON.Vector3(3.5, 27.8, 71.8);
let sphere008cl1=sphere008.clone("sphere008cl1");
let sphere049=sphere.clone("sphere008");
sphere049.position=new BABYLON.Vector3(-8, 9.57, 79.6);
let sphere049cl1=sphere049.clone("sphere049cl1");
let sphere053=sphere.clone("sphere053");
sphere053.position=new BABYLON.Vector3(25.3, 27.6, 61.4);
var sphere053cl1=sphere053.clone("sphere053cl1");
var sphere053cl2=sphere053.clone("sphere053cl2");
var sphere053cl3=sphere053.clone("sphere053cl3");
var sphere041=sphere.clone("sphere041");
sphere041.position=new BABYLON.Vector3(-71.05, 25.64, 35.54);
var sphere041cl1=sphere041.clone("sphere041cl1");
var sphere041cl2=sphere041.clone("sphere041cl2");
var sphere041cl3=sphere041.clone("sphere041cl3");
var sphere042=sphere.clone("sphere042");
sphere042.position=new BABYLON.Vector3(-81,161.5,41.4);
var sphere042cl1=sphere042.clone("sphere042cl1");
var sphere042cl2=sphere042.clone("sphere042cl2");
var sphere042cl3=sphere042.clone("sphere042cl3");

// let sphere053cl6=sphere053.clone("sphere053cl6");


const track044 = [];//管道Brep.044的轨迹
track044.push(new slide(5.8,"up"));  //first side length 6
track044.push(new slide(5.8+1,"front")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5,"right")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5+28,"front")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5+28+6,"right")); //at finish of second side distance covered is 18+9
track044.push(new slide(5.8+1+14.5+28+6+3.3,"down")); //最后一条
//all sides cover


//创建一个绿色的粒子系统
let particleSystem1=new BABYLON.ParticleSystem("particles1",10000,scene);//自动给每个粒子系统编号
makeparticle(sphere,particleSystem1,
    new BABYLON.Color4(0.04, 0.63, 0.02),
    new BABYLON.Color4(0.14, 0.74, 0.09),
    new BABYLON.Color4(0.13, 0.55, 0.13, 0.8));
moveparticle(track044,sphere,51, 25, 91, 0);

let particleSystem2=new BABYLON.ParticleSystem("particles2",10000,scene);//自动给每个粒子系统编号
//创建一个绿色的粒子系统
makeparticle(sphere004cl1,particleSystem2,
    new BABYLON.Color4(0.04, 0.63, 0.02),
    new BABYLON.Color4(0.14, 0.74, 0.09),
    new BABYLON.Color4(0.13, 0.55, 0.13, 0.8));
moveparticle(track044,sphere004cl1,51, 25, 91,7500);//间隔时间

const track008 = [];//管道Brep.008的轨迹
track008.push(new slide(3.4,"up"));  //first side length 6
track008.push(new slide(3.4+16.5,"behind")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2,"down")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2+27.1,"left")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2+27.1+18.3,"front")); //at finish of second side distance covered is 18+9
track008.push(new slide(3.4+16.5+0.2+27.1+18.3+3.5,"down")); //最后一条共70.3

let particleSystem3=new BABYLON.ParticleSystem(`particles3`,10000,scene);//自动给每个粒子系统编号
let particleSystem4=new BABYLON.ParticleSystem(`particles4`,10000,scene);//自动给每个粒子系统编号
//创建一个绿色的粒子系统
makeparticle(sphere008,particleSystem3,
    new BABYLON.Color4(0.17, 0.97, 0.02),
    new BABYLON.Color4(0.6, 0.93, 0.57),
    new BABYLON.Color4(0, 0.2, 0, 0.8));
moveparticle(track008,sphere008,3.5, 27.8, 71.8,0);
makeparticle(sphere008cl1,particleSystem4,
    new BABYLON.Color4(0.17, 0.97, 0.02),
    new BABYLON.Color4(0.6, 0.93, 0.57),
    new BABYLON.Color4(0, 0.2, 0, 0.8));
moveparticle(track008,sphere008cl1,3.5, 27.8, 71.8,8000);
const track049 = [];//管道Brep.049的轨迹
track049.push(new slide(4.3,"right"));  //first side length 6
track049.push(new slide(4.3+22,"up")); //at finish of second side distance covered is 18+9
track049.push(new slide(4.3+22+10.2,"behind")); //at finish of second side distance covered is 18+9
// track049.push(new slide(4.3+22+10.2+0,"down")); //at finish of second side distance covered is 18+9
track049.push(new slide(4.3+22+10.2+0+46,"left")); //at finish of second side distance covered is 18+9
track049.push(new slide(4.3+22+10.2+0+46+23.3,"front")); 
track049.push(new slide(4.3+22+10.2+0+46+23.3+2.5,"right")); 
track049.push(new slide(4.3+22+10.2+0+46+23.3+2.5+3.5,"down")); //最后一条共70.3

let particleSystem5=new BABYLON.ParticleSystem(`particles5`,10000,scene);
let particleSystem6=new BABYLON.ParticleSystem(`particles6`,10000,scene);
//创建一个紫色的粒子系统
makeparticle(sphere049,particleSystem5,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track049,sphere049,-8, 9.57, 79.6,0);
makeparticle(sphere049cl1,particleSystem6,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track049,sphere049cl1,-8, 9.57, 79.6,6000);

const track053 = [];//管道Brep.053的轨迹
track053.push(new slide(3.5,"up"));  //first side length 6
track053.push(new slide(3.5+20,"front")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8,"right")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8+41,"front")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8+41+104.2,"up")); //at finish of second side distance covered is 18+9
track053.push(new slide(3.5+20+158.8+41+104.2+17.4,"left")); 
track053.push(new slide(3.5+20+158.8+41+104.2+17.4+9.6,"down")); 
track053.push(new slide(3.5+20+158.8+41+104.2+17.4+9.6+20.9,"left"));
track053.push(new slide(3.5+20+158.8+41+104.2+17.4+9.6+20.9+4.3,"up")); //最后一条 共59.3
let particleSystem7=new BABYLON.ParticleSystem(`particles7`,10000,scene);
let particleSystem8=new BABYLON.ParticleSystem(`particles8`,10000,scene);
let particleSystem9=new BABYLON.ParticleSystem(`particles9`,10000,scene);
let particleSystem10=new BABYLON.ParticleSystem(`particles10`,10000,scene);

//创建一个紫色的粒子系统
makeparticle(sphere053,particleSystem7,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053,25.3, 27.6, 61.4,1000);
makeparticle(sphere053cl1,particleSystem8,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053cl1,25.3, 27.6, 61.4,6000);
makeparticle(sphere053cl2,particleSystem9,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053cl2,25.3, 27.6, 61.4,12000);
makeparticle(sphere053cl3,particleSystem10,
    new BABYLON.Color4(0.68, 0, 1),
    new BABYLON.Color4(0.77, 0.24, 0.93),
    new BABYLON.Color4(0.71, 0.44, 0.89));
moveparticle(track053,sphere053cl3,25.3, 27.6, 61.4,18000);

const track041 = [];//管道Brep.041的轨迹
track041.push(new slide(81.06,"up"));  //first side length 6
track041.push(new slide(81.06+73.94,"front")); //at finish of second side distance covered is 18+9
track041.push(new slide(81.06+73.94+54.7,"up")); //at finish of second side distance covered is 18+9
track041.push(new slide(81.06+73.94+54.7+12.6,"right")); //at finish of second side distance covered is 18+9
var particleSystem11=new BABYLON.ParticleSystem(`particles11`,10000,scene);
var particleSystem12=new BABYLON.ParticleSystem(`particles12`,10000,scene);
var particleSystem13=new BABYLON.ParticleSystem(`particles13`,10000,scene);
var particleSystem14=new BABYLON.ParticleSystem(`particles14`,10000,scene);
//创建一个蓝色的粒子系统
makeparticle(sphere041,particleSystem11,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041,-71.1, 25.64, 35.54,1000);
makeparticle(sphere041cl1,particleSystem12,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041cl1,-71.1, 25.64, 35.54,6000);
makeparticle(sphere041cl2,particleSystem13,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041cl2,-71.1, 25.64, 35.54,12000);
makeparticle(sphere041cl3,particleSystem14,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track041,sphere041cl3,-71.1, 25.64, 35.54,18000);

const track042 = [];//管道Brep.042的轨迹
track042.push(new slide(7,"left"));  //first side length 6
track042.push(new slide(7+56.9,"down")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+56.9+30.9,"front")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+56.9+30.9+38.4,"right")); //at finish of second side distance covered is 18+9
track042.push(new slide(7+56.9+30.9+38.4+72.98,"down")); //at finish of second side distance covered is 18+9
var particleSystem15=new BABYLON.ParticleSystem(`particles15`,10000,scene);
var particleSystem16=new BABYLON.ParticleSystem(`particles16`,10000,scene);
var particleSystem17=new BABYLON.ParticleSystem(`particles17`,10000,scene);
var particleSystem18=new BABYLON.ParticleSystem(`particles18`,10000,scene);
//创建一个蓝色的粒子系统
makeparticle(sphere042,particleSystem15,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042,-81,161.5,41.4,1000);
makeparticle(sphere042cl1,particleSystem16,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042cl1,-81,161.5,41.4,6000);
makeparticle(sphere042cl2,particleSystem17,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042cl2,-81,161.5,41.4,12000);
makeparticle(sphere042cl3,particleSystem18,
    new BABYLON.Color4(0, 0.22, 1),
    new BABYLON.Color4(0.11, 0.19, 0.89),
    new BABYLON.Color4(0.44, 0.54, 0.85));
moveparticle(track042,sphere042cl3,-81,161.5,41.4,18000);

function particlestart(){
    particleSystem1.start();//Brep044
    // particleSystem2.start();
    particleSystem3.start();//Brep008
    // particleSystem4.start();
    particleSystem5.start();//Brep049
    // particleSystem6.start();
    particleSystem7.start();//Brep053
    particleSystem8.start();
    particleSystem9.start();
    particleSystem10.start();
    particleSystem11.start();//Brep041
    particleSystem12.start();
    particleSystem13.start();
    particleSystem14.start();
    particleSystem15.start();//Brep042
    particleSystem16.start();
    particleSystem17.start();
    particleSystem18.start();
}
BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "modelv8d.gltf",
    scene,
    function (Meshes) {
        changematerial();
        particlestart();
        let importedMesh = Meshes[0];
        // console.log(Meshes);
        importedMesh.getChildren().forEach(function (mesh){
            //仅为json文件中存在的设备绑定事件
            if(getJson(mesh.id) !== '暂无设备信息'){
                childMesh.push(mesh);
                mesh.actionManager = actionManager;
            }
            if(getPipeJson(mesh.id) !== '暂无设备信息'){
                childMesh.push(mesh);
                mesh.actionManager = actionManager;
            }

        });
    });

//鼠标按下时取消绑定事件,防止卡顿
scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
        case BABYLON.PointerEventTypes.POINTERWHEEL:
            childMesh.forEach(function (mesh){
                mesh.actionManager = null;
            })
            break;
        case BABYLON.PointerEventTypes.POINTERUP:
            childMesh.forEach(function (mesh){
                mesh.actionManager = actionManager;
            })
            break;
        case BABYLON.PointerEventTypes.POINTERPICK:
            childMesh.forEach(function (mesh){
                mesh.actionManager = actionManager;
            })
            break;
    }
});

//报警设备Map,便于图标跟随
let warningModels = new Map();

export function createWarningMessage(modelID,url){
    let warningModel = scene.getMeshById(modelID);

    //生成报警图标
    let bellElement = document.getElementById("bell")
    let clonedIcon = bellElement.cloneNode(true);
    //标签id为模型id
    clonedIcon.id = modelID;
    bellElement.parentNode.appendChild(clonedIcon);

    //设置报警的必要样式
    clonedIcon.style.display = 'block';
    clonedIcon.style.position = 'absolute';
    clonedIcon.style.zIndex = 2;

    //报警图标对应模型
    warningModels.set(clonedIcon, warningModel)

    //取消默认点击事件
    let inputElement = clonedIcon.querySelector("input");
    inputElement.addEventListener("click", function(event){
        event.preventDefault();
    });
    inputElement.addEventListener("click", function(){
        // createWarningLabel(modelID,warningModel);
        window.open(url,"_blank")
    });
    clonedIcon.addEventListener("mouseover", function (){
        //createLabel();
    });
}

export function deleteWarningMessage(modelID){
    let warningElement = document.getElementById(modelID);
    warningModels.delete(warningElement);
    warningElement.remove();
    removeLabel(rmLabelBuild);
}


let renderWidth = engine.getRenderingCanvas().width;
let renderHeight = engine.getRenderingCanvas().height;
let viewport = scene.activeCamera.viewport;
viewport.toGlobal(renderWidth, renderHeight);
let worldMatrix = scene.getTransformMatrix();
function setWarningPosition(warningModels){
    warningModels.forEach(function (value, key){
        if(!value){
            return;
        }
        let modelPosition = value.getAbsolutePosition();
        const transformMatrix = BABYLON.Matrix.Identity();
        transformMatrix.multiply(worldMatrix);
        let screenPosition = BABYLON.Vector3.Project(modelPosition, transformMatrix, scene.getTransformMatrix(), viewport);

        key.style.top = screenPosition.y * 100 + "%"
        key.style.left = screenPosition.x * 100 + "%"

    });
}


scene.registerBeforeRender(function(){

    setWarningPosition(warningModels);

    //计算帧率
    let fps = engine.getFps().toFixed();

    let fpsDisplay = document.getElementById("fpsDisplay");
    fpsDisplay.innerHTML = "FPS:" + fps;
})

//渲染场景
engine.runRenderLoop(() => {
    scene.render();
    //console.log(camera.position);
})

//监听窗口大小改变
window.addEventListener("resize",() => {
    engine.resize();
});
