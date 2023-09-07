from flask import Flask, jsonify, request
from ftplib import FTP
from config import ftp_config
import os

app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def get_data():
    data = {'message': 'Hello from Flask'}
    return jsonify(data)

def setup():  # 连接ftp服务器并下载json文件
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


setup()


if __name__ == '__main__':
    app.run(host='192.168.0.174', port='8003', debug=True)

