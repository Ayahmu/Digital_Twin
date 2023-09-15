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

//模型
let hydrogenProductionModule;
let purificationModule;
let airControlModule;
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

function createLabelDefault(mesh, labelName) {
    var label = new GUI.Grid();
    label.addRowDefinition(12);  // 第一部分占百分之十五
    label.addRowDefinition(12);  // 第三部分占百分之七十
    label.addRowDefinition(76);  // 第二部分占百分之十五
    label.background = "rgba(0, 0, 0, 0.6)";
    label.height = "600px";
    label.width = "380px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    label.isPointerBlocker = false; // 允许鼠标事件穿透
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeftInPixels = 15;

    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJson(labelName,'Name');
    textBlock2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock2.color = "blue";

    //第0部分
    var part0 = GUI.Button.CreateSimpleButton("button1", " X");
    part0.width = "18px";
    part0.height = "18px";
    part0.background = "black";
    part0.color = "white";
    part0.isPointerBlocker = true;
    part0.cornerRadius = 4;
    part0.textBlock.fontSize = 12;
    part0.textBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part0.textBlock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part0.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part0.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    part0.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("关闭");
        //使用removeLabel可以同时移除高光
        removeLabel(rmLabelBuild);
        //label.isVisible = false;
    });

    label.addControl(part0, 0, 0);

    // 创建第一部分
    var part1 = new GUI.Rectangle();
    part1.background = "black"; // 背景颜色
    part1.width = "160px";
    part1.height = "60px";
    part1.alpha = 1;
    part1.cornerRadius = 10;
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    var textBlock0 = new GUI.TextBlock();
    textBlock0.text = "设备信息";
    textBlock0.color = "white";
    textBlock0.fontSize = 18;
    part1.addControl(textBlock0);

    // 使用布局对齐和填充来调整元素位置
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part1.paddingTopInPixels = 10;

    label.addControl(part1, 0, 0);

    // 创建第二部分，分为两列
    var part2 = new GUI.Grid();
    part2.addColumnDefinition(50);  // 第一列占百分之五十
    part2.addColumnDefinition(50);  // 第二列占百分之五十

    var button1 = GUI.Button.CreateSimpleButton("button1", "使用说明");
    button1.width = "120px";
    button1.height = "50px";
    button1.background = "black";
    button1.color = "white";
    button1.isPointerBlocker = true;
    button1.cornerRadius = 10;
    button1.textBlock.fontSize = 14;
    button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.onPointerClickObservable.add(function() {
        getPDF(labelName);
    });

    var button2 = GUI.Button.CreateSimpleButton("button2", "相关资料");
    button2.width = "120px";
    button2.height = "50px";
    button2.background = "black";
    button2.color = "white";
    button2.isPointerBlocker = true;
    button2.cornerRadius = 10;
    button2.textBlock.fontSize = 14;
    button2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    button2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
        window.open("https://ys.mihoyo.com/");
    });

    presentTextBlock = textBlock2;

    part2.addControl(button1, 0, 0);
    part2.addControl(button2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part2.paddingTopInPixels = 10;

    label.addControl(part2, 1, 0);

    // 创建第三部分
    var part3 = new GUI.Rectangle();
    part3.background = "black"; // 背景颜色
    part3.width = "310px";
    part3.height = "420px";
    part3.cornerRadius = 10;

    part3.addControl(presentTextBlock);

    // 使用布局对齐和填充来调整元素位置
    part3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3.paddingTopInPixels = 10;

    label.addControl(part3, 2, 0);

    //label创建完成,添加到texture中
    advancedTexture.addControl(label);

    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    rmLabelBuild.push(label);
    models.push(mesh);
}

function createLabel2(mesh, labelName) {
    var label = new GUI.Grid();
    label.addRowDefinition(12);
    label.addRowDefinition(12);
    label.addRowDefinition(12);
    label.addRowDefinition(64);
    label.background = "rgba(0, 0, 0, 0.6)";
    label.height = "600px";
    label.width = "380px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    label.isPointerBlocker = false; // 允许鼠标事件穿透
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeftInPixels = 15;
    let idx = idToDoor[labelName];

    var textBlock1 = new GUI.TextBlock();
    textBlock1.text = getJson(labelName,'Name');
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";

    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJson(labelName,'Name');
    textBlock2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock2.color = "blue";

    //第0部分
    var part0 = GUI.Button.CreateSimpleButton("button1", " X");
    part0.width = "18px";
    part0.height = "18px";
    part0.background = "black";
    part0.color = "white";
    part0.isPointerBlocker = true;
    part0.cornerRadius = 4;
    part0.textBlock.fontSize = 12;
    part0.textBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part0.textBlock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part0.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part0.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    part0.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("关闭");
        //使用removeLabel可以同时移除高光
        removeLabel(rmLabelBuild);
        //label.isVisible = false;
    });

    label.addControl(part0, 0, 0);

    // 创建第一部分
    var part1 = new GUI.Rectangle();
    part1.background = "black"; // 背景颜色
    part1.width = "160px";
    part1.height = "60px";
    part1.alpha = 1;
    part1.cornerRadius = 10;
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    var textBlock0 = new GUI.TextBlock();
    textBlock0.text = "设备信息";
    textBlock0.color = "white";
    textBlock0.fontSize = 18;
    part1.addControl(textBlock0);

    // 使用布局对齐和填充来调整元素位置
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part1.paddingTopInPixels = 10;

    label.addControl(part1, 0, 0);

    // 创建第二部分，分为两列
    var part2 = new GUI.Grid();
    part2.addColumnDefinition(50);  // 第一列占百分之五十
    part2.addColumnDefinition(50);  // 第二列占百分之五十

    var button1 = GUI.Button.CreateSimpleButton("button1", "使用说明");
    button1.width = "120px";
    button1.height = "50px";
    button1.background = "black";
    button1.color = "white";
    button1.isPointerBlocker = true;
    button1.cornerRadius = 10;
    button1.textBlock.fontSize = 14;
    button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.onPointerClickObservable.add(function() {
        getPDF(labelName);
        part4.removeControl(presentTextBlock);
        presentTextBlock = textBlock1;
        part4.addControl(presentTextBlock);
    });
    var button2 = GUI.Button.CreateSimpleButton("button2", "相关资料");
    button2.width = "120px";
    button2.height = "50px";
    button2.background = "black";
    button2.color = "white";
    button2.isPointerBlocker = true;
    button2.cornerRadius = 10;
    button2.textBlock.fontSize = 14;
    button2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    button2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
        window.open("https://ys.mihoyo.com/");
    });

    presentTextBlock = textBlock2;

    part2.addControl(button1, 0, 0);
    part2.addControl(button2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part2.paddingTopInPixels = 10;

    label.addControl(part2, 1, 0);



    // 创建第二部分，分为两列
    var part3 = new GUI.Grid();
    part3.addColumnDefinition(50);  // 第一列占百分之五十
    part3.addColumnDefinition(50);  // 第二列占百分之五十

    var part3_b1 = GUI.Button.CreateSimpleButton("button1", "打开柜门");
    part3_b1.width = "120px";
    part3_b1.height = "50px";
    part3_b1.background = "black";
    part3_b1.color = "white";
    part3_b1.isPointerBlocker = true;
    part3_b1.cornerRadius = 10;
    part3_b1.textBlock.fontSize = 14;
    part3_b1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3_b1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part3_b1.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        if(doorAngle[idx] === 1) return;
        var rotationAxis = new BABYLON.Vector3(0, 1, 0);
        var rotationAngle =  -Math.PI / 3;
        mesh.rotate(rotationAxis, rotationAngle, BABYLON.Space.LOCAL);
        doorAngle[idx] = 1;
    });

    var part3_b2 = GUI.Button.CreateSimpleButton("button2", "关闭柜门");
    part3_b2.width = "120px";
    part3_b2.height = "50px";
    part3_b2.background = "black";
    part3_b2.color = "white";
    part3_b2.isPointerBlocker = true;
    part3_b2.cornerRadius = 10;
    part3_b2.textBlock.fontSize = 14;
    part3_b2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part3_b2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part3_b2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
        if(doorAngle[idx] === 0) return;
        var rotationAxis = new BABYLON.Vector3(0, 1, 0);
        var rotationAngle =  Math.PI / 3;
        mesh.rotate(rotationAxis, rotationAngle, BABYLON.Space.LOCAL);
        doorAngle[idx] = 0;
    });

    presentTextBlock = textBlock2;

    part3.addControl(part3_b1, 0, 0);
    part3.addControl(part3_b2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3.paddingTopInPixels = 10;

    label.addControl(part3, 2, 0);



    // 创建第三部分
    var part4 = new GUI.Rectangle();
    part4.background = "black"; // 背景颜色
    part4.width = "310px";
    part4.height = "360px";
    part4.cornerRadius = 10;

    part4.addControl(presentTextBlock);

    // 使用布局对齐和填充来调整元素位置
    part4.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part4.paddingTopInPixels = 10;

    label.addControl(part4, 3, 0);

    //label创建完成,添加到texture中
    advancedTexture.addControl(label);

    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    rmLabelBuild.push(label);
    rmLabelBuild.push(textBlock0);
    rmLabelBuild.push(textBlock1);
    rmLabelBuild.push(textBlock2);
    models.push(mesh);

}

function createLabel3(mesh, labelName) {
    var label = new GUI.Grid();
    label.addRowDefinition(12);
    label.addRowDefinition(12);
    label.addRowDefinition(12);
    label.addRowDefinition(64);
    label.background = "rgba(0, 0, 0, 0.6)";
    label.height = "600px";
    label.width = "380px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    label.isPointerBlocker = false; // 允许鼠标事件穿透
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeftInPixels = 15;

    var textBlock1 = new GUI.TextBlock();
    textBlock1.text = getJson(labelName, 'Name');
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";

    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJson(labelName, 'Name');
    textBlock2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock2.color = "blue";

    //第0部分
    var part0 = GUI.Button.CreateSimpleButton("button1", " X");
    part0.width = "18px";
    part0.height = "18px";
    part0.background = "black";
    part0.color = "white";
    part0.isPointerBlocker = true;
    part0.cornerRadius = 4;
    part0.textBlock.fontSize = 12;
    part0.textBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part0.textBlock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part0.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part0.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    part0.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("关闭");
        //使用removeLabel可以同时移除高光
        removeLabel(rmLabelBuild);
        //label.isVisible = false;
    });

    label.addControl(part0, 0, 0);

    // 创建第一部分
    var part1 = new GUI.Rectangle();
    part1.background = "black"; // 背景颜色
    part1.width = "160px";
    part1.height = "60px";
    part1.alpha = 1;
    part1.cornerRadius = 10;
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    var textBlock0 = new GUI.TextBlock();
    textBlock0.text = "设备信息";
    textBlock0.color = "white";
    textBlock0.fontSize = 18;
    part1.addControl(textBlock0);

    // 使用布局对齐和填充来调整元素位置
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part1.paddingTopInPixels = 10;

    label.addControl(part1, 0, 0);

    // 创建第二部分，分为两列
    var part2 = new GUI.Grid();
    part2.addColumnDefinition(50);  // 第一列占百分之五十
    part2.addColumnDefinition(50);  // 第二列占百分之五十

    var button1 = GUI.Button.CreateSimpleButton("button1", "使用说明");
    button1.width = "120px";
    button1.height = "50px";
    button1.background = "black";
    button1.color = "white";
    button1.isPointerBlocker = true;
    button1.cornerRadius = 10;
    button1.textBlock.fontSize = 14;
    button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.onPointerClickObservable.add(function() {
        getPDF(labelName);
        part4.removeControl(presentTextBlock);
        presentTextBlock = textBlock1;
        part4.addControl(presentTextBlock);
    });
    var button2 = GUI.Button.CreateSimpleButton("button2", "相关资料");
    button2.width = "120px";
    button2.height = "50px";
    button2.background = "black";
    button2.color = "white";
    button2.isPointerBlocker = true;
    button2.cornerRadius = 10;
    button2.textBlock.fontSize = 14;
    button2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    button2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
        window.open("https://ys.mihoyo.com/");
    });

    presentTextBlock = textBlock2;

    part2.addControl(button1, 0, 0);
    part2.addControl(button2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part2.paddingTopInPixels = 10;

    label.addControl(part2, 1, 0);



    // 创建第二部分，分为两列
    var part3 = new GUI.Grid();
    part3.addColumnDefinition(50);  // 第一列占百分之五十
    part3.addColumnDefinition(50);  // 第二列占百分之五十

    var part3_b1 = GUI.Button.CreateSimpleButton("button1", "打开阀门");
    part3_b1.width = "120px";
    part3_b1.height = "50px";
    part3_b1.background = "black";
    part3_b1.color = "white";
    part3_b1.isPointerBlocker = true;
    part3_b1.cornerRadius = 10;
    part3_b1.textBlock.fontSize = 14;
    part3_b1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3_b1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part3_b1.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        // 指定旋转轴的位置

    });

    var part3_b2 = GUI.Button.CreateSimpleButton("button2", "关闭阀门");
    part3_b2.width = "120px";
    part3_b2.height = "50px";
    part3_b2.background = "black";
    part3_b2.color = "white";
    part3_b2.isPointerBlocker = true;
    part3_b2.cornerRadius = 10;
    part3_b2.textBlock.fontSize = 14;
    part3_b2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part3_b2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part3_b2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
        closeCabinetDoor(mesh);
    });

    presentTextBlock = textBlock2;

    part3.addControl(part3_b1, 0, 0);
    part3.addControl(part3_b2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3.paddingTopInPixels = 10;

    label.addControl(part3, 2, 0);



    // 创建第三部分
    var part4 = new GUI.Rectangle();
    part4.background = "black"; // 背景颜色
    part4.width = "310px";
    part4.height = "360px";
    part4.cornerRadius = 10;

    part4.addControl(presentTextBlock);

    // 使用布局对齐和填充来调整元素位置
    part4.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part4.paddingTopInPixels = 10;

    label.addControl(part4, 3, 0);

    //label创建完成,添加到texture中
    advancedTexture.addControl(label);

    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    rmLabelBuild.push(label);
    rmLabelBuild.push(textBlock0);
    rmLabelBuild.push(textBlock1);
    rmLabelBuild.push(textBlock2);
    models.push(mesh);
}

function createLabel4(mesh, labelName) {
    var label = new GUI.Grid();
    label.addRowDefinition(12);
    label.addRowDefinition(12);
    label.addRowDefinition(12);
    label.addRowDefinition(64);
    label.background = "rgba(0, 0, 0, 0.6)";
    label.height = "600px";
    label.width = "380px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    label.isPointerBlocker = false; // 允许鼠标事件穿透
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeftInPixels = 15;

    var textBlock1 = new GUI.TextBlock();
    textBlock1.text = getJson(labelName,'Name');
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";

    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJson(labelName,'Name');
    textBlock2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock2.color = "blue";

    //第0部分
    var part0 = GUI.Button.CreateSimpleButton("button1", " X");
    part0.width = "18px";
    part0.height = "18px";
    part0.background = "black";
    part0.color = "white";
    part0.isPointerBlocker = true;
    part0.cornerRadius = 4;
    part0.textBlock.fontSize = 12;
    part0.textBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part0.textBlock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part0.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part0.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    part0.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("关闭");
        //使用removeLabel可以同时移除高光
        removeLabel(rmLabelBuild);
        //label.isVisible = false;
    });

    label.addControl(part0, 0, 0);

    // 创建第一部分
    var part1 = new GUI.Rectangle();
    part1.background = "black"; // 背景颜色
    part1.width = "160px";
    part1.height = "60px";
    part1.alpha = 1;
    part1.cornerRadius = 10;
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    var textBlock0 = new GUI.TextBlock();
    textBlock0.text = "设备信息";
    textBlock0.color = "white";
    textBlock0.fontSize = 18;
    part1.addControl(textBlock0);

    // 使用布局对齐和填充来调整元素位置
    part1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part1.paddingTopInPixels = 10;

    label.addControl(part1, 0, 0);

    // 创建第二部分，分为两列
    var part2 = new GUI.Grid();
    part2.addColumnDefinition(50);  // 第一列占百分之五十
    part2.addColumnDefinition(50);  // 第二列占百分之五十

    var button1 = GUI.Button.CreateSimpleButton("button1", "使用说明");
    button1.width = "120px";
    button1.height = "50px";
    button1.background = "black";
    button1.color = "white";
    button1.isPointerBlocker = true;
    button1.cornerRadius = 10;
    button1.textBlock.fontSize = 14;
    button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button1.onPointerClickObservable.add(function() {
        getPDF(labelName);
        part4.removeControl(presentTextBlock);
        presentTextBlock = textBlock1;
        part4.addControl(presentTextBlock);
    });
    var button2 = GUI.Button.CreateSimpleButton("button2", "相关资料");
    button2.width = "120px";
    button2.height = "50px";
    button2.background = "black";
    button2.color = "white";
    button2.isPointerBlocker = true;
    button2.cornerRadius = 10;
    button2.textBlock.fontSize = 14;
    button2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    button2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    button2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
        window.open("https://ys.mihoyo.com/");
    });

    presentTextBlock = textBlock2;

    part2.addControl(button1, 0, 0);
    part2.addControl(button2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part2.paddingTopInPixels = 10;

    label.addControl(part2, 1, 0);



    // 创建第二部分，分为两列
    var part3 = new GUI.Grid();
    part3.addColumnDefinition(50);  // 第一列占百分之五十
    part3.addColumnDefinition(50);  // 第二列占百分之五十

    var part3_b1 = GUI.Button.CreateSimpleButton("button1", "减小角度");
    part3_b1.width = "120px";
    part3_b1.height = "50px";
    part3_b1.background = "black";
    part3_b1.color = "white";
    part3_b1.isPointerBlocker = true;
    part3_b1.cornerRadius = 10;
    part3_b1.textBlock.fontSize = 14;
    part3_b1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3_b1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part3_b1.onPointerClickObservable.add(function() {
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        // 指定旋转轴的位置

    });

    var part3_b2 = GUI.Button.CreateSimpleButton("button2", "增大角度");
    part3_b2.width = "120px";
    part3_b2.height = "50px";
    part3_b2.background = "black";
    part3_b2.color = "white";
    part3_b2.isPointerBlocker = true;
    part3_b2.cornerRadius = 10;
    part3_b2.textBlock.fontSize = 14;
    part3_b2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    part3_b2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    part3_b2.onPointerClickObservable.add(function() {
        // 添加按钮2的点击事件处理
        console.log("按钮2被点击");
    });

    presentTextBlock = textBlock2;

    part3.addControl(part3_b1, 0, 0);
    part3.addControl(part3_b2, 0, 1);

    // 使用布局对齐和填充来调整元素位置
    part3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part3.paddingTopInPixels = 10;

    label.addControl(part3, 2, 0);



    // 创建第三部分
    var part4 = new GUI.Rectangle();
    part4.background = "black"; // 背景颜色
    part4.width = "310px";
    part4.height = "360px";
    part4.cornerRadius = 10;

    part4.addControl(presentTextBlock);

    // 使用布局对齐和填充来调整元素位置
    part4.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    part4.paddingTopInPixels = 10;

    label.addControl(part4, 3, 0);

    //label创建完成,添加到texture中
    advancedTexture.addControl(label);

    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    rmLabelBuild.push(label);
    rmLabelBuild.push(textBlock0);
    rmLabelBuild.push(textBlock1);
    rmLabelBuild.push(textBlock2);
    models.push(mesh);
}

function createLabel(mesh, labelName)
{
    var targetObject = objectArray[idToIndexMap[labelName]];
    console.log(targetObject);
    if(targetObject!=null)
    {
        switch(targetObject.Animation)
        {
            case "2":
                createLabel2(mesh, labelName);
                break;
            case "3":
                createLabel3(mesh, labelName);
                break;
            case "4":
                createLabel4(mesh, labelName);
                break;
            default:
                createLabelDefault(mesh, labelName);
        }
    }
    else
    {
        createLabelDefault(mesh, labelName);
    }

}

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

const lightColor = new BABYLON.Color3(0.6,0.6,0.5)

const light1 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(1,-1,1),//光源方向
    scene
);
light1.intensity = 1;
light1.diffuse = lightColor;
const light2 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(-1,-1,1),//光源方向
    scene
);
light2.intensity = 1;
light2.diffuse = lightColor;
const light3 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(-1,-1,-1),//光源方向
    scene
);
light3.intensity = 1;
light3.diffuse = lightColor;
const light4 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(1,-1,-1),//光源方向
    scene
);
light4.intensity = 1;
light4.diffuse = lightColor;


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
