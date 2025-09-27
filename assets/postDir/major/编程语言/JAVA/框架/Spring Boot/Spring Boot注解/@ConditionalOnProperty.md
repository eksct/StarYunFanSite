`@ConditionalOnProperty` 是 Spring Boot 提供的一个 **条件化配置注解**，用于根据 **配置文件中的属性值** 决定是否加载某个 Bean 或配置类。它常用于实现功能模块的动态启用/禁用，或根据环境差异灵活控制组件的初始化。
### **核心作用**

- **条件化加载**：只有当配置文件中指定的属性满足条件时，才会创建被注解标记的 Bean 或配置类。
    
- **环境适配**：通过属性开关，轻松切换不同环境（如开发、测试、生产）下的组件行为。
    
- **模块化控制**：解耦代码与配置，避免硬编码条件逻辑。
### **核心属性**

| 属性名              | 类型         | 说明                                                          |     |
| ---------------- | ---------- | ----------------------------------------------------------- | --- |
| `prefix`         | `String`   | 属性前缀，与 `name` 或 `value` 共同组成完整属性名（例如 `prefix + "." + name`） |     |
| `name` / `value` | `String[]` | 要检查的属性名（支持多个属性，需同时满足条件）                                     |     |
| `havingValue`    | `String`   | 属性的期望值（默认检查属性是否存在且不等于 `false`）                              |     |
| `matchIfMissing` | `boolean`  | 当属性不存在时是否匹配（默认 `false`，即属性不存在视为不匹配）                         |     |
```java
若在application.properties中设置feature.cache.enabled=true时才会创建 `CacheService` Bean
@Configuration
@ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true")
public class CacheConfig {
    @Bean
    public CacheService cacheService() {
        return new RedisCacheService();
    }
}
```

```java
@Bean
@ConditionalOnProperty(
    prefix = "datasource",
    name = {"url", "username", "password"},
    matchIfMissing = false
)
public DataSource dataSource() {
    // 仅当 datasource.url, datasource.username, datasource.password 均存在时初始化
}
```
### **匹配逻辑**

| 条件类型        | 匹配规则                                                    |
| ----------- | ------------------------------------------------------- |
| **属性存在性检查** | 未指定 `havingValue` 时，属性存在且值不为 `false` 则匹配。               |
| **属性值匹配**   | 属性值必须等于 `havingValue`（字符串严格匹配，例如 `"true"` 与 `true` 不同）。 |
| **多属性联合条件** | 所有指定属性均需满足条件（逻辑与）。                                      |
| **属性不存在处理** | `matchIfMissing=true` 时，属性不存在视为匹配。                      |
若配置的属性值为布尔类型，则需要明确设置`havingValue`为true
``matchIfMissing`用于设置默认行为，设置为true时，则属性不存在仍然匹配
### **最佳实践**

1. **明确属性命名规范**：使用统一前缀（如 `feature.xxx`）提高可读性。
    
2. **优先使用 `havingValue`**：避免因属性存在但值为空或意外值导致误匹配。
    
3. **谨慎使用 `matchIfMissing`**：确保默认行为符合预期，必要时添加注释说明。
    
4. **结合 `@ConfigurationProperties`**：与类型安全的配置类配合使用，减少硬编码。