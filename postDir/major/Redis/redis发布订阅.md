# redis发布订阅
## 📌 Redis 发布/订阅（Pub/Sub）机制

### 1. 概念

- **发布者（Publisher）**：往某个 channel 发送消息。
    
- **订阅者（Subscriber）**：订阅一个或多个 channel，监听消息。
    
- **Redis**：消息路由转发，不存储消息（即消息是 **实时** 的，错过就收不到）。
    

👉 类似 **消息广播**，但和 Kafka、RabbitMQ 不一样，Redis Pub/Sub **不做持久化**。

---

### 2. Redis 原生命令

- 订阅频道：
    
    ```bash
    SUBSCRIBE myChannel
    ```
    
- 发布消息：
    
    ```bash
    PUBLISH myChannel "Hello World"
    ```
    
- 取消订阅：
    
    ```bash
    UNSUBSCRIBE myChannel
    ```
    

---

## 📌 Spring Data Redis 实现 Pub/Sub

### 1. 发布消息

直接用 `RedisTemplate.convertAndSend()`：

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

public void publishMessage(String channel, String message) {
    redisTemplate.convertAndSend(channel, message);
}
```

---

### 2. 订阅消息

在 Spring 里有两种常见方式：

#### ✅ 方式一：实现 `MessageListener`

```java
@Component
public class RedisSubscriber implements MessageListener {

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = new String(message.getChannel());
        String body = new String(message.getBody());
        System.out.printf("收到消息: channel=%s, body=%s%n", channel, body);
    }
}
```

注册监听器：

```java
@Configuration
public class RedisPubSubConfig {

    @Bean
    public RedisMessageListenerContainer container(
            RedisConnectionFactory connectionFactory,
            RedisSubscriber subscriber) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // 订阅频道 myChannel
        container.addMessageListener(subscriber, new ChannelTopic("myChannel"));
        return container;
    }
}
```

---

#### ✅ 方式二：注解方式（更简洁）

Spring Boot 2.2+ 可以用 `@EnableRedisRepositories` + `@RedisHash` 方式，但 **Pub/Sub 更推荐用 MessageListenerContainer**。

---

### 3. 使用示例

- 发布：
    

```java
@RestController
@RequestMapping("/pub")
public class PubController {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/{msg}")
    public String send(@PathVariable String msg) {
        redisTemplate.convertAndSend("myChannel", msg);
        return "消息已发布: " + msg;
    }
}
```

- 订阅端日志输出：
    

```text
收到消息: channel=myChannel, body=HelloWorld
```

---

## 📌 应用场景

- **广播通知**（如系统公告、即时消息）
    
- **实时日志推送**
    
- **轻量级消息队列（但不可靠，不能持久化）**
    

⚠️ 如果需要 **可靠性 + 消息持久化** → 建议用 **Redis Stream / Kafka / RabbitMQ**
