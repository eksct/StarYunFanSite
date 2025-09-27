## **1. Maven**

```xml
<dependencies>
	<dependency>
		<groupId>org.projectlombok</groupId>
		<artifactId>lombok</artifactId>
		<version>1.18.36</version>
		<scope>provided</scope>
	</dependency>
</dependencies>
```
## **2.Gradle**

build.gradle下:
```gradle
dependencies {
	implementation "org.projectlombok:lombok:$lombok"  
	annotationProcessor "org.projectlombok:lombok:$lombok"
}
$lombok处输入你的版本或者定义一个gradle.properties
```
