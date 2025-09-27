# @val
由Lombok提供，类似于c++中的auto关键字，自动推断字段类型，不过只能在局部变量使用
示例：
```java
import java.util.ArrayList;
import java.util.HashMap;
import lombok.val;

public class ValExample {
  public String example() {
    val example = new ArrayList<String>();
    example.add("Hello, World!");
    val foo = example.get(0);
    return foo.toLowerCase();
  }
  
  public void example2() {
    val map = new HashMap<Integer, String>();
    map.put(0, "zero");
    map.put(5, "five");
    for (val entry : map.entrySet()) {
      System.out.printf("%d: %s\n", entry.getKey(), entry.getValue());
    }
  }
}
```
注意：由于val在Lombok中是一个实际的类，所以要导入才可使用。
使用了val的局部变量，会自动推导实际类型，并添加final修饰
对于引用类型，val会推断出父类作为数据类型
为`null`时，推断Object

# @var
是 Lombok 提供的注解，用于自动推断局部变量的类型
@var于@val类似，但是不添加final修饰