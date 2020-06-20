### 基于 socket.io 和 vue 搭建的实时文本聊天平台（客户端）

目前支持：
- 加入广播室
- 广播消息
- 一对一私聊
- 创建群组
- 加入群组
- 群聊

出于兴趣，花了几个小时搭建了这个简单的 websocket 客户端，还有很多细节待完善。另外，基于 nodejs 和 socket.io 搭建的配套服务端项目在 [websocket-chat-server](https://github.com/Zenfeder/websocket-chat-server)，有兴趣的话可以把两个项目一起跑起来玩玩。


### 开发与构建

``` bash
# 安装依赖
npm install

# 本地运行
npm run dev

# 生产环境打包
npm run build

# 生产环境打包，并生成分析报告
npm run build --report
```

> 注意： 本地开发模式`npm run dev`的时候可以设置环境变量 ***DEV_API_PATH***来指定开发模式下连接的服务端接口 ***host***，默认值为 `http://127.0.0.1:8081`，默认值可在 *build/webpack.dev.conf.js*中修改。