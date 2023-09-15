export var mqtt_config = {
    host: "broker.emqx.io",
    port: 8083,
    clientId: "yourClientId",
    topic: "test/topic",
}

export var http_config = {
    url: "http://localhost:3000/public" //http服务器上的静态资源目录
    /*method: "POST",
    headers: {
        'Content-Type': 'application/json'
    }*/
}