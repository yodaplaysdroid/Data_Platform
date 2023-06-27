# 导入 dmbase 镜像为底层镜像
# 从 resouces 里的 dmbase.tar.gz 镜像
# 通过 docker import dmbase.tar.gz dmbase 可加载镜像
# 此镜像包含了 dm8 数据库服务（不包含数据库实例）以及已安装好的 Python 接口
FROM dmbase:latest

# 设置环境变量
ENV PYTHONUNBUFFERED=1
ENV DM_HOME=/dm8
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/dm8/drivers/dpi/
ENV LANG=zh_CN.UTF-8
WORKDIR /app

# 安装依赖项
# 环境语言设置（为了支持 gbk enconding）
RUN apt update
RUN apt install language-pack-zh-hans -y

# 安装 rclone （hdfs 接口）
COPY ./resources/rclone-v1.62.2-linux-amd64.deb /
RUN dpkg -i /rclone-v1.62.2-linux-amd64.deb
RUN mkdir -p /root/.config/rclone
RUN echo [hdp] >> /root/.config/rclone/rclone.conf
RUN echo type = hdfs >> /root/.config/rclone/rclone.conf
RUN echo namenode = hadoopa-namenode.damenga-zone.svc:9000 >> /root/.config/rclone/rclone.conf
RUN echo username = root >> /root/.config/rclone/rclone.conf

# 清理不必要的文件（减少镜像大小）
RUN apt autoremove -y
RUN rm /rclone-v1.62.2-linux-amd64.deb

# python 依赖项安装
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade pip
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple django pandas minio mysql-connector-python openpyxl django-cors-headers

# 导入源代码
COPY ./api /app
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

# 公开端口
EXPOSE 8000

# 启动 django 服务
CMD python3 manage.py runserver 0.0.0.0:8000
