import './style.css';
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data from '../public/json/HydrogenSysInfo.json' assert {type: 'JSON'}
import config from '../public/json/tsconfig.json' assert {type: 'JSON'}
import {getJson, getPDF} from "./connect.js";
import {back_btn, display_btn, home_btn, info_btn, play_btn} from './ui.js';

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//将canvas添加到body中
document.body.appendChild(canvas);

export let objectArray;
let doorAngle = [0,0,0];
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
objectArray = data.map(jsonObject => new MyObject(
    jsonObject.ID,
    jsonObject.Name,
    jsonObject.Info,
    jsonObject.Manual,
    jsonObject.Url,
    jsonObject.LocID,
    jsonObject.Animation
));


// 创建一个哈希表，将 ID 映射到数组索引
export const idToIndexMap = {};

// 填充哈希表
objectArray.forEach((obj, index) => {
    idToIndexMap[obj.ID] = index;
});

// 要查找的特定 ID
const targetID = "10QM001"; // 例如，查找 ID 为 "10QM001" 的对象

// 使用哈希表查找特定 ID 对应的数组索引
let targetIndex = idToIndexMap[targetID];

console.log("10QM001", objectArray[targetIndex]);

//创建引擎，第二个参数为抗锯齿
const engine = new BABYLON.Engine(canvas,true,{stencil:true});


//创建场景
const scene = new BABYLON.Scene(engine,false);
// const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("texture/hdr/environment.env", scene);
var hdrTexture = new BABYLON.HDRCubeTexture("texture/hdr/env3.hdr", scene, 1024);
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
camera.panningSensibility = config.camera_panningSensibility; // 增加平移灵敏度
camera.wheelPrecision = config.camera_wheelPrecision;
camera.inertia = 0; //设置惯性为零

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
                    //moveCameraPosition(new BABYLON.Vector3(0,40,70));
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
        BABYLON.ActionManager.OnPickTrigger, //鼠标单机触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    displayLabel(event);
                    break;
            }
        }
    )
);

function displayLabel(event){
    var rightLabel = document.getElementById("rightLabel");

    var modelNameElm = document.getElementById("modelName");
    modelNameElm.innerHTML = getJson(event.meshUnderPointer.id,'Name');

    var modelInfoElm = document.getElementById("modelInfo");
    modelInfoElm.innerHTML = getJson(event.meshUnderPointer.id,"Info");

    if(!rightLabel.style.display){
        rightLabel.style.display = "block";
    }
    rightLabel.classList.remove("right-slide-out");
    rightLabel.classList.add("right-slide-in");
}


var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.renderScale = 1;

let rmLabelBuild = [];
let selectMesh, selectName;
let clickPos;
let basePosition = new BABYLON.Vector3(38.92868423461914,-0.002165344078093767,49.058162689208984); 
function highLight(mesh, labelName) {

    selectMesh = mesh;
    selectName = labelName;
    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    models.push(mesh);
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY);

    if (pickInfo.hit) {
        // 鼠标点击位置的世界坐标
        clickPos = pickInfo.pickedPoint;
        console.log("鼠标点击位置的世界坐标：", clickPos);
    }
}

let currentPosMesh, currentPosCamera, currentTargetCamera;
let targetPosCamera, targetPosMesh;
targetPosCamera = new BABYLON.Vector3(-100,-100,-100);
targetPosMesh= new BABYLON.Vector3(-100,-105,-100);
let isLooking = false;

function moveMeshWithCamera(mesh)
{
    if(isLooking)
        return;
    currentPosMesh = mesh.position.clone();
    currentPosCamera = camera.position.clone();
    currentTargetCamera = camera.target.clone();

    mesh.position.z += 1500;
    mesh.position.y += 1500;

    camera.position = clickPos.clone().add(new BABYLON.Vector3(6, 1500, 1500));

    camera.setTarget(clickPos.add(new BABYLON.Vector3(0, 1500, 1500)));
    isLooking = true;
}

function resetMeshWithCamera(mesh)
{
    if(!isLooking)
        return;
    camera.position = currentPosCamera;
    mesh.position = currentPosMesh;
    camera.setTarget(currentTargetCamera);

    isLooking = false;
}

home_btn.addEventListener('click', function(){

    camera.rotation = new BABYLON.Vector3(0, 0, 0);

    camera.position = initPos;
    camera.setTarget(initTarget);
    
    // if(selectMesh!=null)
    // {
    //     selectMesh.position = currentPosMesh;
    //     camera.setTarget(new BABYLON.Vector3(0, 20, 20));
    // }

    console.log("Camera reset");
});

display_btn.addEventListener('click', function (){
    if(selectMesh==null)
        console.log("no mesh");
    else
    {
        moveMeshWithCamera(selectMesh);
    }
});

back_btn.addEventListener('click', function (){
    if(selectMesh==null)
        console.log("no mesh");
    else
    {
        resetMeshWithCamera(selectMesh);
        console.log(selectMesh.position);
        console.log(camera.position);
    }
});

function playAnimation(type)
{
    let video_url = "";

    switch(type)
    {
        case "4":
            //球阀
            video_url = "video/球阀.mkv";
            break;
        case "5":
            //三通
            video_url = "video/三通.mkv";
            break;
        case "3":
            //电磁
            video_url = "video/电磁阀.mkv";
            break;
        case "6":
            //发电机，自行配置JSON文件
            video_url = "video/发电机.mkv";
            break;
        default:
            return;
    }

    var newWindow = window.open('', '_blank', 'fullscreen=yes');   
    // 在新窗口中创建一个视频播放器
    newWindow.document.write('<html lang="en"><head><title>设备动画</title></head><body style="margin: 0; overflow: hidden;"><video src="' + video_url + '" controls autoplay style="width: 100%; height: 100%; object-fit: cover;"></video></body></html>');
}

play_btn.addEventListener('click', function(){
    console.log(camera.position);
    console.log(camera.rotation);
    console.log(camera.target);
    if(selectMesh==null)
        console.log("no mesh");
    else
    {
        let animation = getJson(selectName, "Animation");
        playAnimation(animation);
    }

})

info_btn.addEventListener('click', function (){
    getPDF(selectName);

});

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

BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "modelv2.gltf",
    scene,
    function (Meshes) {
        var importedMesh = Meshes[0];
        importedMesh.getChildren().forEach(function (mesh){
            //仅为json文件中存在的设备绑定事件
            if(getJson(mesh.id) !== '暂无设备信息'){
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

scene.registerBeforeRender(function(){

    //计算帧率
    var fps = engine.getFps().toFixed();

    var fpsDisplay = document.getElementById("fpsDisplay");
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
