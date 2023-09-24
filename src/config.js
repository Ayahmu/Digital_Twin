export var mqtt_config = {
    host: "broker.emqx.io",
    port: 8083,
    clientId: "yourClientId",
    topic: "test/topic",
}

export var http_config = {
    url: "http://localhost:3000/public" //http服务器上的静态资源目录
}

export var camera_config = {
    camera_panningSensibility: 120,     //摄像机平移灵敏度
    camera_wheelPrecision: 2.5          //摄像机滚轮灵敏度
}

export var page_config = {
    url: "http://www.baidu.com"            //跳转页面
}