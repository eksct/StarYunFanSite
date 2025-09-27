参考3.5版本[中文文档](https://kafka1x.apachecn.org/intro.html)
参考4.0版本[官方文档](https://kafka.apache.org/34/documentation.html)

会进行消息持久化(存硬盘)

---
**Apache Kafka® 是 一个分布式流处理平台**，这使得kafka：
1. 可以让你发布和订阅流式的记录。这一方面与消息队列或者企业消息系统类似。
2. 可以储存流式的记录，根据需要持久可靠地 **存储** 事件流，并且有较好的容错性。
3. 可以在流式记录产生时就进行处理。
4. ---
#### Kafka 是如何工作的？

**Kafka 是一个分布式系统，由服务器**和**客户端** 组成，它们通过高性能[TCP 网络协议](https://kafka.apache.org/protocol.html)进行通信。它可以部署在本地和云环境中的裸机硬件、虚拟机和容器上。

**服务器**：Kafka 由一台或多台服务器组成集群运行，这些服务器可以跨越多个数据中心或云区域。其中一些服务器构成存储层，称为代理 (broker)。其他服务器运行 [Kafka Connect](https://kafka.apache.org/documentation/#connect)，以事件流的形式持续导入和导出数据，从而将 Kafka 与您现有的系统（例如关系数据库）以及其他 Kafka 集群集成。为了帮助您实现关键任务用例，Kafka 集群具有高度的可扩展性和容错能力：如果其中任何一台服务器发生故障，其他服务器将接管其工作，以确保持续运行且不会丢失任何数据。

**客户端**：它们允许您编写分布式应用程序和微服务，以便能够并行、大规模地读取、写入和处理事件流，并且即使在网络问题或机器故障的情况下也能保持容错能力。Kafka 内置了一些客户端，此外， Kafka 社区还提供了[数十个客户端，](https://cwiki.apache.org/confluence/display/KAFKA/Clients)包括 Java 和 Scala 客户端（包括更高级别的 [Kafka Streams](https://kafka.apache.org/documentation/streams/)库），以及 Go、Python、C/C++ 和许多其他编程语言的客户端，以及 REST API。

---
#### 主要概念和术语

**生产者**是向 Kafka 发布（写入）事件的客户端应用程序，而**消费者**是订阅（读取和处理）这些事件的应用程序。
事件被组织并持久存储在 **主题 (topic)** 中。主题中的事件可以根据需要随时读取——与传统消息系统不同，主题中的事件不会在消费后被删除。相反，您可以通过每个主题的配置设置来定义 Kafka 应保留事件的时间，超过此时间后，旧事件将被丢弃。Kafka 的性能在数据大小方面实际上保持恒定，因此长期存储数据完全没问题。
每条记录中包含一个key，一个value和一个timestamp（时间戳）。
在kafka中，主题是**分区的** ，这意味着一个主题会分布在位于不同 Kafka 代理上的多个“存储桶”中。
且在kafka中，主题中的事件是**顺序的** 即相同key存储在一起，分先后。
kafka中每个主题都会有多个副本，这是为了确保数据容错和高可用性。

---
#### Kafka有五个核心的API:
- 管理[API](https://kafka.apache.org/documentation.html#adminapi)用于管理和检查主题、代理和其他 Kafka 对象。
- The [Producer API](https://kafka1x.apachecn.org/documentation.html#producerapi) 允许一个应用程序发布一串流式的数据到一个或者多个Kafka topic。
- The [Consumer API](https://kafka1x.apachecn.org/documentation.html#consumerapi) 允许一个应用程序订阅一个或多个 topic ，并且对发布给他们的流式数据进行处理。
- The [Streams API](https://kafka1x.apachecn.org/documentation/streams) 允许一个应用程序作为一个流处理器，消费一个或者多个topic产生的输入流，然后生产一个输出流到一个或多个topic中去，在输入输出流中进行有效的转换。
- The [Connector API](https://kafka1x.apachecn.org/documentation.html#connect) 允许构建并运行可重用的生产者或者消费者，将Kafka topics连接到已存在的应用程序或者数据系统。比如，连接到一个关系型数据库，捕捉表（table）的所有变更内容。
```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-clients</artifactId>
	<version>4.0.0</version>
</dependency>
```

#### 官方文档关于api
#### [Kafka API](https://kafka.apache.org/documentation/#intro_apis)

除了用于管理任务的命令行工具外，Kafka 还有五个针对 Java 和 Scala 的核心 API：

- 管理[API](https://kafka.apache.org/documentation.html#adminapi)用于管理和检查主题、代理和其他 Kafka 对象。
- 生产者[API](https://kafka.apache.org/documentation.html#producerapi)将事件流发布（写入）到一个或多个 Kafka 主题。
- [消费者 API](https://kafka.apache.org/documentation.html#consumerapi) 用于订阅（读取）一个或多个主题并处理向其产生的事件流。
- Kafka [Streams API](https://kafka.apache.org/documentation/streams)用于实现流处理应用程序和微服务。它提供处理事件流的高级函数，包括转换、聚合和连接等有状态操作、窗口化、基于事件时间的处理等等。从一个或多个主题读取输入，以生成到一个或多个主题的输出，从而有效地将输入流转换为输出流。
- [Kafka Connect API](https://kafka.apache.org/documentation.html#connect) 用于构建和运行可重复使用的数据导入/导出连接器，这些连接器可以从外部系统和应用程序消费（读取）事件流，也可以向外部系统和应用程序生成（写入）事件流，以便与 Kafka 集成。例如，连接到 PostgreSQL 等关系数据库的连接器可能会捕获一组表的每次更改。然而，实际上，您通常不需要自己实现连接器，因为 Kafka 社区已经提供了数百个现成的连接器。
---
屋檐了机翻
#### 优雅关机
Kafka 集群会自动检测任何 Broker 的关闭或故障，并为该机器上的分区选举新的 Leader。无论是服务器发生故障，还是因维护或配置更改而故意关闭，都会自动执行此操作。对于后一种情况，Kafka 支持一种比直接终止服务器更优雅的服务器停止机制。优雅停止服务器时，它会利用以下两项优化：
1. 它会将所有日志同步到磁盘，以避免重启时需要进行任何日志恢复（例如，验证日志尾部所有消息的校验和）。日志恢复需要时间，因此这可以加快有意重启的速度。
2. 在关闭之前，它会将服务器作为领导者的所有分区迁移到其他副本。这将加快领导权的转移速度，并将每个分区的不可用时间最小化到几毫秒。
#### 平衡领导力 
每当一个 Broker 停止或崩溃时，该 Broker 分区的领导权将转移给其他副本。当 Broker 重新启动时，它将仅作为其所有分区的跟随者，这意味着它将不再用于客户端的读写操作。

为了避免这种不平衡，Kafka 引入了“优先副本”的概念。如果某个分区的副本列表为 1,5,9，则节点 1 优先于节点 5 或 9 成为 Leader，因为它在副本列表中的位置更靠前。默认情况下，Kafka 集群会尝试将 Leader 恢复到优先副本。