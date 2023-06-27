FROM test:latest

# 设置环境变量
ENV PYTHONUNBUFFERED=1
ENV DM_HOME=/dm8
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/dm8/drivers/dpi/
ENV LANG=zh_CN.UTF-8
WORKDIR /app

# 安装依赖项
RUN apt update
RUN apt install language-pack-zh-hans -y

COPY ./resources/rclone-v1.62.2-linux-amd64.deb /
RUN dpkg -i /rclone-v1.62.2-linux-amd64.deb
RUN mkdir -p /root/.config/rclone
RUN echo [hdp] >> /root/.config/rclone/rclone.conf
RUN echo type = hdfs >> /root/.config/rclone/rclone.conf
RUN echo namenode = hadoopa-namenode.damenga-zone.svc:9000 >> /root/.config/rclone/rclone.conf
RUN echo username = root >> /root/.config/rclone/rclone.conf


RUN apt autoremove -y
RUN rm /rclone-v1.62.2-linux-amd64.deb

RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade pip
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple django pandas minio mysql-connector-python openpyxl django-cors-headers

COPY ./api /app

EXPOSE 8000

CMD python3 manage.py runserver 0.0.0.0:8000
