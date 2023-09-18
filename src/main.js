import './style.css';
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data from '../public/json/HydrogenSysInfo.json' assert {type: 'JSON'}
import {getPDF, getJson} from "./connect.js";

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//将canvas添加到body中
document.body.appendChild(canvas);

export let objectArray = null;
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

console.log('读取到的 JSON 数据：', data);
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
// 打印封装后的对象数组
console.log('对象数组：', objectArray);
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
//var hdrTexture = new BABYLON.HDRCubeTexture("texture/hdr/environment.hdr", scene, 512);
const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("texture/hdr/environment.env", scene);
scene.environmentTexture = hdrTexture;
scene.createDefaultSkybox(hdrTexture, true);
scene.environmentIntensity = 0.2;

// 创建相机
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,                // 相机水平旋转角度
    0,                // 相机垂直旋转角度
    10,               // 相机旋转半径
    new BABYLON.Vector3(0, 20, 20), // 相机目标点
    scene             // 相机所在场景
);

// 设置相机的灵敏度
camera.panningSensibility = 120; // 增加平移灵敏度
camera.wheelPrecision = 60;

camera.position = new BABYLON.Vector3(0, 20, -30);

//将相机附加到画布上,
camera.attachControl(canvas);

// 打开柜门
function openCabinetDoor(mesh) {
    // 假设柜门的初始旋转角度为0度，打开柜门需要将其旋转到一定角度（例如90度）
    var targetRotation = BABYLON.Tools.ToRadians(45); // 90度的目标旋转角度

    // 创建动画来逐渐旋转柜门
    var animation = new BABYLON.Animation(
        "OpenCabinetDoorAnimation",
        "_rotation.y", // 以Y轴为旋转轴
        30, // 帧率
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // 设置动画的关键帧
    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.y // 初始角度
    });
    keys.push({
        frame: 30, // 动画帧数
        value: Math.PI / 4 // 目标角度
    });

    animation.setKeys(keys);

    // 添加动画到柜门模型
    mesh.animations.push(animation);
    console.log(mesh.animations);
    console.log(mesh);

    // 启动动画
    scene.beginAnimation(mesh, 0, 30); // 第三个参数表示不循环动画
    mesh.animations=[];
}

// 关闭柜门
function closeCabinetDoor(mesh) {
    // 假设柜门的初始旋转角度为90度，关闭柜门需要将其旋转回0度
    var targetRotation = BABYLON.Tools.ToRadians(0); // 0度的目标旋转角度

    // 创建动画来逐渐旋转柜门
    var animation = new BABYLON.Animation(
        "CloseCabinetDoorAnimation",
        "rotation.y", // 以Y轴为旋转轴
        30, // 帧率
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // 设置动画的关键帧
    var keys = [];
    keys.push({
        frame: 0,
        value: mesh.rotation.y // 初始角度
    });
    keys.push({
        frame: 30, // 动画帧数
        value: targetRotation // 目标角度
    });

    animation.setKeys(keys);

    // 添加动画到柜门模型
    mesh.animations.push(animation);

    // 启动动画
    scene.beginAnimation(mesh, 0, 30, false); // 第三个参数表示不循环动画
}

//创建高亮层
let highLightLayer = new BABYLON.HighlightLayer('highLightLayer',scene,{camera:camera});

//添加鼠标监听事件
const actionManager = new BABYLON.ActionManager(scene);


let childMesh = [];

//模型数组
let models = []

actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,//鼠标点击触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    console.log(event.meshUnderPointer.id)
                    //moveCameraPosition(new BABYLON.Vector3(0,40,70));
                    break;
            }
        }
    )
)


var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
let presentTextBlock;
advancedTexture.renderScale = 1;

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
