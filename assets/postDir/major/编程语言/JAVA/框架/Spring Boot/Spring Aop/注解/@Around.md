`@Around`是spring AOP 中的一个注解，用来定义环绕通知(环绕切面方法)，环绕通知是在方法执行之前与执行之后执行操作的一种通知类型。
### 主要功能

- **在目标方法执行前后执行**：你可以在目标方法执行之前和之后插入自定义逻辑，甚至决定是否调用目标方法。
- **控制方法的返回值**：在环绕通知中，你可以改变目标方法的返回值。
- **执行额外的逻辑**：例如日志记录、性能监控、事务管理等。
### 语法
`@Around`是一个方法上注释，默认接收一个[[切点表达式]]作为参数，方法则需要接收一个`ProceedingJoinPoint`参数
```java
@Around("切点表达式")
public Object 方法名(ProceedingJoinPoint joinPoint) throws Throwable {
    // 目标方法执行前的逻辑
    Object result = joinPoint.proceed(); // 执行目标方法
    // 目标方法执行后的逻辑
    return result;
}
```
### 示例：
```java
//修改返回值
@Around("execution(* com.example.service.*.*(..))")
public Object modifyResult(ProceedingJoinPoint joinPoint) throws Throwable {
    Object result = joinPoint.proceed();
    if (result instanceof String) {
        return ((String) result).toUpperCase(); // 修改返回值
    }
    return result;
}
//控制是否执行
@Around("execution(* com.example.service.*.*(..))")
public Object controlExecution(ProceedingJoinPoint joinPoint) throws Throwable {
    if (someCondition) {//一个参数
        return joinPoint.proceed(); // 执行目标方法
    } else {
        return "跳过目标方法"; // 不执行目标方法
    }
}
//处理抛出异常
@Around("execution(* com.example.service.*.*(..))")
public Object handleException(ProceedingJoinPoint joinPoint){
	try{
		return joinPoint.proceed();
	}catch(Exception e){
		System.out.println("捕获异常: " + e.getMessage());
	    return "默认返回值"; // 返回默认值
	}
}
```
## **`@Around` 的最佳实践**

1. **明确切点范围**：
    
    - 使用精确的切点表达式，避免拦截不必要的方法。
        
2. **处理异常**：
    
    - 在 `@Around` 中捕获并处理异常，避免异常传播到调用方。
        
3. **控制目标方法的执行**：
    
    - 根据条件决定是否执行目标方法。
        
4. **性能优化**：
    
    - 避免在 `@Around` 中执行耗时操作，影响性能。