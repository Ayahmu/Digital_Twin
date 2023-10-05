import {objectArray, idToIndexMap, createWarningMessage, deleteWarningMessage} from './main.js'
import path from 'path-browserify'
import {mqtt_config, http_config} from "./config.js";
import {back_btn} from "./ui.js";

var host = mqtt_config.host;  // MQTT服务器地址
var port = mqtt_config.port;  // MQTT服务器端口
var clientId = mqtt_config.clientId;  // 客户端ID
var topic = mqtt_config.topic; //MQTT服务器订阅主题

var url = http_config.url;

var client = new Paho.MQTT.Client(host, port, clientId);

// 设置连接选项
var connect_options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onConnectFailure
};

client.connect(connect_options);

//设置订阅选项
var subscribe_options={
    qos: 0, //订阅的服务质量等级
    onSuccess: onSubscribe,
    onFailure: onSubscribeFailure,
    timeout: 5000 //订阅操作的超时时间，以毫秒为单位
}

//连接成功回调函数
function onConnect() {
    console.log(`Connected to ${host}`);
    // 连接成功后的操作
    client.subscribe(topic, subscribe_options);
}

// 连接失败回调函数
function onConnectFailure(errorMessage) {
    console.error(`Failed to connect to ${host}: ` + errorMessage.errorMessage);
}

client.onConnectionLost = function (message){
    console.log('连接丢失',message);
    console.log('正在尝试重新连接...');
    setTimeout(()=>{
        client.connect(connect_options);
    },1000);
}

//接收消息
client.onMessageArrived = function (message){
    console.log('收到消息:', message.destinationName, message.payloadString);
    let messageJSON = JSON.parse(message.payloadString);
    let modelID = messageJSON.id;
    let url = messageJSON.url;
    if(!warningMessageArray.has(modelID)){
        createWarningMessage(modelID, url);
    }
    //存入模型id与计时器,存在覆盖
    warningMessageArray.set(modelID, 0);
};

let warningMessageArray = new Map();

setInterval(function() {
    for (let [key, value] of warningMessageArray) {
        console.log(value);
        if (value >= 5) {
            deleteWarningMessage(key);
            warningMessageArray.delete(key);
            break;
        }
        value++;
        warningMessageArray.set(key, value);
    }
}, 1000);

//订阅主题成功回调函数
function onSubscribe(){
    console.log(`Success to subscribe topic: ${topic} `);
}

//订阅主题失败回调函数
function onSubscribeFailure(){
    console.log(`Failed to subscribe topic: ${topic} `)
}


export function getJson(labelName,property){
    let targetObject = objectArray[idToIndexMap[labelName]]

    if(targetObject){
        if(property === 'Name'){
            return targetObject.Name;
        }
        else if(property === 'Info')
        {
            if(targetObject.info){
                return targetObject.info;
            }
            return "暂无设备信息";
        }
        else if(property === 'Url')
        {
            return targetObject.url;
        }
        else if(property === 'Manual'){
            return targetObject.Manual;
        }
        else if(property === 'Animation')
        {
            return targetObject.Animation;
        }

    }else {
        return "暂无设备信息"
    }
}

export function getPDF(labelName){
    let Manual = getJson(labelName,'Manual');

    if(Manual === "暂无设备信息"){
        alert(Manual);
    }else {
        let file_path = path.join(url, Manual);
        file_path = file_path.replace('http:/','http://');
        console.log(file_path);
        window.open(file_path, '_blank');
    }
}

back_btn.onclick = function (){
    const message = {id: "Mesh.1449", url: "http://www.baidu.com"};
    client.send("test/topic",JSON.stringify(message),0,false);
}
