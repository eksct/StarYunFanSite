# Docker 镜像详解

## 什么是镜像（Image）

**镜像** 是一种轻量级、可执行的独立软件包，用于打包应用程序及其运行环境。它包含了运行某个程序所需的一切内容，例如：

- 应用代码
- 运行时环境
- 系统工具
- 系统库
- 配置文件

镜像是 **容器的基础**，容器的运行就是基于镜像的实例化。

---

## 镜像与容器的区别

| 特性 | 镜像（Image） | 容器（Container） |
|------|---------------|-------------------|
| 性质 | 只读模板，静态的 | 镜像的运行实例，动态的 |
| 类比 | 类似于类的定义 | 类似于类的对象 |
| 存储 | 分层存储，不可变 | 在镜像基础上添加可写层 |
| 生命周期 | 持久存在 | 可以启动、停止、删除 |

---

## 镜像的分层机制

### UnionFS 分层结构

Docker 镜像采用 **UnionFS 分层结构**：

- 每一层是只读的，多个镜像可以共享相同的底层
- 容器运行时会在镜像上方添加一层可写层（Writable Layer）
- 分层机制让镜像的存储和分发更高效

### 分层优势

1. **存储效率**：相同的基础层可以被多个镜像共享
2. **传输效率**：只需要传输不同的层
3. **构建效率**：可以利用缓存，只重新构建变更的层

### 提交机制

```bash
# 提交容器为镜像
docker commit <容器ID> <镜像名:标签>
```

提交时，实际上是把容器的写入层保存为新的镜像层。

---

## 镜像的基本操作

### 1. **查看镜像**

```bash
# 查看本地镜像
docker images
docker image ls

# 查看镜像详细信息
docker inspect <镜像名:标签>

# 查看镜像历史
docker history <镜像名:标签>
```

### 2. **搜索镜像**

```bash
# 在 Docker Hub 搜索镜像
docker search nginx
docker search python
```

### 3. **删除镜像**

```bash
# 删除单个镜像
docker rmi <镜像名:标签>
docker image rm <镜像名:标签>

# 删除所有镜像
docker rmi $(docker images -q)

# 删除悬空镜像（dangling images）
docker image prune
```

### 4. **镜像标签管理**

```bash
# 给镜像打标签
docker tag <源镜像> <新标签>

# 示例
docker tag nginx:latest mynginx:v1.0
```

---

## 获取镜像的方式

### 1. **从远程仓库下载**

#### Docker Hub（官方公共仓库）

```bash
# 下载最新版本
docker pull nginx:latest
docker pull mysql:8.0
docker pull python:3.10

# 下载指定版本
docker pull nginx:1.20
docker pull mysql:8.0.25
```

#### 私有仓库

```bash
# 从私有仓库下载
docker pull registry.company.com/myapp:v1.0

# 登录私有仓库
docker login registry.company.com
```

### 2. **自己制作**

使用 `Dockerfile` 定义镜像的构建步骤：

```bash
# 构建镜像
docker build -t myapp:1.0 .

# 指定 Dockerfile 路径
docker build -f /path/to/Dockerfile -t myapp:1.0 .
```

### 3. **镜像导入导出**

#### 导出镜像

```bash
# 导出单个镜像
docker save -o myapp.tar myapp:1.0

# 导出多个镜像
docker save -o images.tar nginx:latest mysql:8.0

# 使用压缩
docker save myapp:1.0 | gzip > myapp.tar.gz
```

#### 导入镜像

```bash
# 导入镜像
docker load -i myapp.tar

# 从压缩文件导入
gunzip -c myapp.tar.gz | docker load
```

---

## 镜像推送与分发

### 1. **推送到 Docker Hub**

#### 准备工作

```bash
# 登录 Docker Hub
docker login

# 输入用户名和密码
Username: yourusername
Password: ********
```

#### 推送镜像

```bash
# 给镜像打标签（必须包含用户名）
docker tag myapp:1.0 yourusername/myapp:1.0

# 推送到 Docker Hub
docker push yourusername/myapp:1.0

# 推送多个标签
docker push yourusername/myapp:latest
docker push yourusername/myapp:1.0
```

### 2. **推送到私有仓库**

#### 搭建私有仓库

```bash
# 启动私有仓库
docker run -d -p 5000:5000 --name registry registry:2

# 或使用 Docker Compose
version: '3'
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    volumes:
      - registry-data:/var/lib/registry

volumes:
  registry-data:
```

#### 推送到私有仓库

```bash
# 给镜像打标签
docker tag myapp:1.0 localhost:5000/myapp:1.0

# 推送到私有仓库
docker push localhost:5000/myapp:1.0

# 从私有仓库拉取
docker pull localhost:5000/myapp:1.0
```

### 3. **企业级镜像仓库**

#### Harbor（推荐）

```bash
# 登录 Harbor
docker login harbor.company.com

# 推送镜像
docker tag myapp:1.0 harbor.company.com/project/myapp:1.0
docker push harbor.company.com/project/myapp:1.0
```

#### Nexus Repository

```bash
# 配置 Docker 仓库
# 在 Nexus 中创建 Docker 仓库后使用
docker tag myapp:1.0 nexus.company.com:8081/myapp:1.0
docker push nexus.company.com:8081/myapp:1.0
```

---

## 镜像的版本管理

### 1. **标签策略**

```bash
# 语义化版本
myapp:1.0.0
myapp:1.0.1
myapp:2.0.0

# 环境标签
myapp:dev
myapp:test
myapp:prod

# 时间标签
myapp:2024-01-15
myapp:20240115

# 分支标签
myapp:main
myapp:feature-auth
```

### 2. **多架构镜像**

```bash
# 构建多架构镜像
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:1.0 --push .
```

### 3. **镜像签名**

```bash
# 使用 Docker Content Trust
export DOCKER_CONTENT_TRUST=1
docker push myapp:1.0
```

---

## 镜像优化策略

### 1. **选择合适的基础镜像**

```dockerfile
# 推荐：使用 Alpine
FROM python:3.10-alpine

# 避免：使用完整 Ubuntu
FROM ubuntu:20.04
```

### 2. **多阶段构建**

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

### 3. **清理缓存**

```dockerfile
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

### 4. **使用 .dockerignore**

```dockerignore
.git
node_modules
*.log
.env
.DS_Store
coverage/
```

---

## 镜像安全最佳实践

### 1. **基础镜像安全**

```bash
# 扫描镜像漏洞
docker scan myapp:1.0

# 使用安全的基础镜像
FROM python:3.10-slim
```

### 2. **最小权限原则**

```dockerfile
# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### 3. **镜像签名验证**

```bash
# 验证镜像签名
docker trust inspect myapp:1.0
```

---

## 常见问题

### 1. **如何减小镜像大小？**

- 使用 Alpine 基础镜像
- 多阶段构建
- 清理不必要的文件和缓存
- 使用 .dockerignore

### 2. **如何提高镜像构建速度？**

- 合理利用层缓存
- 并行安装依赖
- 使用构建缓存
- 优化 Dockerfile 指令顺序

### 3. **如何管理镜像版本？**

- 使用语义化版本号
- 为不同环境打不同标签
- 定期清理旧版本镜像

### 4. **如何备份和恢复镜像？**

```bash
# 备份
docker save -o backup.tar myapp:1.0

# 恢复
docker load -i backup.tar
```

---

## 总结

Docker 镜像是容器化应用的核心，掌握镜像的创建、管理、推送和优化对于构建高效的容器化应用至关重要。通过合理使用镜像分层机制、选择合适的构建策略和遵循安全最佳实践，可以创建出高质量、安全的生产级镜像。