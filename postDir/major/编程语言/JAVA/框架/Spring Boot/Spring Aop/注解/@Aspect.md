由Spring Aop提供，用于定义切面(Aspect)。切面是切面编程(AOP)的核心概念，用于将横切关注点（如日志、事务管理）模块化，从而将这些关注点与业务逻辑分离。
## **1. `@Aspect` 的作用**

- **切面**：将横切关注点（如日志、事务、权限检查等）模块化。
    
- **通知（Advice）**：定义在切点（Pointcut）执行前后或异常时执行的操作。
    
- **切点（Pointcut）**：定义哪些方法需要被拦截。
## **2. `@Aspect` 的使用**
### **2.1 使用示例**

```java
//需要注册为bean
@Aspect
@Component
public class CacheAspect {

}
```
### **2.2 定义通知**

Spring AOP 支持以下类型的通知：

1. **`@Before`**：在目标方法执行前执行。
    
2. **`@After`**：在目标方法执行后执行（无论是否抛出异常）。
    
3. **`@AfterReturning`**：在目标方法成功返回后执行。
    
4. **`@AfterThrowing`**：在目标方法抛出异常后执行。
    
5. **`@Around`**：在目标方法执行前后执行，可以控制是否执行目标方法。

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
	//定义一个可重用切点
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    @Before("serviceMethods()")
    public void logBefore() {
        System.out.println("方法执行前记录日志");
    }

    @After("serviceMethods()")
    public void logAfter() {
        System.out.println("方法执行后记录日志");
    }

    @Around("serviceMethods()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("方法执行前记录日志（Around）");
        Object result = joinPoint.proceed();
        System.out.println("方法执行后记录日志（Around）");
        return result;
    }
}
```
