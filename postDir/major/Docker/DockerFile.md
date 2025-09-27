

Dockerfile 是用于构建 Docker 镜像的脚本文件，包含了用户可以在命令行中调用的所有命令。Docker 可以通过这个脚本生成镜像，设定环境变量，运行指令等。

通过 `docker build` 命令读取 `Dockerfile` 并生成镜像。

---

## Dockerfile 基本语法

### 构建命令

```bash
docker build -f <dockerfile文件路径> -t <镜像名:TAG> <构建上下文>
```

### 基本规则

- 指令必须大写
- 执行从上到下
- `#` 表示注释
- 每个指令都会创建一个镜像层（构建镜像时展示的一行行操作）

---

## Dockerfile 常用指令详解

### 1. **FROM**

指定基础镜像（必须是 Dockerfile 的第一条指令）。

```dockerfile
FROM ubuntu:20.04
FROM node:18-alpine
FROM python:3.10-slim
```

### 2. **LABEL**

为镜像添加元数据（作者、版本、描述等）。

```dockerfile
LABEL maintainer="yourname@example.com"
LABEL version="1.0"
LABEL description="这是一个示例镜像"
```

### 3. **RUN**

执行命令并生成新的镜像层（通常用于安装依赖）。

```dockerfile
RUN apt-get update && apt-get install -y python3 python3-pip
RUN npm install
RUN pip install -r requirements.txt
```

### 4. **WORKDIR**

设置容器内的工作目录（相当于 `cd`）。

```dockerfile
WORKDIR /app
WORKDIR /usr/src/app
```

### 5. **COPY & ADD**

将文件复制到镜像中：

```dockerfile
# COPY - 仅复制文件/目录
COPY ./src /app/src
COPY requirements.txt /app/

# ADD - 可解压 tar 包或下载 URL
ADD ./app.tar.gz /app/
ADD https://example.com/file.tar.gz /app/
```

**区别**：
- `COPY` 只能复制本地文件
- `ADD` 支持 URL 下载和自动解压

### 6. **ENV**

设置环境变量：

```dockerfile
ENV APP_ENV=production
ENV PATH="/usr/local/bin:${PATH}"
ENV NODE_ENV=production
```

### 7. **EXPOSE**

声明容器对外暴露的端口（仅声明，不自动映射）。

```dockerfile
EXPOSE 8080
EXPOSE 3000 5000
```

### 8. **VOLUME**

定义挂载点，用于持久化存储。

```dockerfile
VOLUME /var/lib/mysql
VOLUME ["/app/data", "/app/logs"]
```

### 9. **ENTRYPOINT**

定义容器的入口命令，通常是主进程。

```dockerfile
ENTRYPOINT ["python3", "app.py"]
ENTRYPOINT ["java", "-jar", "app.jar"]
```
**为什么需要入口命令？**
容器生命周期管理：容器需要知道启动后要做什么
- 应用服务化：将应用程序包装成服务
- 标准化部署：统一的启动方式
- 资源管理：Docker 可以监控主进程的状态

### 10. **CMD**

容器启动时默认执行的命令，可以被 `docker run` 的参数覆盖。

```dockerfile
CMD ["npm", "start"]
CMD ["python", "app.py"]
CMD ["echo", "Hello World"]
```

**ENTRYPOINT vs CMD**：
- `ENTRYPOINT` 用于固定入口点（不可轻易被覆盖）
- `CMD` 提供默认参数，可以被覆盖
- 可以同时使用：`ENTRYPOINT ["python"]` + `CMD ["app.py"]`

### 11. **ARG**

构建时参数（仅在 `docker build` 阶段生效）。

```dockerfile
ARG APP_VERSION=1.0
ARG NODE_VERSION=18
RUN echo "Building version $APP_VERSION"
```

构建时传递：

```bash
docker build --build-arg APP_VERSION=2.0 -t myapp:2.0 .
```

### 12. **USER**

指定运行容器时的用户名或 UID。

```dockerfile
USER node
USER 1000
```

### 13. **HEALTHCHECK**

定义容器健康检查。

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

---

## 完整示例 Dockerfile

### Python Flask 应用

```dockerfile
# 1. 基础镜像
FROM python:3.10-slim

# 2. 镜像信息
LABEL maintainer="you@example.com"
LABEL version="1.0"

# 3. 设置工作目录
WORKDIR /app

# 4. 设置环境变量
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# 5. 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 6. 拷贝依赖并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 7. 拷贝应用代码
COPY . .

# 8. 创建非 root 用户
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# 9. 声明端口
EXPOSE 5000

# 10. 定义卷
VOLUME /app/data

# 11. 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# 12. 启动命令
CMD ["python", "app.py"]
```

### Node.js 应用

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
```

---

## Dockerfile 最佳实践

### 1. **选择轻量级基础镜像**

```dockerfile
# 推荐
FROM python:3.10-alpine
FROM node:18-alpine

# 避免
FROM ubuntu:20.04
```

### 2. **合并 RUN 指令**

```dockerfile
# 推荐 - 减少层数
RUN apt-get update && \
    apt-get install -y curl vim && \
    rm -rf /var/lib/apt/lists/*

# 避免 - 创建多个层
RUN apt-get update
RUN apt-get install -y curl vim
RUN rm -rf /var/lib/apt/lists/*
```

### 3. **使用 .dockerignore**
排除不必要的文件
创建 `.dockerignore` 文件：

```dockerignore
.git
node_modules
*.log
.env
.DS_Store
coverage/
.nyc_output/
```

### 4. **固定版本**

```dockerfile
# 推荐 - 固定版本
RUN pip install flask==2.3.0
FROM node:18.16.0-alpine

# 避免 - 使用 latest
FROM node:latest
RUN pip install flask
```

### 5. **分阶段构建 (Multi-stage builds)**

```dockerfile
# 构建阶段
FROM golang:1.20 AS builder
WORKDIR /build
COPY . .
RUN go build -o app

# 运行阶段
FROM alpine:3.18
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /build/app .
CMD ["./app"]
```

### 6. **优化层缓存**

```dockerfile
# 推荐 - 依赖文件先复制
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# 避免 - 代码变更导致依赖重新安装
COPY . .
RUN pip install -r requirements.txt
```

### 7. **使用非 root 用户**

```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### 8. **设置健康检查**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

---

## 常见问题

### 1. **如何减小镜像大小？**

- 使用 Alpine 基础镜像
- 多阶段构建
- 清理缓存和临时文件
- 使用 .dockerignore

### 2. **如何提高构建速度？**

- 合理利用层缓存
- 并行安装依赖
- 使用构建缓存

### 3. **如何调试 Dockerfile？**

```bash
# 构建时查看详细输出
docker build --no-cache -t myapp .

# 进入容器调试
docker run -it myapp /bin/bash
```

---

## 总结

Dockerfile 是容器化应用的核心配置文件，掌握其语法和最佳实践对于构建高效、安全的 Docker 镜像至关重要。通过合理使用各种指令和遵循最佳实践，可以创建出高质量的生产级镜像。