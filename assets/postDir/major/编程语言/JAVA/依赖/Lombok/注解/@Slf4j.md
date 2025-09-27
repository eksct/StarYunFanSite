由Lombok提供的一个日志注解，用于自动生成一个基于SLF4J的Logger实例。
是一个类注解
## **1. `@Slf4j` 的作用**
1. 自动生成一个基于SLF4J的Logger实例,实例名称为log
2. 支持多种日志级别，如 `log.info()`、`log.error()`、`log.debug()` 等
3. 用于类中快速添加日志记录功能

注意：SLF4J 是一个日志门面，需要与具体的日志实现（如 Logback、Log4j）结合使用。
**避免字符串拼接** ，使用占位符 `{}` 代替字符串拼接，提高性能。
```java
log.info("用户 {} 已添加", username);
```