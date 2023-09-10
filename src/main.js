import './style.css';
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data from '../public/json/HydrogenSysInfo.json' assert {type: 'JSON'}

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//将canvas添加到body中
document.body.appendChild(canvas);

let objectArray = null;
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
const idToIndexMap = {};

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
    new BABYLON.Vector3(100, 20, 100), // 相机目标点
    scene             // 相机所在场景
);

// 设置相机的灵敏度
camera.panningSensibility = 140; // 增加平移灵敏度

camera.position = new BABYLON.Vector3(0, 30, 0);

//将相机附加到画布上,
camera.attachControl(canvas);

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
    
    var textBlock1 = new GUI.TextBlock();
    textBlock1.text = getJsonName(labelName);
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";
    
    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJsonName(labelName);
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
    textBlock0.text = "控制柜";
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
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        fetch('http://192.168.0.174:8003/api/data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: 'Hello,server!'}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });

        part3.removeControl(presentTextBlock);
        presentTextBlock = textBlock1;
        part3.addControl(presentTextBlock);
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
    
    var textBlock1 = new GUI.TextBlock();
    textBlock1.text = getJsonName(labelName);
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";
    
    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJsonName(labelName);
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
    textBlock0.text = "控制柜";
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
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        fetch('http://192.168.0.174:8003/api/data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: 'Hello,server!'}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });

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
        // 指定旋转轴的位置

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
    textBlock1.text = getJsonName(labelName);
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";
    
    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJsonName(labelName);
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
    textBlock0.text = "控制柜";
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
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        fetch('http://192.168.0.174:8003/api/data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: 'Hello,server!'}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });

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
    textBlock1.text = getJsonName(labelName);
    textBlock1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock1.color = "white";
    
    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = getJsonName(labelName);
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
    textBlock0.text = "控制柜";
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
        // 添加按钮1的点击事件处理
        console.log("按钮1被点击");
        fetch('http://192.168.0.174:8003/api/data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: 'Hello,server!'}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });

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

//根据ID显示设备名称
function getJsonName(labelName){
    let targetIndex = idToIndexMap[labelName];
    let targetObject = objectArray[targetIndex];

    if(targetObject){
        return  "名称：" + targetObject.Name +"\n"+ "信息：" + targetObject.Info
    }else {
        var str = "暂无设备信息"
        return str

    }
}

function moveCameraPosition(targetPosition){
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

    BABYLON.Animation.CreateAndStartAnimation(
        'moveCamera',
        camera,
        'position',
        30,
        60,
        camera.position,
        targetPosition,
        0,
        ease,
        ()=>{
            moveCameraTarget(new BABYLON.Vector3(20,10,0))
        });

}

function moveCameraTarget(targetPosition){
    var ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    BABYLON.Animation.CreateAndStartAnimation(
        'moveCamera',
        camera,
        'target',
        30,
        60,
        camera.getTarget(),
        targetPosition,
        0,
        ease,
        ()=>{
            console.log("1");
        });
}

BABYLON.SceneLoader.ImportMesh(
    "",
    "model/",
    "model.gltf",
    scene,
    function (Meshes) {
        var importedMesh = Meshes[0];
        importedMesh.getChildren().forEach(function (mesh){
            if(mesh.name === "Mesh.004"){
                hydrogenProductionModule = mesh;
                mesh.actionManager = actionManager;
            }
            if(mesh.name === "Mesh.020"){
                purificationModule = mesh;
                mesh.actionManager = actionManager;
            }
            if(mesh.name === "Mesh.005"){
                airControlModule = mesh;
                mesh.actionManager = actionManager;
            }else {
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

const light1 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(1,-1,1),//光源方向
    scene
);
light1.intensity = 1;
const light2 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(-1,-1,1),//光源方向
    scene
);
light2.intensity = 1;
const light3 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(-1,-1,-1),//光源方向
    scene
);
light3.intensity = 1;
const light4 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(1,-1,-1),//光源方向
    scene
);
light4.intensity = 1;


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
