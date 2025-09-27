## 1️⃣ Key 操作

| 命令                     | 作用           | 示例                        |
| ---------------------- | ------------ | ------------------------- |
| `KEYS pattern`         | 查找匹配的 key    | `KEYS user:*`             |
| `DEL key`              | 删除 key       | `DEL user:1`              |
| `EXISTS key`           | 判断 key 是否存在  | `EXISTS user:1`           |
| `EXPIRE key seconds`   | 设置 key 过期时间  | `EXPIRE session:123 3600` |
| `TTL key`              | 查看剩余过期时间（秒）  | `TTL session:123`         |
| `RENAME oldkey newkey` | 重命名 key      | `RENAME user:1 user:1001` |
| `PERSIST key`          | 移除 key 的过期时间 | `PERSIST session:123`     |

---

## 2️⃣ 字符串（String）

| 命令                 | 作用     | 示例                         |
| ------------------ | ------ | -------------------------- |
| `SET key value`    | 设置字符串  | `SET name "Tom"`           |
| `GET key`          | 获取字符串  | `GET name`                 |
| `INCR key`         | 自增（整数） | `INCR visits`              |
| `DECR key`         | 自减（整数） | `DECR visits`              |
| `APPEND key val`   | 追加字符串  | `APPEND name " Smith"`     |
| `MSET k1 v1 k2 v2` | 批量设置   | `MSET name "Tom" age "20"` |
| `MGET k1 k2`       | 批量获取   | `MGET name age`            |

---

## 3️⃣ 哈希（Hash）

| 命令                      | 作用       | 示例                                 |
| ----------------------- | -------- | ---------------------------------- |
| `HSET key field value`  | 设置字段     | `HSET user:1 name "Tom"`           |
| `HGET key field`        | 获取字段     | `HGET user:1 name`                 |
| `HMSET key f1 v1 f2 v2` | 批量设置字段   | `HMSET user:1 age 20 city Beijing` |
| `HMGET key f1 f2`       | 批量获取字段   | `HMGET user:1 name age`            |
| `HGETALL key`           | 获取所有字段和值 | `HGETALL user:1`                   |
| `HDEL key field`        | 删除字段     | `HDEL user:1 age`                  |
| `HEXISTS key field`     | 判断字段是否存在 | `HEXISTS user:1 name`              |
| `HLEN key`              | 获取字段数量   | `HLEN user:1`                      |
user:1为了区分是哪个用户的hash

---

## 4️⃣ 列表（List）

| 命令                     | 作用       | 示例                       |
| ---------------------- | -------- | ------------------------ |
| `LPUSH key val`        | 左侧插入     | `LPUSH tasks "task1"`    |
| `RPUSH key val`        | 右侧插入     | `RPUSH tasks "task2"`    |
| `LPOP key`             | 左侧弹出     | `LPOP tasks`             |
| `RPOP key`             | 右侧弹出     | `RPOP tasks`             |
| `LRANGE key start end` | 获取区间元素   | `LRANGE tasks 0 10`      |
| `LLEN key`             | 获取长度     | `LLEN tasks`             |
| `LSET key index val`   | 修改指定下标元素 | `LSET tasks 0 "newTask"` |
| `LREM key count val`   | 删除元素     | `LREM tasks 1 "task1"`   |

---

## 5️⃣ 集合（Set）

| 命令                     | 作用       | 示例                      |
| ---------------------- | -------- | ----------------------- |
| `SADD key member`      | 添加成员     | `SADD tags "java"`      |
| `SMEMBERS key`         | 获取所有成员   | `SMEMBERS tags`         |
| `SREM key member`      | 删除成员     | `SREM tags "java"`      |
| `SISMEMBER key member` | 判断成员是否存在 | `SISMEMBER tags "java"` |
| `SCARD key`            | 成员数量     | `SCARD tags`            |
| `SUNION key1 key2`     | 并集       | `SUNION tags1 tags2`    |
| `SINTER key1 key2`     | 交集       | `SINTER tags1 tags2`    |
| `SDIFF key1 key2`      | 差集       | `SDIFF tags1 tags2`     |

---

## 6️⃣ 有序集合（Sorted Set，ZSet）

| 命令                                     | 作用         | 示例                                      |
| -------------------------------------- | ---------- | --------------------------------------- |
| `ZADD key score member`                | 添加成员和分数    | `ZADD leaderboard 100 tom`              |
| `ZRANGE key start end [WITHSCORES]`    | 按分数正序取成员   | `ZRANGE leaderboard 0 -1 WITHSCORES`    |
| `ZREVRANGE key start end [WITHSCORES]` | 按分数倒序取成员   | `ZREVRANGE leaderboard 0 -1 WITHSCORES` |
| `ZSCORE key member`                    | 获取成员分数     | `ZSCORE leaderboard tom`                |
| `ZRANK key member`                     | 获取成员排名（正序） | `ZRANK leaderboard tom`                 |
| `ZREVRANK key member`                  | 获取成员排名（倒序） | `ZREVRANK leaderboard tom`              |
| `ZREM key member`                      | 删除成员       | `ZREM leaderboard tom`                  |
| `ZCOUNT key min max`                   | 统计分数区间成员数  | `ZCOUNT leaderboard 50 150`             |
| `ZINCRBY key increment member`         | 增加成员分数     | `ZINCRBY leaderboard 10 tom`            |
| `ZCARD key`                            | 获取元素个数     | ZCARD leaderboard                       |
注：排名默认升序，倒叙在命令的Z后面加REV即可

---

## 7️⃣ 事务（Transaction）

| 命令          | 作用           |
| ----------- | ------------ |
| `MULTI`     | 开启事务         |
| `EXEC`      | 提交事务         |
| `DISCARD`   | 放弃事务         |
| `WATCH key` | 监视 key，乐观锁机制 |

---

## 8️⃣ 发布订阅（Pub/Sub）

|命令|作用|
|---|---|
|`PUBLISH channel message`|发送消息|
|`SUBSCRIBE channel`|订阅频道|
|`UNSUBSCRIBE channel`|取消订阅|

---

## 9️⃣ 脚本（Lua）

|命令|作用|
|---|---|
|`EVAL script numkeys key [arg...]`|执行 Lua 脚本|

---

如果你想，我可以帮你整理 **命令示例** 或 **Java/Spring Redis 代码示范**，告诉我！