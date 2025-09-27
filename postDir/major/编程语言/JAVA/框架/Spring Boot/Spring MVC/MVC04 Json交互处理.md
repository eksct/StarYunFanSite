### 什么是JSON？

- JSON(JavaScript Object Notation, JS 对象标记) 是一种轻量级的数据交换格式，目前使用特别广泛。
    
- 采用完全独立于编程语言的**文本格式**来存储和表示数据。
    
- 简洁和清晰的层次结构使得 JSON 成为理想的数据交换语言。
    
- 易于人阅读和编写，同时也易于机器解析和生成，并有效地提升网络传输效率。
    

在 JavaScript 语言中，一切都是对象。因此，任何JavaScript 支持的类型都可以通过 JSON 来表示，例如字符串、数字、对象、数组等。看看他的要求和语法格式：

- 对象表示为键值对，数据由逗号分隔
    
- 花括号保存对象
    
- 方括号保存数组
    

**JSON 键值对**是用来保存 JavaScript 对象的一种方式，和 JavaScript 对象的写法也大同小异，键/值对组合中的键名写在前面并用双引号 "" 包裹，使用冒号 : 分隔，然后紧接着值：

```json
{"name": "QinJiang"}  
{"age": "3"}  
{"sex": "男"}
```

很多人搞不清楚 JSON 和 JavaScript 对象的关系，甚至连谁是谁都不清楚。其实，可以这么理解：

JSON 是 JavaScript 对象的字符串表示法，它使用文本表示一个 JS 对象的信息，本质是一个字符串。

```JavaScript
var obj = {a: 'Hello', b: 'World'}; //这是一个对象，注意键名也是可以使用引号包裹的  
var json = '{"a": "Hello", "b": "World"}'; //这是一个 JSON 字符串，本质是一个字符串
```

  

**JSON 和 JavaScript 对象互转**

要实现从JSON字符串转换为JavaScript 对象，使用 JSON.parse() 方法：

```JavaScript
var obj = JSON.parse('{"a": "Hello", "b": "World"}');  
//结果是 {a: 'Hello', b: 'World'}
```

要实现从JavaScript 对象转换为JSON字符串，使用 JSON.stringify() 方法：

```JavaScript
var json = JSON.stringify({a: 'Hello', b: 'World'});  
//结果是 '{"a": "Hello", "b": "World"}'
```
【注意：使用json记得处理乱码问题】

**返回json字符串统一解决**

在类上直接使用 **@RestController** ，这样子，里面所有的方法都只会返回 json 字符串了，不用再每一个都添加@ResponseBody ！我们在前后端分离开发中，一般都使用 @RestController ，十分便捷！

### jackson

jackson 的 pom依赖！
```xml
<dependency>  
   <groupId>com.fasterxml.jackson.core</groupId>  
   <artifactId>jackson-databind</artifactId>  
   <version>需求版本</version>  
</dependency>
```

### fastjson

fastjson.jar是阿里开发的一款专门用于Java开发的包，可以方便的实现json对象与JavaBean对象的转换，实现JavaBean对象与json字符串的转换，实现json对象与json字符串的转换。实现json的转换方法很多，最后的实现结果都是一样的。

fastjson 的 pom依赖！

```xml
<dependency>  
   <groupId>com.alibaba</groupId>  
   <artifactId>fastjson</artifactId>  
   <version>你的版本</version>  
</dependency>
```

fastjson 三个主要的类：

**JSONObject  代表 json 对象**

- JSONObject实现了Map接口, 猜想 JSONObject底层操作是由Map实现的。
    
- JSONObject对应json对象，通过各种形式的get()方法可以获取json对象中的数据，也可利用诸如size()，isEmpty()等方法获取"键：值"对的个数和判断是否为空。其本质是通过实现Map接口并调用接口中的方法完成的。
    

**JSONArray   代表 json 对象数组**

- 内部是有List接口中的方法来完成操作的。
    

**JSON代表 JSONObject和JSONArray的转化**

- JSON类源码分析与使用
    
- 仔细观察这些方法，主要是实现json对象，json对象数组，javabean对象，json字符串之间的相互转化。