添加依赖
```xml
<dependency>
  <groupId>org.redisson</groupId>
  <artifactId>redisson-spring-boot-starter</artifactId>
  <version>3.23.4</version> <!-- 可换成最新版本 -->
</dependency>

```
配置redisson
```yaml
spring:
  redis:
    host: localhost
    port: 6379

redisson:
  config: |
    singleServerConfig:
      address: "redis://127.0.0.1:6379"

```
注入redisson
```java
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RedisComponent {

    @Autowired
    private RedissonClient redissonClient;

    public void example() {
        // 获取分布式锁
        var lock = redissonClient.getLock("lockKey");

        // 加锁
        lock.lock();

        try {
            // 业务代码
        } finally {
            // 解锁
            lock.unlock();
        }
    }
}

```
### 1. **分布式锁（RLock）**

- **作用**：保证在分布式环境下，同一时刻只有一个进程（线程）能访问某段代码或资源，防止并发冲突。
    
- **场景举例**：多个微服务实例同时操作同一库存，防止超卖。
    
```java
RLock lock = redissonClient.getLock("myLock");
try {
    lock.lock(); // 阻塞加锁
    // 业务临界区代码
} finally {
    lock.unlock();
}
//或带时间
boolean locked = lock.tryLock(3, 10, TimeUnit.SECONDS);
if (locked) {
    try {
        // 业务代码
    } finally {
        lock.unlock();
    }
} else {
    // 未获取锁，处理逻辑
}

```
---

### 2. **读写锁（RReadWriteLock）**

- **作用**：区分读和写操作的锁。允许多个线程同时读（共享锁），但写操作是独占锁。
    
- **场景举例**：数据库缓存更新，允许大量读操作并发，写操作时阻塞所有读写。
    
- 当任意线程持有“读”锁，其他线程可以同时读，但无法获取“写”锁。当任意线程持有“写”锁，其他线程无法获取“读”/“写”锁。
```java
RReadWriteLock rwLock = redissonClient.getReadWriteLock("rwLock");

// 读锁示例
RLock readLock = rwLock.readLock();
readLock.lock();
try {
    // 读业务逻辑
} finally {
    readLock.unlock();
}

// 写锁示例
RLock writeLock = rwLock.writeLock();
writeLock.lock();
try {
    // 写业务逻辑
} finally {
    writeLock.unlock();
}

```
---

### 3. **信号量（RSemaphore）**

- **作用**：控制同时访问某资源的线程数量，相当于“许可证”。
    
- **场景举例**：限制访问某接口的并发数量，比如限流、连接池最大连接数。
    
- 设置最多有多少个线程可以同时访问
```java
RSemaphore semaphore = redissonClient.getSemaphore("semaphoreKey");
semaphore.acquire(); // 获取许可
try {
    // 受限资源操作
} finally {
    semaphore.release(); // 释放许可
}
//设置许可证数量
semaphore.trySetPermits(5); // 最大5个许可

```
---

### 4. **分布式集合（RSet）**

- **作用**：分布式环境下的集合操作，线程安全且数据存储在 Redis 中，方便多个应用共享。
    
- **场景举例**：跨服务共享的黑名单用户列表、唯一值校验集合。
    
```java
RSet<String> mySet = redissonClient.getSet("myDistributedSet");

mySet.add("item1");
mySet.add("item2");

boolean contains = mySet.contains("item1");
mySet.remove("item2");

```
---

### 5. **分布式队列（RQueue）**

- **作用**：分布式消息队列，多个生产者和消费者共享队列，实现异步任务调度。
    
- **场景举例**：订单异步处理、日志异步收集。
    
```java
RQueue<String> queue = redissonClient.getQueue("myDistributedQueue");

// 入队
queue.add("task1");
queue.offer("task2");

// 出队
String task = queue.poll(); // 如果为空返回 null

```
---

### 总结

|工具|主要功能|典型用途|
|---|---|---|
|分布式锁|保证同一资源一次只有一个访问者|分布式环境下同步关键代码块|
|读写锁|多读单写控制|缓存更新同步，读多写少场景|
|信号量|限制并发访问数量|限流、资源池大小限制|
|分布式集合|分布式共享集合操作|共享黑名单、唯一性校验|
|分布式队列|多进程间异步任务排队|异步任务调度、生产者消费者模型|

|功能|Redisson API|说明|
|---|---|---|
|分布式锁|`getLock("key")`|重入锁，支持自动续命|
|读写锁|`getReadWriteLock("key")`|分别获取读锁/写锁|
|信号量|`getSemaphore("key")`|用于资源限流|
|分布式集合|`getSet("key")`|Redis 集合操作封装|
|分布式队列|`getQueue("key")`|Redis 队列操作封装|

---

如果你想，我可以帮你举更具体的代码示例或者实际应用场景！
