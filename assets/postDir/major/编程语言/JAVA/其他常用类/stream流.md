Java中的`Stream`流是从Java 8引入的一个新特性，主要用于处理集合框架（如`List`、`Set`等）的数据，提供了对数据进行声明式操作的能力，简化了代码，并且支持并行操作。通过Stream，我们可以以更简洁的方式处理集合数据，避免了传统的使用循环来进行操作。
### 1. `Stream`的概念

`Stream`是一个顺序或并行的元素序列，支持聚合操作。`Stream`的元素可以是集合中的数据，也可以是其他数据源中的数据，主要提供了对数据集合的高效操作方式，避免了显式的循环控制。

### 2. `Stream`的特点

- **不存储数据**：`Stream`本身不存储数据，它是从数据源（如集合、数组等）中获取数据，进行一系列操作后返回结果。
    
- **函数式操作**：`Stream`支持函数式编程风格，链式调用，操作符通常为无副作用的。
    
- **惰性求值**：许多操作（如`map`、`filter`等）是惰性求值的，只有在需要结果的时候，才会执行计算，避免了不必要的计算。
    
- **可并行化**：`Stream`支持并行操作，可以轻松地并行处理数据。
    

### 3. `Stream`的操作类型

`Stream`的操作可以分为两大类：

- **中间操作**：对流进行转换的操作，返回一个新的`Stream`，例如`filter`、`map`、`distinct`、`sorted`等。
    
- **终止操作**：触发计算的操作，通常会产生一个非`Stream`的结果，或者产生副作用，例如`forEach`、`collect`、`reduce`、`count`等。
    

#### 中间操作

这些操作会返回一个新的`Stream`，它们通常是惰性求值的，只有在终止操作调用时才会执行。例如：

- `filter(Predicate<T> predicate)`：过滤符合条件的元素。
    
- `map(Function<T, R> mapper)`：映射操作，对元素进行转换。
    
- `distinct()`：去重，去除重复元素。
    
- `sorted()`：对元素进行排序。
    
- `limit(long maxSize)`：截取前`maxSize`个元素。
    
- `skip(long n)`：跳过前`n`个元素。
    

#### 终止操作

这些操作会对流进行最终的计算，返回一个具体的结果，执行时会触发实际计算。例如：

- `forEach(Consumer<T> action)`：遍历每个元素并执行给定的动作。
    
- `collect(Collector<T, A, R> collector)`：将流中的元素收集成一个集合或其他类型。
    
- `reduce(BinaryOperator<T> accumulator)`：对流中的元素进行归约操作，通常用于求和、求积等。
    
- `count()`：统计流中元素的个数。
    
- `anyMatch(Predicate<T> predicate)`：判断是否有任何一个元素满足给定的条件。
    
- `allMatch(Predicate<T> predicate)`：判断所有元素是否都满足给定的条件。
    
- `findFirst()`：返回流中的第一个元素。
### 4.示例代码
```java
import java.util.*;
import java.util.stream.*;
public class StreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // 过滤出偶数并将每个偶数乘2
        List<Integer> result = numbers.stream()
                                      .filter(n -> n % 2 == 0)  // 中间操作: 过滤偶数
                                      .map(n -> n * 2)           // 中间操作: 将每个偶数乘2
                                      .collect(Collectors.toList());  // 终止操作: 收集结果
        
        System.out.println(result); // 输出: [4, 8, 12, 16, 20]
    }
}

```
### 5.并行操作
通过`parallelStream()`，我们可以轻松地将`Stream`转换为并行流。并行流会使用多个线程来并行处理数据，可以提高性能，特别是在数据量较大的时候。
并行流对于大数据集的处理具有优势，但在处理小数据集时，使用并行流可能带来的开销反而更大。因此，对于小数据集，通常应该使用顺序流（`stream()`）而不是并行流（`parallelStream()`）。