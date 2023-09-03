import './style.css'
//导入babylonjs
import * as BABYLON from "babylonjs";
//导入gltf加载器
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";

//创建canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//将canvas添加到body中
document.body.appendChild(canvas);

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

var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
advancedTexture.renderScale = 1;
let rmLabelBuild = [];

function createLabel(mesh, labelName) {
    var label = new GUI.Rectangle("label for " + labelName);
    label.background = "rgba(0, 0, 0, 1)";
    label.height = "60px";
    label.alpha = 0.6;
    label.width = "300px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = -100;
    advancedTexture.addControl(label);
    label.linkWithMesh(mesh);
    var text1 = new GUI.TextBlock();
    text1.text = labelName;
    text1.color = "white";
    label.addControl(text1);
    highLightLayer.addMesh(mesh,BABYLON.Color3.Blue());
    rmLabelBuild.push(label);
    rmLabelBuild.push(text1);
    models.push(mesh);
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
