#!/bin/bash

# 检查执行权限
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# 设置变量
REPO_URL="https://github.com/rapRabbit/admin.git"
PROJECT_DIR="/home/hoyiping128/admin"
NGINX_CONTAINER="admin"

# 如果目录不存在则克隆，存在则拉取最新代码
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Cloning repository..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
else
    echo "Pulling latest changes..."
    cd $PROJECT_DIR
    git pull
fi

# 构建后端
cd $PROJECT_DIR/admin
npm install
npm run build

# 复制构建文件到 Nginx 容器
docker cp $PROJECT_DIR/admin/dist/. $NGINX_CONTAINER:/usr/share/nginx/html/admin/

# 重启 Nginx 容器
docker restart $NGINX_CONTAINER

echo "Deployment completed!"