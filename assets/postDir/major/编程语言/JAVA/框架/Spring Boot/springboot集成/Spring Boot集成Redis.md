## 一、添加依赖

 Maven：
```xml
<!-- 添加 Spring Boot Redis Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- 可选：使用 FastJson 或 Jackson 作为 Redis 的序列化方式 -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>

```
Gradle:
```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    implementation 'com.fasterxml.jackson.core:jackson-databind' // 可选：用于 Redis 对象序列化
}

```
## 二. 配置 Redis
```yaml
spring:
  redis:
    host: 127.0.0.1
    port: 6379
    password: 你的密码（没有可留空）
    timeout: 5000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 1

```
可以在spring boot中自行配置redisConfig，指定序列化配置
默认情况下可以直接使用redisTemplate或者stringRedisTemplate，但不进行配置，自行序列化数据方面不太好看（二进制乱码）
```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        // JSON 序列化配置
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        template.setDefaultSerializer(serializer);
        return template;
    }
}
```

