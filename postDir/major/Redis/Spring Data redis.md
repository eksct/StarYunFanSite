spring提供的对不同redis客户端的整合(lettuce和jredis)
提供redisTemplate统一API操作
支持redis的发布订阅
支持Redis哨兵和Redis集群
支持基于Lettuce的响应式编程
支持基于JDK、JSON、字符串、Spring对象的数据序列化及反序列化
支持基于Redis的JDKCollection实现
## 一、快速入门
1.引入redis
```xml
<!--meavn-->
<!--Redis依赖-->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactid>spring-boot-starter-data-redis</artifactid>
</dependency>
<!--连接池依赖-->
<dependency>
	<groupId>org.apache.commons</groupId>
	<artifactId>commons-pool2</artifactId>
</dependency>
```
```gradle

```
2.修改redis客户端连接驱动
lettuce
```xml
<dependencies>

  <!-- other dependency elements omitted -->

  <dependency>
    <groupId>io.lettuce</groupId>
    <artifactId>lettuce-core</artifactId>
    <version>6.6.0.RELEASE</version>
  </dependency>

</dependencies>
```

```java
//配置连接工厂
@Configuration
class AppConfig {

  @Bean
  public LettuceConnectionFactory redisConnectionFactory() {

    return new LettuceConnectionFactory(new RedisStandaloneConfiguration("server", 6379));
  }
}
```
jredis
```xml
<dependencies>

  <!-- other dependency elements omitted -->

  <dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>6.0.0</version>
  </dependency>

</dependencies>
```

```java
@Configuration
class RedisConfiguration {

  @Bean
  public JedisConnectionFactory redisConnectionFactory() {

    RedisStandaloneConfiguration config = new RedisStandaloneConfiguration("server", 6379);
    return new JedisConnectionFactory(config);
  }
}
```
看起来jedis是最简单的配置
3.配置文件编写
```yml
spring:
	redis:
		host:192.168.150.101
		port:6379
		password:123321lettuce:
		pool:
			max-active:8#最大连接
			max-idle:8#最大空闲连接
			min-idle:0#最小空闲连接
			max-wait:100#连接等待时间
```
4.使用示例
```java
//注入redisTemplate
@resource
private RedisTemplate redisTemplate;
//插入一条string数据
redisTemplate.opsForValue().set("name","ls")
//读取key=name的数据
Object name = redisTemplate.opsForValue().get("name")

```

5.Spring Data Redis API 对照表

| API（RedisTemplate）    | Redis 数据类型      | 说明                                         |
| --------------------- | --------------- | ------------------------------------------ |
| `opsForValue()`       | **String**      | 操作 Redis 的字符串（key-value），最常用的 KV 存储。       |
| `opsForHash()`        | **Hash**        | 操作哈希表，类似 `Map`，可在一个 key 下存储多个 field-value。 |
| `opsForList()`        | **List**        | 操作列表，支持左/右 push、pop 等，用作队列或栈。              |
| `opsForSet()`         | **Set**         | 操作集合，存储不重复元素，支持交集、并集、差集。                   |
| `opsForZSet()`        | **Sorted Set**  | 操作有序集合，每个元素带一个 score，可按权重排序。               |
| `opsForGeo()`         | **Geo**         | 操作地理空间数据，存储经纬度，支持距离计算、范围查询。                |
| `opsForHyperLogLog()` | **HyperLogLog** | 操作基数统计，用于近似计算唯一值数量。                        |
| `opsForCluster()`     | **Cluster**     | 集群相关操作，主要用于 Redis 集群环境。                    |
| `opsForStream()`      | **Stream**      | 操作 Redis Stream（消息队列/日志型结构）。               |
```java
//例子
// String
redisTemplate.opsForValue().set("key", "value");

// Hash
redisTemplate.opsForHash().put("user:1", "name", "Alice");

// List
redisTemplate.opsForList().leftPush("tasks", "task1");

// Set
redisTemplate.opsForSet().add("tags", "java", "spring");

// ZSet
redisTemplate.opsForZSet().add("ranking", "Alice", 100);

// Geo
redisTemplate.opsForGeo().add("locations", new Point(116.40, 39.90), "Beijing");

// HyperLogLog
redisTemplate.opsForHyperLogLog().add("unique_users", "user1", "user2");

// Stream
RecordId recordId = redisTemplate.opsForStream().add(
    StreamRecords.newRecord()
                 .in("mystream")
                 .ofObject("eventData")
);

```
## 二、自定义redis序列化配置
Spring 已经提供了一个现成的模板：StringRedisTemplate 键值都是string，不适合存储对象
需要存储对象的话，则需要使用json序列化器
（然鹅，为了后续的反序列化，redis中会存入对象的class，导致字节占用较大；通常是用json工具转成json字符串后再存入）
自定义序列化Bean：
```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 使用 String 序列化 key
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // 使用 JSON 序列化 value
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        return template;
    }
}

```
其他可选序列化

| 序列化器                                 | 说明                         | 适用场景          |
| ------------------------------------ | -------------------------- | ------------- |
| `StringRedisSerializer`              | 以 UTF-8 字符串方式存储            | 最常用的 key 序列化器 |
| `JdkSerializationRedisSerializer`    | Java 原生序列化                 | 默认方式（但不推荐）    |
| `Jackson2JsonRedisSerializer`        | Jackson JSON 序列化           | 跨语言，推荐存对象     |
| `GenericJackson2JsonRedisSerializer` | Jackson JSON 通用序列化（包含类型信息） | 推荐，比上面的更通用    |
| `OxmSerializer`                      | 使用 JAXB/OXM                | XML 序列化场景     |