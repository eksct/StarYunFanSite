### Dao层的 Mapper接口

```java
package com.kuang.dao;  
  
import com.kuang.pojo.Books;  
import java.util.List;  
  
public interface BookMapper {  
  
   //增加一个Book  
   int addBook(Books book);  
  
   //根据id删除一个Book  
   int deleteBookById(int id);  
  
   //更新Book  
   int updateBook(Books books);  
  
   //根据id查询,返回一个Book  
   Books queryBookById(int id);  
  
   //查询全部Book,返回list集合  
   List<Books> queryAllBook();  
  
}
```
### 编写Service层的接口和实现类
接口：

```java
package com.kuang.service;  
  
import com.kuang.pojo.Books;  
  
import java.util.List;  
  
//BookService:底下需要去实现,调用dao层  
public interface BookService {  
   //增加一个Book  
   int addBook(Books book);  
   //根据id删除一个Book  
   int deleteBookById(int id);  
   //更新Book  
   int updateBook(Books books);  
   //根据id查询,返回一个Book  
   Books queryBookById(int id);  
   //查询全部Book,返回list集合  
   List<Books> queryAllBook();  
}
```

实现类：

```java
package com.kuang.service;  
  
import com.kuang.dao.BookMapper;  
import com.kuang.pojo.Books;  
import java.util.List;  
  
public class BookServiceImpl implements BookService {  
  
   //调用dao层的操作，设置一个set接口，方便Spring管理  
   private BookMapper bookMapper;  
  
   public void setBookMapper(BookMapper bookMapper) {  
       this.bookMapper = bookMapper;  
  }  
     
   public int addBook(Books book) {  
       return bookMapper.addBook(book);  
  }  
     
   public int deleteBookById(int id) {  
       return bookMapper.deleteBookById(id);  
  }  
     
   public int updateBook(Books books) {  
       return bookMapper.updateBook(books);  
  }  
     
   public Books queryBookById(int id) {  
       return bookMapper.queryBookById(id);  
  }  
     
   public List<Books> queryAllBook() {  
       return bookMapper.queryAllBook();  
  }  
}
```