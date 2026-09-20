
# Spring for Apache Kafka
## 1️⃣ 引入依赖

在 `pom.xml` 中加上：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-kafka</artifactId>
</dependency>
```

---

## 2️⃣ 配置 Kafka

在 `application.yml` 里写：

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092   # Kafka 地址
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: demo-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      auto-offset-reset: earliest   # 从头开始消费（可选）
```

---

## 3️⃣ 生产者（发送消息）

```java
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public ProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("✅ 发送消息到 " + topic + " ：" + message);
    }
}
```

---

## 4️⃣ 消费者（接收消息）

```java
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {

    @KafkaListener(topics = "test-topic", groupId = "demo-group")
    public void listen(String message) {
        System.out.println("📩 收到消息：" + message);
    }
}
```

---

## 5️⃣ 测试（Controller）

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {

    private final ProducerService producerService;

    public KafkaController(ProducerService producerService) {
        this.producerService = producerService;
    }

    @GetMapping("/send")
    public String send(@RequestParam String msg) {
        producerService.send("test-topic", msg);
        return "消息已发送: " + msg;
    }
}
```

---

## 6️⃣ 测试步骤

1. 启动 Kafka & Zookeeper
    
    ```bash
    bin/zookeeper-server-start.sh config/zookeeper.properties
    bin/kafka-server-start.sh config/server.properties
    ```
    
2. 启动 Spring Boot 项目
    
3. 浏览器访问：
    
    ```
    http://localhost:8080/send?msg=hello-kafka
    ```
    
    👉 控制台应该会看到消费者打印：
    
    ```
    📩 收到消息：hello-kafka
    ```
