import './style.css';
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data from '../public/json/HydrogenSysInfo.json' assert {type: 'JSON'}
import {camera_config} from './config.js';
import {getJson} from "./connect.js";
import {home_btn} from './ui.js';

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//将canvas添加到body中
document.body.appendChild(canvas);

export let objectArray;
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
        BABYLON.ActionManager.OnPickTrigger, //鼠标单击触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    displayLabel(event);
                    var pickInfo = scene.pick(scene.pointerX, scene.pointerY);

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

let rmLabelBuild = []

function createLabel(event){
    var label = new GUI.Rectangle();
    label.background = "rgba(0, 0, 0, 1)";
    label.height = "60px";
    label.alpha = 0.6;
    label.width = "200px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    advancedTexture.addControl(label);
    label.linkWithMesh(event.meshUnderPointer);
    var text1 = new GUI.TextBlock();
    text1.text = getJson(event.meshUnderPointer.id,"Name");
    text1.color = "white";
    label.addControl(text1);
    rmLabelBuild.push(label);
    rmLabelBuild.push(text1);
}

function createWarningLabel(modelID,model){
    for(let label of rmLabelBuild){
        if(label.name === modelID){
            return;
        }
    }
    let label = new GUI.Rectangle(modelID);
    label.background = "rgba(0, 0, 0, 1)";
    label.alpha = 0.6;
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    label.width = "500px";
    label.height = "300px";
    advancedTexture.addControl(label);
    label.linkWithMesh(model);
    var text1 = new GUI.TextBlock();
    text1.text = "报警信息名称:"+getJson(modelID,"Name")  +"\n"+ "报警信息报警信息报警信息报警信息报警信息报警信息";
    text1.color = "white";
    label.addControl(text1);

    rmLabelBuild.push(label);
    rmLabelBuild.push(text1);
}

var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
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

BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "modelv6d.gltf",
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

//报警设备Map,便于图标跟随
let warningModels = new Map();

export function createWarningMessage(modelID){
    var warningModel = scene.getMeshById(modelID);

    //生成报警图标
    var bellElement = document.getElementById("bell")
    var clonedIcon = bellElement.cloneNode(true);
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
    var inputElement = clonedIcon.querySelector("input");
    inputElement.addEventListener("click", function(event){
        event.preventDefault();
    });
    inputElement.addEventListener("click", function(){
        createWarningLabel(modelID,warningModel);
    });
}

export function deleteWarningMessage(modelID){
    let warningElement = document.getElementById(modelID);
    warningModels.delete(warningElement);
    warningElement.remove();
    removeLabel(rmLabelBuild);
}


var renderWidth = engine.getRenderingCanvas().width;
var renderHeight = engine.getRenderingCanvas().height;
var viewport = scene.activeCamera.viewport;
viewport.toGlobal(renderWidth, renderHeight);
var worldMatrix = scene.getTransformMatrix();
function setWarningPosition(warningModels){
    warningModels.forEach(function (value, key){
        var modelPosition = value.getAbsolutePosition();
        const transformMatrix = BABYLON.Matrix.Identity();
        transformMatrix.multiply(worldMatrix);
        var screenPosition = BABYLON.Vector3.Project(modelPosition, transformMatrix, scene.getTransformMatrix(), viewport);

        key.style.top = screenPosition.y * 100 + "%"
        key.style.left = screenPosition.x * 100 + "%"

    });
}


scene.registerBeforeRender(function(){

    setWarningPosition(warningModels);

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
