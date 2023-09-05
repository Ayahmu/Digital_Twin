// 引入库
import mqtt from 'mqtt';
import config from './config.js'

// 连接 MQTT 代理服务器
const client = mqtt.connect(config.mqtt.url);

// 连接成功的回调函数
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // 订阅主题
    client.subscribe('hello');
});

// 接收到消息的回调函数
client.on('message', (topic, message) => {
    console.log(`Received message on topic: ${topic}`);
    console.log(`Message: ${message.toString()}`);
});

// 断开连接
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
    client.end(); // 结束客户端实例
});