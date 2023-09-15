import {objectArray, idToIndexMap} from './main.js'
import {mqtt_config, http_config} from "./config.js";
import path from 'path-browserify'

var host = mqtt_config.host;  // MQTT服务器地址
var port = mqtt_config.port;  // MQTT服务器端口
var clientId = mqtt_config.clientId;  // 客户端ID
var topic = mqtt_config.topic; //MQTT服务器订阅主题

var url = http_config.url;
var method = http_config.method;
var headers = http_config.headers;

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

//接收消息
client.onMessageArrived = function (message){
    console.log('收到消息:', message.destinationName, message.payloadString);
};

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
            return "名称：" + targetObject.Name + "\n" + "信息：" + targetObject.Info;
        }else if(property === 'Manual'){
            return targetObject.Manual;
        }

    }else {
        return "暂无设备信息"
    }
}

export function getPDF(labelName){
    let Manual = getJson(labelName,'Manual');
    let file_path = path.join(http_config.url, Manual);
    file_path = file_path.replace('http:/','http://');
    console.log(file_path);
    window.open(file_path, '_blank');
}
