# 导入官方 node v18 基础镜像
FROM node:18-alpine

# 设置工作目录为 /app
WORKDIR /app

# 把捆绑后的 web js 文件拷贝到镜像的工作目录
COPY ./dist /app

# 安装依赖项 live-server 用于启动 web 服务
RUN npm i -g live-server

# 启动 web 服务命令
EXPOSE 8080
CMD live-server --entry-file=index.html