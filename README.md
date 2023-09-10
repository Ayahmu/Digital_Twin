# 数字孪生

## 安装说明

1. 克隆项目到本地  
```
git clone https://github.com/Ayahmu/git-test.git
```

2. 进入项目目录
```
cd vite-project
```

3. 创建并激活虚拟环境
```
conda create --name <env_name>
conda activate <env_name>
```
4. 安装项目依赖
```
pip install -r requirements.txt
```
5. 运行后端
```
python src/backend.py
```
6. 运行前端
```
yarn dev
```
7. 打开浏览器访问`http://localhost:5173/`


## 修改配置参数
在src/config.py修改ftp和mqtt连接的参数，包括host和port