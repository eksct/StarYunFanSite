Redis 实现分布式锁，最经典的方式是用 `SET key value NX EX time` 命令，这是一种**轻量级、高性能**的分布式锁实现方式，适用于多数中小规模系统。

---

## 🎯 一、基本目标

> **确保多个进程/线程之间互斥访问某个共享资源**

---

## 📌 二、核心命令

```redis
SET lock_key unique_value NX EX 10
```

### 各参数解释：

|参数|含义|
|---|---|
|`lock_key`|要加锁的资源标识，例如 `order_lock:123`|
|`unique_value`|当前线程/请求的唯一标识（用于后续释放）|
|`NX`|仅在 key 不存在时才设置（确保互斥）|
|`EX 10`|设置自动过期时间（单位秒）防止死锁|

---

## ✅ 三、加锁操作（伪代码）

### 🧱 示例（以 Java 为例，Go/Python 类似）：

```java
String key = "order_lock:123";
String value = UUID.randomUUID().toString(); // 唯一标识
Boolean locked = jedis.set(key, value, "NX", "EX", 10); // 成功返回 "OK"
```

- 若返回 `OK` → 加锁成功
    
- 若返回 `null` → 加锁失败，说明别人持有锁
    

---

## ✅ 四、释放锁操作（必须判断是不是自己加的锁）

不能简单用：

```redis
DEL key
```

这样可能误删别人的锁！

### 正确方式：**先判断 value 是否匹配，再删除（Lua 原子操作）**

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

### Java 调用 Lua：

```java
String lua = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
             "return redis.call('del', KEYS[1]) else return 0 end";
jedis.eval(lua, Collections.singletonList(key), Collections.singletonList(value));
```

---

## ⏳ 五、自动过期 vs Watchdog（续期）

|方式|说明|
|---|---|
|`EX 10`|设置固定过期时间，防止死锁|
|Watchdog|像 Redisson 实现，会自动给锁续命，只适用于持锁线程仍存活时|

---

## ⚠️ 六、常见问题

|问题|风险或原因|解决方式|
|---|---|---|
|锁未释放|程序异常退出|加过期时间 EX|
|锁被误删|多线程竞争下错误 DEL|用唯一 value + Lua 判断删除|
|重入问题|同一线程再次加锁失败|使用 Redisson 可重入锁|
|并发失效/误删别人锁|锁的 value 没有唯一标识|使用 UUID value 保护锁所有权|

---

## 📌 七、完整流程图

```text
[线程 A] 
  └─> SET key value NX EX 10
         ├─ 成功 → 进入临界区
         └─ 失败 → 等待/重试

[业务逻辑完成]
  └─> eval Lua 检查 value 再 DEL（防误删）

[线程 B]
  └─> 同样尝试 SET NX，需等待 A 释放锁
```

---

## 🧠 八、适用场景与扩展

|场景|是否适用|
|---|---|
|秒杀场景控制库存扣减|✅|
|定时任务避免重复执行|✅|
|分布式抢任务 / 抢单|✅|
|要求锁可重入 / 公平|❌（建议用 Redisson）|

---

## ✅ 总结一句话

> 使用 Redis 的 `SET NX EX` 可以快速构建轻量级分布式锁，但**一定要搭配唯一值 + Lua 解锁**，才能避免死锁和误删。

---


# 示例
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Collections;
import java.util.UUID;

@Component
public class RedisLockService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 加锁：成功返回唯一标识，失败返回 null
    //`ttl` 保证锁不会无限存在，避免死锁
    public String tryLock(String key, Duration ttl) {
        String value = UUID.randomUUID().toString(); // 唯一标识，防误删
        /*
        Spring Data Redis 提供的一个方法，作用是：
        尝试设置键值对 `key=value`，只有当 `key` 不存在时才设置成功（即 NX，即“Only set if Not eXists”）
        `setIfAbsent` 就是 Redis 的 `SET key value NX` 操作
        */
        Boolean success = redisTemplate.opsForValue()
                .setIfAbsent(key, value, ttl);
        return Boolean.TRUE.equals(success) ? value : null;
    }

    // 解锁（Lua 脚本保证原子性，防止误删别人的锁）
    public boolean releaseLock(String key, String value) {
        String lua =
                "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                "  return redis.call('del', KEYS[1]) " +
                "else return 0 end";

        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText(lua);
        script.setResultType(Long.class);

        Long result = redisTemplate.execute(script,
                Collections.singletonList(key),
                value);

        return result != null && result == 1L;
    }
}

```