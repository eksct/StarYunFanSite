ParameterNameDiscoverer 是 Spring 框架中用于获取方法或构造函数参数名称的工具类。
这是一个接口
### 作用

- **参数名发现**：在 Java 反射中，默认无法直接获取方法参数的名称（编译后通常变为 `arg0`, `arg1` 等），此类通过多种策略尝试获取真实的参数名。
    
- **支持场景**：适用于 AOP、消息处理、注解驱动等需要参数名映射的场景，如 Spring MVC 的请求参数绑定。
    

### 核心实现类

- **`DefaultParameterNameDiscoverer`**：Spring 默认实现，组合了两种发现策略：
    
    1. **基于 Java 8 的反射**：利用 `java.lang.reflect.Parameter#getName()`，要求编译时使用 `-parameters` 参数。
        
    2. **基于 ASM 字节码分析**：读取类文件的局部变量表（LocalVariableTable），需编译时包含调试信息（`-g` 参数）。
        

### 使用方法
```java
// 创建实例
ParameterNameDiscoverer discoverer = new DefaultParameterNameDiscoverer();

// 获取方法的参数名
Method method = MyClass.class.getMethod("myMethod", String.class, int.class);
String[] paramNames = discoverer.getParameterNames(method);
// 可能返回 ["name", "age"] 或 null（若无法获取）

// 获取构造函数的参数名
Constructor<?> constructor = MyClass.class.getConstructor(String.class);
String[] constructorParamNames = discoverer.getParameterNames(constructor);
```
`DefaultParameterNameDiscoverer`又继承`PrioritizedParameterNameDiscoverer`将`ParameterNameDiscoverer`的实现类添加至List中；
```java
public class DefaultParameterNameDiscoverer extends PrioritizedParameterNameDiscoverer {  
  
    @SuppressWarnings("removal")  
    public DefaultParameterNameDiscoverer() {  
       if (KotlinDetector.isKotlinReflectPresent()) {  
          addDiscoverer(new KotlinReflectionParameterNameDiscoverer());  
       }  
  
       // Recommended approach on Java 8+: compilation with -parameters.  
       addDiscoverer(new StandardReflectionParameterNameDiscoverer());  
  
       // Deprecated fallback to class file parsing for -debug symbols.  
       // Does not work on native images without class file resources.       if (!NativeDetector.inNativeImage()) {  
          addDiscoverer(new LocalVariableTableParameterNameDiscoverer());  
       }  
    }  
  
}
```
`StandardReflectionParameterNameDiscoverer`用于获取方法参数的真实名称
基于`-parameters`参数
```java
public class StandardReflectionParameterNameDiscoverer implements ParameterNameDiscoverer {  
  
    @Override  
    @Nullable    public String[] getParameterNames(Method method) {  
       return getParameterNames(method.getParameters());  
    }  
  
    @Override  
    @Nullable    public String[] getParameterNames(Constructor<?> ctor) {  
       return getParameterNames(ctor.getParameters());  
    }  
  
    @Nullable  
    private String[] getParameterNames(Parameter[] parameters) {  
       String[] parameterNames = new String[parameters.length];  
       for (int i = 0; i < parameters.length; i++) {  
          Parameter param = parameters[i];  
          if (!param.isNamePresent()) {  
             return null;  
          }  
          parameterNames[i] = param.getName();  
       }  
       return parameterNames;  
    }  
  
}
```