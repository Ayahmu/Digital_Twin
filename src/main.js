import './style.css'
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import data from '../public/json/HydrogenSysInfo.json' assert{type:'JSON'}
//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//将canvas添加到body中
document.body.appendChild(canvas);

let objectArray = null;
//读取json数据
function MyObject(ID, Name, Info, Manual, Url, LocID) {
    this.ID = ID;
    this.Name = Name;
    this.Info = Info;
    this.Manual = Manual;
    this.Url = Url;
    this.LocID = LocID;
  }

console.log('读取到的 JSON 数据：', data);
// 创建对象实例并存储在数组中
objectArray = data.map(jsonObject => new MyObject(
      jsonObject.ID,
      jsonObject.Name,
      jsonObject.Info,
      jsonObject.Manual,
      jsonObject.Url,
      jsonObject.LocID
    )); 
// 打印封装后的对象数组
console.log('对象数组：', objectArray);



//创建引擎，第二个参数为抗锯齿
const engine = new BABYLON.Engine(canvas,true,{stencil:true});

//创建场景
const scene = new BABYLON.Scene(engine,false);

//创建相机
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,//相机水平旋转角度
    0,//相机垂直旋转角度
    10,//相机旋转半径
    new BABYLON.Vector3(85,30,275),//相机目标点
    scene//相机所在场景
);
camera.position = new BABYLON.Vector3(90,70,100);

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
                case "Mesh.004":
                case "Mesh.005":
                case "Mesh.020":
                default:
                    removeLabel(rmLabelBuild);
                    createLabel(event.meshUnderPointer,event.meshUnderPointer.id);
                    //moveCameraPosition(new BABYLON.Vector3(0,40,70));
                    break;
            }
        }
    )
)

var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.renderScale = 1;

let rmLabelBuild = [];

function createLabel(mesh, labelName) {
    var label = new GUI.Rectangle("label for " + labelName);
    label.background = "rgba(0, 0, 0, 1)";
    label.top = "0%";
    label.left = "-39.5%";
    label.height = "100%";
    label.alpha = 0.6;
    label.width = "20%";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    advancedTexture.addControl(label);
    //label.linkWithMesh(mesh);
    var text0 = new GUI.TextBlock();
    text0.text = "控制柜";
    text0.fontSize = 30;
    text0.color = "white";
    text0.width = "90%";
    text0.height = "40px";
    label.addControl(text0);
    var text1 = new GUI.TextBlock();
    text1.text = labelName;
    text1.color = "white";
    text1.position = new BABYLON.Vector2(0,0);
    label.addControl(text1);
    var button = new GUI.Button();
    label.addControl(button);
    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    rmLabelBuild.push(label);
    rmLabelBuild.push(text0);
    rmLabelBuild.push(text1);
    models.push(mesh);
}

function createLabel1()
{

    // 创建主要的长方形面板
    var panel = new GUI.StackPanel();
    panel.width = "400px"; // 设置宽度
    panel.height = "700px"; // 设置高度
    advancedTexture.addControl(panel);

    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.paddingLeftInPixels = 50;

    panel.background = 'rgba(128, 128, 128, 0.5)';

    // 第一部分：文本块，占长方形高度的15%
    var textBlock1 = new GUI.TextBlock();
    textBlock1.text = "第一部分";
    textBlock1.height = "15%";
    panel.addControl(textBlock1);

    // 第二部分：两个按钮，同一水平线，占长方形高度的15%
    var button1 = new GUI.Button("button1", "按钮1");
    button1.width = "40%";
    button1.height = "5%";
    button1.background = 'rgba(128, 128, 128, 1)';
    button1.paddingTopInPixels = 280;
    button1.paddingLeftInPixels = 0;
    button1.onPointerUpObservable.add(function() {
        console.log(1);
    });
    panel.addControl(button1);

    var button2 = new GUI.Button("button2", "按钮2");
    button2.width = "40%";
    button2.height = "5%";    
    button2.background = 'rgba(128, 64, 128, 1)';
    button2.paddingTopInPixels = 180;
    button2.paddingRightInPixels = 0;
    button2.onPointerUpObservable.add(function() {
        console.log(2);
    });
    panel.addControl(button2);

    // 第三部分：文本显示，占长方形高度的70%
    var textBlock2 = new GUI.TextBlock();
    textBlock2.text = "第三部分";
    textBlock2.height = "70%";
    panel.addControl(textBlock2);
}

function createLabel2()
{
    const selectBox = new GUI.SelectionPanel("selectBox");
    selectBox.width = 0.25;
    selectBox.height = 0.52;
    selectBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    selectBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    advancedTexture.addControl(selectBox);
}

createLabel2();

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
    "Draco.glb",
    scene,
    function (Meshes) {
        var importedMesh = Meshes[0];
        console.log(importedMesh)
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
            hydrogenProductionModule.actionManager = null;
            purificationModule.actionManager = null;
            airControlModule.actionManager = null;
            childMesh.forEach(function (mesh){
                mesh.actionManager = null;
            })
            break;
        case BABYLON.PointerEventTypes.POINTERUP:
            hydrogenProductionModule.actionManager = actionManager;
            purificationModule.actionManager = actionManager;
            airControlModule.actionManager = actionManager;
            childMesh.forEach(function (mesh){
                mesh.actionManager = actionManager;
            })
            break;
        case BABYLON.PointerEventTypes.POINTERPICK:
            hydrogenProductionModule.actionManager = actionManager;
            purificationModule.actionManager = actionManager;
            airControlModule.actionManager = actionManager;
            childMesh.forEach(function (mesh){
                mesh.actionManager = actionManager;
            })
            break;
    }
});

const light = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(1,-1,0),//光源方向
    scene
);
light.intensity = 10;


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
