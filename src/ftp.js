import ftp from 'ftp';
import fs from 'fs';

// 创建一个新的 FTP 客户端实例
const client = new ftp();

// 连接到本地的 FTP 服务器
client.connect({
    host: '192.168.0.174',
    port: 21,
    user: '15968',
    password: 'yukuai000',
    compress:false
});

// 处理 FTP 连接成功事件
client.on('ready', () => {
    console.log('已成功连接到 FTP 服务器');

    client.list((err,files)=>{
        if(err){
            console.log(err);
            return;
        }

        if(Array.isArray(files)){
            files.forEach((file)=>{
                console.log(file.name);
            })
        }
    })

    client.get('123.txt', (err, stream) => {
        if (err) {
            console.error(err);
            return;
        }
        // 保存到本地文件
        stream.pipe(fs.createWriteStream('../public/ftp/test.txt'));
        // 下载完成时的处理
        stream.on('end', () => {
            console.log('文件下载成功');
            // 断开与 FTP 服务器的连接
            client.end();
        });
    });
});

// 处理 FTP 连接错误事件
client.on('error', (err) => {
    console.log('无法连接到 FTP 服务器：', err);
});
