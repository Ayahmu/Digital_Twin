import requests
from flask import Flask, jsonify, request
from ftplib import FTP
from config import ftp_config, mqtt_config, backend_config
from flask_cors import CORS, cross_origin

import paho.mqtt.client as mqtt
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.route('/api/data', methods=['POST'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def get_data():
    data = request.get_json()
    print(f'Request received: {data}')  # 检查是否收到请求

    if data is not None:
        message = data.get('data')
        print(f'Message: {message}')  # 检查是否正确解析数据
        # 在这里处理接受到的消息，可以进行任何需要的操作

    response = jsonify({'acknowledged': True})

    return response


def setup_ftp():  # 连接ftp服务器并下载json文件
    try:
        ftp = FTP(ftp_config['host'])
        ftp.login(user=ftp_config['user'], passwd=ftp_config['password'])
        print('成功连接到FTP服务器！')
    except Exception as e:
        print(f'连接到FTP服务器失败：{str(e)}')

    try:
        # 切换到ftp存放json文件的目录
        # ftp.cwd(ftp_config.get('json').get('file_path'))
        file_name = ftp_config.get('json').get('file_name')  # 下载json文件名
        file_path = os.path.join('../public/json', file_name)
        with open(file_path, 'wb') as f:
            ftp.retrbinary('RETR ' + file_name, f.write)
        print('下载文件成功！')
    except Exception as e:
        print(f'下载文件失败：{str(e)}')


# 用于接收到消息时的回调函数
def on_message(client, userdata, msg):
    print("Received message: " + msg.payload.decode())


def setup_mqtt():
    try:
        client = mqtt.Client()
        client.connect(mqtt_config['url'], 1883, 60)
        print('连接mqtt服务器成功！')
    except Exception as e:
        print(f'连接mqtt服务器失败：{str(e)}')
        return

    try:
        topic = mqtt_config['topic']
        client.subscribe(topic)
        client.on_message = on_message

        # 开始监听网络数据
        client.loop_start()
        print(f'订阅主题：{topic} 成功！')
    except Exception as e:
        print(f'订阅主题失败：{str(e)}')
        return


setup_ftp()
setup_mqtt()


if __name__ == '__main__':
    # app.run(port=backend_config['port'])
    # app.run(host='0.0.0.0', port=backend_config['port'], debug=True)
    app.run(host='192.168.0.174', port='8003', debug=True)

