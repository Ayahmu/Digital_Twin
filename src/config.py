ftp_config = {
    'host': '192.168.0.174',
    'port': '21',
    'user': '15968',
    'password': 'yukuai000',
    'compress': False,  # 是否启用数据传输压缩功能
    'json': {
        'file_path': '/path/to/json',  # json文件在ftp服务器的路径位置
        'file_name': 'HydrogenSysInfo.json'       # json文件名
    }
}

mqtt_config = {
    'url': 'broker.emqx.io',
    'topic': 'test/topic'
}

backend_config = {
    'host': '192.168.0.174',
    'port': '8003'
}
