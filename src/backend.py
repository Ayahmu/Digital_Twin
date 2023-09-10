import threading

import requests
from flask import Flask, jsonify, request
from ftplib import FTP
from config import ftp_config, mqtt_config, backend_config
from flask_cors import CORS, cross_origin
import time

import paho.mqtt.client as mqtt
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
ftp = FTP(ftp_config['host'])


@app.route('/api/data', methods=['POST'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def get_data():
    data = request.get_json()

    if data is not None:
        message = data.get('Manual')
        print(f'Manual: {message}')  # 检查是否正确解析数据

        # 下载pdf文件
        try:
            file_name = message
            file_path = os.path.join('../public/pdf/', file_name)

            if os.path.isfile(file_path):
                print(f'已使用本地文件{file_path}！')
                return jsonify({'status': '本地文件', 'path': file_path})
            else:
                with open(file_path, 'wb') as f:
                    ftp.retrbinary('RETR ' + message, f.write)
                print(f'下载{message}成功！')
                return jsonify({'status': '成功', 'path': file_path})
        except Exception as err:
            print(f'下载{message}文件失败：{str(err)}')
            if os.path.isfile(file_path):
                print(f'已使用本地文件{file_path}！')
                return jsonify({'status': '本地文件', 'path': file_path})
            else:
                print(f'本地文件{file_path}不存在！')
                return jsonify(({'status': '失败'}))


@app.route('/api/warning', methods=['POST'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def get_warning():
    return {'isWarning': isWarning}


def setup_ftp():  # 连接ftp服务器并下载json文件
    try:
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
        return


isWarning = False
lastTimeReceived = None


# 接受报警信息、设置报警标志位
def on_message(client, userdata, msg):
    global isWarning, lastTimeReceived
    isWarning = True
    lastTimeReceived = time.time()
    print("收到报警信息！")


# 每5s检查一次报警信息，如果没有报警，则设置报警标志位
def check_warning():
    global isWarning, lastTimeReceived
    if isWarning and time.time() - lastTimeReceived > 5:
        isWarning = False
        print("报警信息消失！")
    threading.Timer(5, check_warning).start()


def setup_mqtt():
    try:
        client = mqtt.Client()
        client.connect(mqtt_config['url'], mqtt_config['port'], 60)
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


def download_ftp(file_name):
    try:
        file_name = ftp_config.get('json').get('file_name')  # 下载json文件名
        file_path = os.path.join('../public/json', file_name)
        with open(file_path, 'wb') as f:
            ftp.retrbinary('RETR ' + file_name, f.write)
        print('下载文件成功！')
    except Exception as e:
        print(f'下载文件失败：{str(e)}')
        return


setup_ftp()
setup_mqtt()
check_warning()

if __name__ == '__main__':
    # app.run(port=backend_config['port'])
    # app.run(host='0.0.0.0', port=backend_config['port'], debug=True)
    app.run(host=backend_config['host'], port=backend_config['port'], debug=True)
