### 概述
SpringMVC的处理器拦截器类似于Servlet开发中的过滤器Filter,用于对处理器进行预处理和后处理。开发者可以自己定义一些拦截器来实现特定的功能。

**过滤器与拦截器的区别：**拦截器是AOP思想的具体应用。

**过滤器**

- servlet规范中的一部分，任何java web工程都可以使用
    
- 在url-pattern中配置了/*之后，可以对所有要访问的资源进行拦截
    

**拦截器**

- 拦截器是SpringMVC框架自己的，只有使用了SpringMVC框架的工程才能使用
    
- 拦截器只会拦截访问的控制器方法， 如果访问的是jsp/html/css/image/js是不会进行拦截的

### 自定义拦截器

那如何实现拦截器呢？

想要自定义拦截器，必须实现 HandlerInterceptor 接口。

1、新建一个Moudule ， springmvc-07-Interceptor  ， 添加web支持

2、配置web.xml 和 springmvc-servlet.xml 文件

3、编写一个拦截器
```java
package com.kuang.interceptor;  
  
import org.springframework.web.servlet.HandlerInterceptor;  
import org.springframework.web.servlet.ModelAndView;  
  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
  
public class MyInterceptor implements HandlerInterceptor {  
  
   //在请求处理的方法之前执行  
   //如果返回true执行下一个拦截器  
   //如果返回false就不执行下一个拦截器  
   public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {  
       System.out.println("------------处理前------------");  
       return true;  
  }  
  
   //在请求处理方法执行之后执行  
   public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {  
       System.out.println("------------处理后------------");  
  }  
  
   //在dispatcherServlet处理后执行,做清理工作.  
   public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {  
       System.out.println("------------清理------------");  
  }
```
在mvc中注册拦截器
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor())
                .addPathPatterns("/admin/**") // 拦截 /admin 路径下的请求
                .excludePathPatterns("/admin/login"); // 排除 /admin/login 路径
    }
}
```
### 文件上传和下载
```java
package com.xy.base.controller.admin.file;  
import com.xy.base.service.IFileService;  
import com.xy.common.core.response.Restful;  
import io.swagger.v3.oas.annotations.Operation;  
import io.swagger.v3.oas.annotations.Parameter;  
import io.swagger.v3.oas.annotations.tags.Tag;  
import lombok.NonNull;  
import lombok.RequiredArgsConstructor;  
import org.springframework.web.bind.annotation.*;  
import org.springframework.web.multipart.MultipartFile;  
import java.io.IOException;  
  
/**  
 * @author Lin */@Tag(name = "后台管理 - 文件管理")  
@RestController  
@RequestMapping("/file")  
@RequiredArgsConstructor  
public class FileController {  
  
    @NonNull  
    private IFileService fileService;  
  
    /**  
     * 单文件上传  
     *  
     * @param file     * @return     * @throws Exception     */    @Operation(summary = "上传文件")  
    @Parameter(name = "file", description = "文件")  
    @RequestMapping(value = "/upload", method = RequestMethod.POST)  
    public Restful<String> upload(@RequestParam("file") MultipartFile file) throws IOException {  
        return Restful.ok(fileService.upload(file));  
    }  
  
    /**  
     * 文件预览  
     *  
     * @param sid     */    @Operation(summary = "文件预览")  
    @Parameter(name = "sid", description = "文件ID")  
    @RequestMapping(value = "/{sid}/preview", method = RequestMethod.GET)  
    public void preview(@PathVariable(value = "sid") String sid) {  
        fileService.preview(sid);  
    }  
}
```


```java
package com.xy.base.service.impl;  
  
import cn.hutool.core.io.IoUtil;  
import com.xy.base.service.IFileService;  
import com.xy.common.core.exception.BusinessException;  
import com.xy.common.core.response.BaseTip;  
import com.xy.common.util.ServletUtil;  
import com.xy.storage.FileMeta;  
import com.xy.storage.IStorageManager;  
import jakarta.annotation.Resource;  
import jakarta.servlet.http.HttpServletResponse;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.stereotype.Service;  
import org.springframework.web.multipart.MultipartFile;  
  
import java.io.IOException;  
import java.io.InputStream;  
  
/**  
 * @author Lin */@Service  
@Slf4j  
public class FileServiceImpl implements IFileService {  
  
    @Resource  
    private IStorageManager storageManager;  
  
    /**  
     * 上传文件  
     *  
     * @param file     * @return     */    @Override  
    public String upload(MultipartFile file) throws IOException {  
        FileMeta fileMeta = storageManager.store(file.getInputStream());  
        return fileMeta.getSid();  
    }  
  
    /**  
     * 图片预览  
     *  
     * @param sid     */    @Override  
    public void preview(String sid) {  
        HttpServletResponse response = ServletUtil.getResponse();  
        response.setContentType("image/jpeg");  
        try (InputStream inputStream = storageManager.getResource(sid).getInputStream()) {  
            IoUtil.copy(inputStream, response.getOutputStream());  
        } catch (IOException e) {  
            log.info("预览文件丢失:", e);  
            throw new BusinessException(BaseTip.FILE_MISS);  
        }  
  
    }  
}
```
具体上传下载实现
```java
package com.xy.storage.local;  
  
import cn.hutool.core.io.IoUtil;  
import cn.hutool.core.io.file.PathUtil;  
import cn.hutool.core.lang.UUID;  
import cn.hutool.crypto.digest.MD5;  
import com.xy.common.core.exception.BusinessException;  
import com.xy.storage.AbstractStorageProcessor;  
import com.xy.storage.FileMeta;  
import lombok.SneakyThrows;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.beans.factory.annotation.Value;  
import org.springframework.boot.context.event.ApplicationReadyEvent;  
import org.springframework.context.ApplicationListener;  
import org.springframework.core.io.FileSystemResource;  
import org.springframework.core.io.Resource;  
  
import java.io.IOException;  
import java.io.InputStream;  
import java.io.OutputStream;  
import java.nio.file.Files;  
import java.nio.file.Path;  
import java.nio.file.Paths;  
  
/**  
 * @author Lin */@Slf4j  
public class LocalStorageProcessor extends AbstractStorageProcessor implements ApplicationListener<ApplicationReadyEvent> {  
  
    @Value("${storage.processor.rootDir:/data/xy}")  
    private String rootDir;  
  
  
    @Override  
    public void onApplicationEvent(ApplicationReadyEvent event) {  
        PathUtil.mkdir(Paths.get(rootDir));  
        log.info("-->>>Local文件存储服务启动成功！<<<---");  
        log.info("-->>>Local文件存储目录:{} <<<---", rootDir);  
    }  
  
    /**  
     * 文件存储  
     *  
     * @param inputStream     * @return     * @throws IOException     */    @Override  
    @SneakyThrows    public FileMeta store(InputStream inputStream) {  
        String sid = UUID.fastUUID().toString();  
        Path path = Paths.get(rootDir, sid);  
        try (OutputStream outputStream = PathUtil.getOutputStream(path)) {  
            IoUtil.copy(inputStream, outputStream);  
        }  
        Long size = Files.size(path);  
        String contentType = getContentType(path);  
        String md5 = null;  
        try (InputStream is = PathUtil.getInputStream(path)) {  
            md5 = MD5.create().digestHex(is);  
        }  
        return FileMeta.builder().sid(sid).size(size).contentType(contentType).md5(md5).build();  
    }  
  
    /**  
     * 获取资源  
     *  
     * @param sid     * @return     */    @Override  
    public Resource getResource(String sid) {  
        return new FileSystemResource(Paths.get(rootDir, sid));  
    }  
  
    /**  
     * 删除文件  
     *  
     * @param sid     */    @Override  
    public void delete(String key, String uploadId, String sid) {  
        PathUtil.del(Paths.get(rootDir, sid));  
    }  
  
    /**  
     * 分享文件  
     *  
     * @param sid     * @return     */    @Override  
    public String share(String sid) {  
        throw new BusinessException("不支持文件分享");  
    }  
}
```