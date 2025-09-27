# **Docker 最常用命令速查表**

| 功能分类     | 命令示例                                                 | 说明                        |
| -------- | ---------------------------------------------------- | ------------------------- |
| **镜像操作** | `docker images`                                      | 查看本地镜像                    |
|          | `docker pull nginx:[latest:版本]`                      | 拉取远程镜像                    |
|          | `docker rmi <镜像ID或名字>`                               | 删除镜像，可以多删                 |
|          | `docker build -t myapp:1.0 .`                        | 从 Dockerfile 构建镜像         |
| **容器操作** | `docker ps`                                          | 查看正在运行的容器                 |
|          | `docker ps -a`                                       | 查看所有容器                    |
|          | `docker run -it --name mycontainer -p 8080:80 nginx` | 运行容器（交互模式 + 端口映射）         |
|          | `docker run -d --name mycontainer -p 8080:80 nginx`  | 后台运行容器,后台运行需要有运行的服务，不然就会寄 |
|          | `docker start <容器ID或名字>`                             | 启动已停止的容器                  |
|          | `docker stop <容器ID或名字>`                              | 停止容器                      |
|          | `docker rm <容器ID或名字>`                                | 删除容器                      |
|          | `docker exec -it <容器名> /bin/bash`                    | 进入容器命令行                   |
|          | `docker logs <容器名>`                                  | 查看容器日志                    |
| **网络操作** | `docker network ls`                                  | 查看网络列表                    |
|          | `docker network create mynet`                        | 创建自定义网络                   |
|          | `docker network rm mynet`                            | 删除网络                      |
| **卷操作**  | `docker volume ls`                                   | 查看卷列表                     |
|          | `docker volume create myvol`                         | 创建卷                       |
|          | `docker volume rm myvol`                             | 删除卷                       |
|          | `docker run -v myvol:/data nginx`                    | 挂载卷到容器                    |
| **清理操作** | `docker container prune`                             | 删除所有停止的容器                 |
|          | `docker image prune -a`                              | 删除所有未使用的镜像                |
|          | `docker system prune`                                | 删除未使用的容器、镜像、网络、卷          |
| **其他常用** | `docker inspect <容器ID或名字>`                           | 查看容器详细信息                  |
|          | `docker stats`                                       | 实时查看容器资源占用                |
|          | `docker top <容器ID或名字>`                               | 查看容器内进程                   |
|          | `docker cp <容器>:<路径> <本地路径>`                         | 容器与本地复制文件                 |

---

如果你需要，我可以帮你做一个 **更精简的单页速查表**，打印出来就能随手查，里面只保留 **90%日常开发最常用命令**，不会太杂。

你希望我帮你做吗？