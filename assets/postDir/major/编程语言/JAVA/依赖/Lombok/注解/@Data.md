由lombok提供的一个为类中字段生成`getters`、`setters`、`toString`、`hashCode`、`equals`、`constructor`方法的注解

- 为类中所有字段自动生成get方法
- 为类中非`final`字段生成set方法
- 提供一个包含所有`final`字段、`@NonNull`的构造方法。没有则保留无参构造方法，可以通过添加Lombok中用于生成构造函数的注解，生成其他构造函数。
- 如果手动实现了`toString`、`hashCode`、`equals`方法，则不再生成
- `toString`、`hashCode`、`equals`方法只会包含本类的非静态、可序列化字段，不会包含父类字段，需要利用`@EqualsAndHashCode(callSuper = true)`、`@ToString(callSuper = true)`显式声明
- 使用`@Data(staticConstructor="of") `可以生成一个静态的of方法，来创建新实例。

```java
import lombok.AccessLevel;  
import lombok.Setter;  
import lombok.Data;  
import lombok.ToString;  
  
@Data 
public class DataExample {  
  private final String name;  
  @Setter(AccessLevel.PACKAGE) 
  private int age;  
  private double score;  
  private String[] tags;  
    
  @ToString(includeFieldNames=true)  
  @Data(staticConstructor="of")  
  public static class Exercise<T> {  
    private final String name;  
    private final T value;  
  }  
}
```