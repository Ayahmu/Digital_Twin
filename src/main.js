import './style.css';
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data from '../public/json/HydrogenSysInfo.json' assert {type: 'JSON'}
import {getPDF, getJson} from "./connect.js";
import {
    back_btn,
    home_btn,
    display_btn,
    play_btn,
    info_btn,
    close_btn
} from './ui.js';

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
    new BABYLON.Vector3(0, 20, 60), // 相机目标点
    scene             // 相机所在场景
);

// 设置相机的灵敏度
camera.panningSensibility = 120; // 增加平移灵敏度
camera.wheelPrecision = 6;

camera.position = new BABYLON.Vector3(0, 20, -30);

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
        BABYLON.ActionManager.OnPickTrigger,//鼠标点击触发
        function (event){
            switch (event.meshUnderPointer.id){
                default:
                    removeLabel(rmLabelBuild);
                    createLabel(event.meshUnderPointer,event.meshUnderPointer.id);
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

let rmLabelBuild = [];
let selectMesh, selectName;
function createLabel(mesh, labelName) {

    selectMesh = mesh;
    selectName = labelName;
    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    models.push(mesh);
    console.log(mesh.position);

    var modelNameElm = document.getElementById("modelName");
    modelNameElm.innerHTML = getJson(labelName,'Name') + "-设备信息";

    var modelInfoElm = document.getElementById("modelInfo");
    modelInfoElm.innerHTML = getJson(labelName,"Info");
}
// var sv = new GUI.ScrollViewer();
// var tb = new GUI.TextBlock();
// function createScrollView()
// {
//     // 创建一个滚动面板，用于容纳文本和支持滚动
//     sv.thickness = 4;
//     sv.color = "white";
//     sv.width = "320px";
//     sv.height = "520px";
//     sv.background = "black";
//     sv.cornerRadius = 5;
//     sv.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//     sv.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//     sv.paddingRightInPixels = 10;
//     advancedTexture.addControl(sv);

//     tb.textWrapping = GUI.TextWrapping.WordWrap;
//     tb.resizeToFit = true;
//     tb.paddingTop = "5%";
//     tb.paddingLeft = "30px";
//     tb.paddingRight = "20px"
//     tb.paddingBottom = "5%";
//     tb.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
//     tb.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
//     tb.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
//     tb.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
//     tb.color = "white";

//     tb.text = "text\n".repeat(100);

//     tb.fontSize = "24px";

//     sv.addControl(tb);

// }

// createScrollView();


// function createButtons()
// {
//     var label = new GUI.Grid();
//     label.addColumnDefinition(20);  // 第一部分占百分之十五
//     label.addColumnDefinition(20);  // 第三部分占百分之七十
//     label.addColumnDefinition(20);  // 第二部分占百分之十五
//     label.addColumnDefinition(20);
//     label.addColumnDefinition(20);
//     label.background = "rgba(0.3, 0.3, 0.7, 0.5)";
//     label.height = "50px";
//     label.width = "460px";
//     label.cornerRadius = 20;
//     label.thickness = 1;
//     label.linkOffsetY = -100;
//     label.isPointerBlocker = false; // 允许鼠标事件穿透
//     label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//     label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    
//     var part0 = GUI.Button.CreateSimpleButton("button1", " 1");
//     part0.width = "18px";
//     part0.height = "18px";
//     part0.background = "black";
//     part0.color = "white";
//     part0.isPointerBlocker = true;
//     part0.cornerRadius = 4;
//     part0.textBlock.fontSize = 12;
//     part0.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//     part0.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
//     part0.onPointerClickObservable.add(function() {
//         // 添加按钮1的点击事件处理
//         console.log("关闭");
//         //使用removeLabel可以同时移除高光
//         removeLabel(rmLabelBuild);
//         //label.isVisible = false;
//     });
//     label.addControl(part0, 0, 0);

//     var part1 = GUI.Button.CreateSimpleButton("button1", " 2");
//     part1.width = "18px";
//     part1.height = "18px";
//     part1.background = "black";
//     part1.color = "white";
//     part1.isPointerBlocker = true;
//     part1.cornerRadius = 4;
//     part1.textBlock.fontSize = 12;
//     part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//     part1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
//     part1.onPointerClickObservable.add(function() {
//         // 添加按钮1的点击事件处理
//         console.log("关闭");
//         //使用removeLabel可以同时移除高光
//         removeLabel(rmLabelBuild);
//         //label.isVisible = false;
//     });
//     label.addControl(part1, 0, 1);

//     var part2 = GUI.Button.CreateSimpleButton("button1", " 3");
//     part2.width = "18px";
//     part2.height = "18px";
//     part2.background = "black";
//     part2.color = "white";
//     part2.isPointerBlocker = true;
//     part2.cornerRadius = 4;
//     part2.textBlock.fontSize = 12;
//     part2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//     part2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
//     part2.onPointerClickObservable.add(function() {
//         // 添加按钮1的点击事件处理
//         console.log("关闭");
//         //使用removeLabel可以同时移除高光
//         removeLabel(rmLabelBuild);
//         //label.isVisible = false;
//     });
//     label.addControl(part2, 0, 2);

//     var part3 = GUI.Button.CreateSimpleButton("button1", " 4");
//     part3.width = "18px";
//     part3.height = "18px";
//     part3.background = "black";
//     part3.color = "white";
//     part3.isPointerBlocker = true;
//     part3.cornerRadius = 4;
//     part3.textBlock.fontSize = 12;
//     part3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//     part3.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
//     part3.onPointerClickObservable.add(function() {
//         // 添加按钮1的点击事件处理
//         console.log("关闭");
//         //使用removeLabel可以同时移除高光
//         removeLabel(rmLabelBuild);
//         //label.isVisible = false;
//     });
//     label.addControl(part3, 0, 3);

//     var part4 = GUI.Button.CreateSimpleButton("button1", " 5");
//     part4.width = "18px";
//     part4.height = "18px";
//     part4.background = "black";
//     part4.color = "white";
//     part4.isPointerBlocker = true;
//     part4.cornerRadius = 4;
//     part4.textBlock.fontSize = 12;
//     part4.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
//     part4.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
//     part4.onPointerClickObservable.add(function() {
//         // 添加按钮1的点击事件处理
//         console.log("关闭");
//         //使用removeLabel可以同时移除高光
//         removeLabel(rmLabelBuild);
//         //label.isVisible = false;
//     });
//     label.addControl(part4, 0, 4);


//     advancedTexture.addControl(label);

// }

// createButtons();

let currentPosMesh, currentPosCamera, currentRotCamera;
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
    currentRotCamera = camera.rotation.clone();

    camera.position.z += 1500;
    mesh.position.z += 1500;
    camera.position.y += 1500;
    mesh.position.y += 1500;


    camera.setTarget(mesh.position);
    isLooking = true;
}

function resetMeshWithCamera(mesh)
{
    if(!isLooking)
        return;
    camera.position = currentPosCamera;
    mesh.position = currentPosMesh;
    camera.rotation = currentRotCamera;

    camera.setTarget(new BABYLON.Vector3(0, 20, 20));
    isLooking = false;
}

home_btn.addEventListener('click', function(){

    var newRotation = new BABYLON.Vector3(0, 0, 0); 
    camera.rotation = newRotation;

    var newPosition = new BABYLON.Vector3(0, 20, -30); 
    camera.position = newPosition;
    
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
    newWindow.document.write('<html><head><title>全屏视频播放器</title></head><body style="margin: 0; overflow: hidden;"><video src="' + video_url + '" controls autoplay style="width: 100%; height: 100%; object-fit: cover;"></video></body></html>');
}

play_btn.addEventListener('click', function(){
    if(selectMesh==null)
        console.log("no mesh");
    else
    {
        let animation = getJson(selectName, "Animation");
        playAnimation(animation);
    }

})

let selectUrl;

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
