Lombok 提供的注解，用于自动生成一个包含 `final` 字段或 `@NonNull` 字段的构造函数。通过此注解可以省略手动编写构造方法，简化代码。
### **1. `@RequiredArgsConstructor` 的作用**

1. 生成构造函数，为所有被`final`、`@NonNull`修饰的字段增加一个构造方法
2. 简化依赖注入，因为会生成构造函数，所以在spring等框架中字段上可以不用`@AutoWired`来自动注入
3. 支持不可变对象
### **2. 使用 `@RequiredArgsConstructor`**
#### **2.1 基本用法**
```java
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class User {
    private final String username;
    private final int age;
}
```
Lombok 会生成以下构造函数：
```java
public User(String username, int age) {
    this.username = username;
    this.age = age;
}
```
#### **2.2 结合 `@NonNull`**
与[[#2.1 基本用法]]类似，在字段上添加`@NonNull`注解后生成：
```java
public User(@NonNull String username, int age) {
    if (username == null) {
        throw new NullPointerException("username is marked non-null but is null");
    }
    this.username = username;
    this.age = age;
}
```