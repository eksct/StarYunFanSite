`SpelExpressionParser` 是 Spring 框架中的一个类，用于解析和执行 **Spring Expression Language (SpEL)** 表达式。SpEL 是一种强大的表达式语言，支持在运行时查询和操作对象图。可以使用 SpEL 来访问 Java 对象的属性、方法和字段，进行条件判断，甚至进行集合操作。
## **1. SpEL 简介**

Spring Expression Language (SpEL) 是一种类似于 OGNL 或 JSP EL 的表达式语言；将一个字符串格式的 SpEL 表达式解析成一个**抽象语法树（AST）**，然后根据该 AST 来执行表达式。支持以下功能：

- 访问对象的属性和方法。
    
- 调用静态方法和构造函数。
    
- 支持算术、逻辑和关系运算。
    
- 支持集合和数组的操作。
    
- 支持正则表达式匹配。
    
- 支持条件表达式（三元运算符）。
## **2.SpEL 表达式示例**

**创建：**
`SpelExpressionParser` 是一个解析器，你需要创建它的实例来解析和执行表达式。

```java
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;

public class SpelExample {
    public static void main(String[] args) {
        ExpressionParser parser = new SpelExpressionParser();
    }
}
```
**解析表达式：**
使用`parseExpression()`方法解析需要的表达式
调用`getValue()`方法执行表达式。
```java
Expression expression = parser.parseExpression("'Hello, World!'");
String result = (String) expression.getValue();
System.out.println(result); // 输出: Hello, World!
Expression expression = parser.parseExpression("3 + 5");
Integer result = (Integer) expression.getValue();
System.out.println(result); // 输出: 8
```
**访问对象属性以及方法：**
```java
public static void main(String[] args) {  
    class test{  
        public String name;  
  
        public test(String name) {  
            this.name = name;  
        }  
        public void func(){  
            System.out.println("12345");  
        }  
    }  
    var obj = new test("atk");  
    SpelExpressionParser parser = new SpelExpressionParser();
    //访问对象方法  
    Expression expression = parser.parseExpression("func()");  
    expression.getValue(obj);  
    //访问对象属性
    expression = parser.parseExpression("name");  
    System.out.println(expression.getValue(obj));  
    expression = parser.parseExpression("'Hello, World!'.toUpperCase()");
	String result = (String) expression.getValue();
	System.out.println(result); // 输出: HELLO, WORLD!
}
```
**集合操作：**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Expression expression = parser.parseExpression("#root.![#this * 2]");
List<Integer> doubledNumbers = (List<Integer>) expression.getValue(numbers);
System.out.println(doubledNumbers); // 输出: [2, 4, 6, 8, 10]
```
## **3.使用EvaluationContext上下文**
EvaluationContext是 SpEL 的上下文对象，用于存储变量和根对象。
可以使用`StandardEvaluationContext`实例将对象设置为根对象，直接访问其属性与方法。
**设置根对象**
```java
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.spel.support.StandardEvaluationContext;

User user = new User("John", 30);
EvaluationContext context = new StandardEvaluationContext(user);

Expression expression = parser.parseExpression("name");
String name = (String) expression.getValue(context);
System.out.println(name); // 输出: John
```
**使用变量**
```java
EvaluationContext context = new StandardEvaluationContext();  
context.setVariable("anntoin","test");  
expression = parser.parseExpression("#anntoin");  
System.out.println(expression.getValue(context));
```
**集合操作**
```java
List<String> list = Arrays.asList("apple", "banana", "cherry");
StandardEvaluationContext context = new StandardEvaluationContext();
context.setVariable("list", list);

Expression expression = parser.parseExpression("#list.[#this.length() > 5]");
List<String> result = (List<String>) expression.getValue(context);
System.out.println(result);  // 输出：[banana, cherry]
```
## **4. SpEL 的应用场景**

1. **配置文件中的动态值**：
	- 在 Spring 配置文件中使用 SpEL 表达式动态注入值。
2. **注解中的动态值**：
	- 在 Spring 注解中使用 SpEL 表达式。
3. **条件表达式：**
	- 在 框架中使用 SpEL 表达式定义条件。