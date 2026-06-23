import JvmMemoryVisualizer from './java/JvmMemoryVisualizer';
import GarbageCollectionVisualizer from './java/GarbageCollectionVisualizer';
import ThreadLifecycleVisualizer from './java/ThreadLifecycleVisualizer';
import JvmArchitectureVisualizer from './java/JvmArchitectureVisualizer';
import StringPoolVisualizer from './java/StringPoolVisualizer';
import WrapperClassesVisualizer from './java/WrapperClassesVisualizer';
import OopPolymorphismVisualizer from './java/OopPolymorphismVisualizer';
import ExceptionHandlingVisualizer from './java/ExceptionHandlingVisualizer';
import ConcurrencySyncVisualizer from './java/ConcurrencySyncVisualizer';

import ArrayListVisualizer from './dsa/ArrayListVisualizer';
import LinkedListVisualizer from './dsa/LinkedListVisualizer';
import StackVisualizer from './dsa/StackVisualizer';
import QueueVisualizer from './dsa/QueueVisualizer';
import HashMapVisualizer from './dsa/HashMapVisualizer';
import MergeSortVisualizer from './dsa/MergeSortVisualizer';
import GraphTraversalVisualizer from './dsa/GraphTraversalVisualizer';
import BinarySearchVisualizer from './dsa/BinarySearchVisualizer';
import BstVisualizer from './dsa/BstVisualizer';
import QuickSortVisualizer from './dsa/QuickSortVisualizer';
import AvlVisualizer from './dsa/AvlVisualizer';
import HeapVisualizer from './dsa/HeapVisualizer';
import TrieVisualizer from './dsa/TrieVisualizer';
import DijkstraVisualizer from './dsa/DijkstraVisualizer';
import TopoSortVisualizer from './dsa/TopoSortVisualizer';

import ClientServerVisualizer from './system/ClientServerVisualizer';
import RestApiLifecycleVisualizer from './system/RestApiLifecycleVisualizer';
import JwtAuthVisualizer from './system/JwtAuthVisualizer';
import SessionAuthVisualizer from './system/SessionAuthVisualizer';
import LoadBalancerVisualizer from './system/LoadBalancerVisualizer';
import RedisCacheVisualizer from './system/RedisCacheVisualizer';
import CdnVisualizer from './system/CdnVisualizer';
import MessageQueueVisualizer from './system/MessageQueueVisualizer';
import ApiGatewayVisualizer from './system/ApiGatewayVisualizer';
import DbReplicationVisualizer from './system/DbReplicationVisualizer';
import HorizontalScalingVisualizer from './system/HorizontalScalingVisualizer';
import VerticalScalingVisualizer from './system/VerticalScalingVisualizer';
import DbShardingVisualizer from './system/DbShardingVisualizer';
import ConsistentHashingVisualizer from './system/ConsistentHashingVisualizer';
import DistributedCacheVisualizer from './system/DistributedCacheVisualizer';
import DistributedLocksVisualizer from './system/DistributedLocksVisualizer';
import RateLimitingVisualizer from './system/RateLimitingVisualizer';
import CircuitBreakerVisualizer from './system/CircuitBreakerVisualizer';
import FailoverSystemVisualizer from './system/FailoverSystemVisualizer';
import QueueLoadLevelingVisualizer from './system/QueueLoadLevelingVisualizer';
import DnsSystemVisualizer from './system/DnsSystemVisualizer';
import WebsocketSystemVisualizer from './system/WebsocketSystemVisualizer';
import MicroservicesVisualizer from './system/MicroservicesVisualizer';
import EventDrivenVisualizer from './system/EventDrivenVisualizer';
import PubSubVisualizer from './system/PubSubVisualizer';
import CapTheoremVisualizer from './system/CapTheoremVisualizer';
import ServiceDiscoveryVisualizer from './system/ServiceDiscoveryVisualizer';
import GraphqlApiVisualizer from './system/GraphqlApiVisualizer';
import PacelcTheoremVisualizer from './system/PacelcTheoremVisualizer';

import DbTableSimulator from './database/DbTableSimulator';
import PrimaryKeyVisualizer from './database/PrimaryKeyVisualizer';
import ForeignKeyVisualizer from './database/ForeignKeyVisualizer';
import SqlJoinsVisualizer from './database/SqlJoinsVisualizer';
import DbIndexingVisualizer from './database/DbIndexingVisualizer';
import BPlusTreeVisualizer from './database/BPlusTreeVisualizer';
import QueryExecutionVisualizer from './database/QueryExecutionVisualizer';
import NormalizationVisualizer from './database/NormalizationVisualizer';
import AcidTransactionsVisualizer from './database/AcidTransactionsVisualizer';
import DbLockingVisualizer from './database/DbLockingVisualizer';
import MongoDocumentVisualizer from './database/MongoDocumentVisualizer';
import MongoAggregationVisualizer from './database/MongoAggregationVisualizer';
import DbCacheVisualizer from './database/DbCacheVisualizer';
import DbShardingDbVisualizer from './database/DbShardingVisualizer';
import DbReplicationDbVisualizer from './database/DbReplicationVisualizer';
import DbCapVisualizer from './database/DbCapVisualizer';

import QueryOptimizerVisualizer from './database/QueryOptimizerVisualizer';
import MaterializedViewsVisualizer from './database/MaterializedViewsVisualizer';
import OltpOlapVisualizer from './database/OltpOlapVisualizer';
import DataWarehousingVisualizer from './database/DataWarehousingVisualizer';
import SnowflakeSchemaVisualizer from './database/SnowflakeSchemaVisualizer';
import StarSchemaVisualizer from './database/StarSchemaVisualizer';
import DistributedDatabasesVisualizer from './database/DistributedDatabasesVisualizer';
import EventSourcingVisualizer from './database/EventSourcingVisualizer';
import CqrsVisualizer from './database/CqrsVisualizer';
import CdcPatternVisualizer from './database/CdcPatternVisualizer';
import ElasticsearchVisualizer from './database/ElasticsearchVisualizer';
import VectorDatabasesVisualizer from './database/VectorDatabasesVisualizer';
import PostgresInternalsVisualizer from './database/PostgresInternalsVisualizer';

export const VISUALIZER_REGISTRY = {
  JAVA: [
    {
      id: 'jvm-memory',
      name: 'JVM Memory',
      icon: 'fa-solid fa-server',
      component: JvmMemoryVisualizer,
      description: 'Observe reference allocations on the Stack vs objects on the Heap.'
    },
    {
      id: 'garbage-collection',
      name: 'Garbage Collection',
      icon: 'fa-solid fa-recycle',
      component: GarbageCollectionVisualizer,
      description: 'Simulate Eden Space allocations, survivor aging (S0/S1), and promotions to Tenured.'
    },
    {
      id: 'thread-lifecycle',
      name: 'Thread Lifecycle',
      icon: 'fa-solid fa-spinner',
      component: ThreadLifecycleVisualizer,
      description: 'Interact with the Java thread state transitions (NEW, RUNNABLE, BLOCKED, WAITING, etc.).'
    },
    {
      id: 'jvm-architecture',
      name: 'JVM Architecture',
      icon: 'fa-solid fa-network-wired',
      component: JvmArchitectureVisualizer,
      description: 'Classloader subsystem, Runtime Data Areas, and execution engine workflows.'
    },
    {
      id: 'string-pool',
      name: 'String Pool',
      icon: 'fa-solid fa-font',
      component: StringPoolVisualizer,
      description: 'Visualize String literal sharing vs heap-allocated String objects in memory.'
    },
    {
      id: 'wrapper-classes',
      name: 'Wrapper Classes & Autoboxing',
      icon: 'fa-solid fa-box',
      component: WrapperClassesVisualizer,
      description: 'Primitive types vs object wrappers and caches (like Integer Cache -128 to 127).'
    },
    {
      id: 'oop-concepts',
      name: 'OOP & Polymorphism',
      icon: 'fa-solid fa-shapes',
      component: OopPolymorphismVisualizer,
      description: 'Dynamic dispatch, vtables, method overriding vs overloading execution paths.'
    },
    {
      id: 'exception-hierarchy',
      name: 'Exception Handling',
      icon: 'fa-solid fa-triangle-exclamation',
      component: ExceptionHandlingVisualizer,
      description: 'Call stack unwinding and try-catch-finally execution transitions.'
    },
    {
      id: 'concurrency-sync',
      name: 'Synchronization & Deadlocks',
      icon: 'fa-solid fa-lock',
      component: ConcurrencySyncVisualizer,
      description: 'Thread monitors, object headers, lock acquisition, and wait-notify rings.'
    }
  ],
  DSA: [
    {
      id: 'arraylist',
      name: 'ArrayList Resizing',
      icon: 'fa-solid fa-list-ol',
      component: ArrayListVisualizer,
      description: 'Watch backing array resizing when capacity threshold is breached.'
    },
    {
      id: 'linkedlist',
      name: 'Linked List',
      icon: 'fa-solid fa-link',
      component: LinkedListVisualizer,
      description: 'Manipulate pointers for dynamic insertions and deletions at Head or Tail.'
    },
    {
      id: 'stack',
      name: 'Stack (LIFO)',
      icon: 'fa-solid fa-layer-group',
      component: StackVisualizer,
      description: 'Simulate LIFO properties via push and pop animations.'
    },
    {
      id: 'queue',
      name: 'Queue (FIFO)',
      icon: 'fa-solid fa-people-arrows',
      component: QueueVisualizer,
      description: 'Simulate FIFO properties via enqueue and dequeue actions.'
    },
    {
      id: 'hashmap',
      name: 'HashMap collision',
      icon: 'fa-solid fa-hashtag',
      component: HashMapVisualizer,
      description: 'Calculate hashes, resolve separate chaining collisions, and observe load-factor triggers.'
    },
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      icon: 'fa-solid fa-arrow-down-up-lock',
      component: MergeSortVisualizer,
      description: 'Visualize divide-and-conquer splits and dynamic sorted merges.'
    },
    {
      id: 'graph-traversal',
      name: 'Graph Traversal',
      icon: 'fa-solid fa-circle-nodes',
      component: GraphTraversalVisualizer,
      description: 'Run animated Breadth-First (BFS) and Depth-First (DFS) traversals on interactive nodes.'
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      icon: 'fa-solid fa-magnifying-glass',
      component: BinarySearchVisualizer,
      description: 'Dynamic low/mid/high pointer updates for standard search and upper/lower bounds.'
    },
    {
      id: 'bst-tree',
      name: 'Binary Search Tree',
      icon: 'fa-solid fa-tree',
      component: BstVisualizer,
      description: 'Interactive node insertions, traversals, and dynamic deletion refactorings.'
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      icon: 'fa-solid fa-arrow-up-down-left-right',
      component: QuickSortVisualizer,
      description: 'Visualize in-place pivot partitions and scanner swap iterations.'
    },
    {
      id: 'avl-tree',
      name: 'AVL Tree',
      icon: 'fa-solid fa-folder-tree',
      component: AvlVisualizer,
      description: 'Learn self-balancing binary search trees with single (LL/RR) and double (LR/RL) height rotation animations.'
    },
    {
      id: 'heap-dsa',
      name: 'Binary Heap',
      icon: 'fa-solid fa-mountain',
      component: HeapVisualizer,
      description: 'Observe Min-Heaps and Max-Heaps, bubble-up/down swap animations, and Priority Queue elements.'
    },
    {
      id: 'trie-visual',
      name: 'Trie (Prefix Tree)',
      icon: 'fa-solid fa-network-wired',
      component: TrieVisualizer,
      description: 'Master prefix character trees, word queries, prefix lookups, and auto-complete DFS listings.'
    },
    {
      id: 'dijkstra-graph',
      name: 'Dijkstra Algorithm',
      icon: 'fa-solid fa-route',
      component: DijkstraVisualizer,
      description: 'Solve shortest paths on weighted graphs using greedy node relaxations and Priority Queue tracking.'
    },
    {
      id: 'topo-sort',
      name: 'Topological Sort',
      icon: 'fa-solid fa-diagram-next',
      component: TopoSortVisualizer,
      description: 'Solve course prerequisites and linear ordering on DAGs using Kahn\'s BFS in-degree algorithm.'
    }
  ],
  SYSTEM_DESIGN: [
    {
      id: 'client-server',
      name: 'Client-Server API',
      icon: 'fa-solid fa-network-wired',
      component: ClientServerVisualizer,
      description: 'Animate request/response lifecycles between Client, DNS, Load Balancer, Web Server, and Database.'
    },
    {
      id: 'rest-api',
      name: 'REST API Lifecycle',
      icon: 'fa-solid fa-cloud-arrow-down',
      component: RestApiLifecycleVisualizer,
      description: 'Simulate HTTP request methods (GET, POST, PUT, DELETE), header structures, and response codes.'
    },
    {
      id: 'jwt-auth',
      name: 'JWT Auth Flow',
      icon: 'fa-solid fa-key',
      component: JwtAuthVisualizer,
      description: 'Visualize credential logins, cryptographic token signatures, LocalStorage saves, and Bearer headers.'
    },
    {
      id: 'session-auth',
      name: 'Session Auth Flow',
      icon: 'fa-solid fa-user-shield',
      component: SessionAuthVisualizer,
      description: 'Explore stateful sessions stored inside Redis cache, cookie header updates, and server lookups.'
    },
    {
      id: 'load-balancer',
      name: 'Load Balancer',
      icon: 'fa-solid fa-scale-balanced',
      component: LoadBalancerVisualizer,
      description: 'Route requests dynamically using Round Robin, Least Connections, and IP Hash algorithms across servers.'
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache Workflows',
      icon: 'fa-solid fa-database',
      component: RedisCacheVisualizer,
      description: 'Compare Cache Hits vs Cache Misses, latency offsets, database lookups, and cache writing.'
    },
    {
      id: 'cdn-system',
      name: 'CDN Systems',
      icon: 'fa-solid fa-globe',
      component: CdnVisualizer,
      description: 'Deliver static media assets using localized edge proxy caching to lower physical travel latencies.'
    },
    {
      id: 'message-queue',
      name: 'Message Queues',
      icon: 'fa-solid fa-envelope-open-text',
      component: MessageQueueVisualizer,
      description: 'Decouple high-traffic components using buffers (RabbitMQ/SQS), worker polling, and backpressure.'
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      icon: 'fa-solid fa-road',
      component: ApiGatewayVisualizer,
      description: 'Manage microservice accesses using centralized gateways handling routing, rate limits, and authentication.'
    },
    {
      id: 'db-replication',
      name: 'Database Replication',
      icon: 'fa-solid fa-clone',
      component: DbReplicationVisualizer,
      description: 'Maintain High Availability with Primary-Secondary syncing, query splits, and failovers.'
    },
    {
      id: 'horizontal-scaling',
      name: 'Horizontal Scaling',
      icon: 'fa-solid fa-network-wired',
      component: HorizontalScalingVisualizer,
      description: 'Understand how to distribute workloads by scaling stateless application servers horizontally.'
    },
    {
      id: 'vertical-scaling',
      name: 'Vertical Scaling',
      icon: 'fa-solid fa-arrow-up-right-dots',
      component: VerticalScalingVisualizer,
      description: 'Understand resource limits, bottlenecks, and single point of failure states on individual servers.'
    },
    {
      id: 'db-sharding',
      name: 'Database Sharding',
      icon: 'fa-solid fa-border-all',
      component: DbShardingVisualizer,
      description: 'Learn how to split large datasets horizontally across multiple database node shards.'
    },
    {
      id: 'failover-system',
      name: 'Failover & Recovery',
      icon: 'fa-solid fa-heartbeat',
      component: FailoverSystemVisualizer,
      description: 'Observe active-passive setups, heartbeat monitoring, crashes, and DNS promotions.'
    },
    {
      id: 'rate-limiting',
      name: 'Rate Limiting',
      icon: 'fa-solid fa-hand-back-fist',
      component: RateLimitingVisualizer,
      description: 'Interact with Token Bucket and Leaky Bucket algorithms, monitoring client queues.'
    },
    {
      id: 'circuit-breaker',
      name: 'Circuit Breaker Pattern',
      icon: 'fa-solid fa-bolt',
      component: CircuitBreakerVisualizer,
      description: 'Simulate closed, open, and half-open states to handle downstream service crashes.'
    },
    {
      id: 'queue-load-leveling',
      name: 'Queue Load Leveling',
      icon: 'fa-solid fa-filter',
      component: QueueLoadLevelingVisualizer,
      description: 'Buffer high-traffic writes through message queues to protect core databases.'
    },
    {
      id: 'microservices',
      name: 'Microservices Architecture',
      icon: 'fa-solid fa-cubes',
      component: MicroservicesVisualizer,
      description: 'Contrast monolithic designs with decoupled microservices, noting routing, database ownership, and fault isolation.'
    },
    {
      id: 'event-driven',
      name: 'Event-Driven Architecture',
      icon: 'fa-solid fa-shuffle',
      component: EventDrivenVisualizer,
      description: 'Stream events asynchronously via offset broker logs to decoupled parallel consumer queues.'
    },
    {
      id: 'cap-theorem',
      name: 'CAP Theorem',
      icon: 'fa-solid fa-triangle-exclamation',
      component: CapTheoremVisualizer,
      description: 'Explore Consistency vs Availability constraints and partition recovery pathways.'
    },
    {
      id: 'service-discovery',
      name: 'Service Discovery',
      icon: 'fa-solid fa-magnifying-glass-location',
      component: ServiceDiscoveryVisualizer,
      description: 'Trace dynamic IP registrations, health checks, and server/client-side discovery routing.'
    },
    {
      id: 'distributed-cache',
      name: 'Distributed Caching',
      icon: 'fa-solid fa-boxes-stacked',
      component: DistributedCacheVisualizer,
      description: 'Examine write-through vs write-back latency pathways, cache hits, and invalidations.'
    },
    {
      id: 'consistent-hashing',
      name: 'Consistent Hashing',
      icon: 'fa-solid fa-arrows-spin',
      component: ConsistentHashingVisualizer,
      description: 'Map servers and keys to a circular ring to optimize node joins and crashes.'
    },
    {
      id: 'distributed-locks',
      name: 'Distributed Locks',
      icon: 'fa-solid fa-lock-open',
      component: DistributedLocksVisualizer,
      description: 'Prevent state corruption using Redlock leases, timeouts, and fencing tokens.'
    },
    {
      id: 'pub-sub',
      name: 'Pub/Sub Architecture',
      icon: 'fa-solid fa-tower-broadcast',
      component: PubSubVisualizer,
      description: 'Publish messages to logical topic channels and watch broker asynchronous broadcasts.'
    },
    {
      id: 'websocket-system',
      name: 'WebSockets Architecture',
      icon: 'fa-solid fa-comments',
      component: WebsocketSystemVisualizer,
      description: 'Open persistent, full-duplex TCP WebSocket tunnels to bypass HTTP headers overhead.'
    },
    {
      id: 'dns-system',
      name: 'DNS Resolver Flow',
      icon: 'fa-solid fa-globe',
      component: DnsSystemVisualizer,
      description: 'Trace recursive lookups down Root, TLD, and Authoritative Nameserver nodes.'
    },
    {
      id: 'graphql-api',
      name: 'GraphQL vs REST',
      icon: 'fa-solid fa-code-compare',
      component: GraphqlApiVisualizer,
      description: 'Compare REST API under-fetching roundtrips to single entry GraphQL query schemas.'
    },
    {
      id: 'pacelc-theorem',
      name: 'PACELC Theorem',
      icon: 'fa-solid fa-scale-unbalanced',
      component: PacelcTheoremVisualizer,
      description: 'Examine Latency vs Consistency trade-offs during normal operations alongside partitions.'
    }
  ],
  DATABASE: [
    {
      id: 'db-table-sim',
      name: 'Database Table Simulator',
      icon: 'fa-solid fa-table',
      component: DbTableSimulator,
      description: 'Add, update, and delete rows with real-time primary key checks.'
    },
    {
      id: 'primary-key-viz',
      name: 'Primary Key Constraints',
      icon: 'fa-solid fa-key',
      component: PrimaryKeyVisualizer,
      description: 'Observe duplicate key scans, null constraint rejections, and success commits.'
    },
    {
      id: 'foreign-key-viz',
      name: 'Foreign Key Constraints',
      icon: 'fa-solid fa-link',
      component: ForeignKeyVisualizer,
      description: 'Trace parent-child table linkages, CASCADE deletes, and RESTRICT blocking rules.'
    },
    {
      id: 'sql-joins',
      name: 'SQL Joins',
      icon: 'fa-solid fa-circle-nodes',
      component: SqlJoinsVisualizer,
      description: 'Interactive Join operations (INNER, LEFT, RIGHT, FULL, CROSS, SELF) with live datasets.'
    },
    {
      id: 'db-indexing',
      name: 'Database Indexes',
      icon: 'fa-solid fa-search-plus',
      component: DbIndexingVisualizer,
      description: 'Compare Full Table Scans vs Index seeks. Verify page read counters.'
    },
    {
      id: 'b-plus-tree',
      name: 'B+ Tree Indexing',
      icon: 'fa-solid fa-sitemap',
      component: BPlusTreeVisualizer,
      description: 'Understand node traversals, splits, leaf page sequence linked lists, and re-balancing.'
    },
    {
      id: 'query-execution-engine',
      name: 'SQL Query Execution',
      icon: 'fa-solid fa-play',
      component: QueryExecutionVisualizer,
      description: 'Trace query syntax parsing, cost-based optimization, and physical plan retrievals.'
    },
    {
      id: 'normalization-lab',
      name: 'Normalization Lab',
      icon: 'fa-solid fa-border-all',
      component: NormalizationVisualizer,
      description: 'Decompose database tables from 1NF to 3NF. Resolve transitive and partial dependencies.'
    },
    {
      id: 'acid-transactions',
      name: 'ACID Transactions',
      icon: 'fa-solid fa-wallet',
      component: AcidTransactionsVisualizer,
      description: 'Simulate money transfers, abort crashes, rollbacks, and committed durability writes.'
    },
    {
      id: 'concurrency-control',
      name: 'Concurrency & Locking',
      icon: 'fa-solid fa-lock',
      component: DbLockingVisualizer,
      description: 'Observe Shared vs Exclusive conflicts, transaction wait states, and deadlock detector sweep resolutions.'
    },
    {
      id: 'mongodb-document',
      name: 'MongoDB Document',
      icon: 'fa-solid fa-file-code',
      component: MongoDocumentVisualizer,
      description: 'Examine collections, BSON nested document fields, arrays, and embedded objects.'
    },
    {
      id: 'mongodb-aggregation',
      name: 'MongoDB Aggregations',
      icon: 'fa-solid fa-filter',
      component: MongoAggregationVisualizer,
      description: 'Stream documents sequentially through match, group, sort, and project pipeline stages.'
    },
    {
      id: 'cache-visualizer',
      name: 'Cache Workflows',
      icon: 'fa-solid fa-bolt',
      component: DbCacheVisualizer,
      description: 'Trace Redis cache hit/miss queries, TTL invalidations, and database write-backs.'
    },
    {
      id: 'db-sharding-viz',
      name: 'Horizontal Sharding',
      icon: 'fa-solid fa-server',
      component: DbShardingDbVisualizer,
      description: 'Map range-based query routing to targeted database shards.'
    },
    {
      id: 'db-replication-viz',
      name: 'Master-Replica replication',
      icon: 'fa-solid fa-copy',
      component: DbReplicationDbVisualizer,
      description: 'Model write propagations, asynchronous lags, read scalings, and replica promotions.'
    },
    {
      id: 'cap-theorem-viz',
      name: 'CAP Theorem',
      icon: 'fa-solid fa-triangle-exclamation',
      component: DbCapVisualizer,
      description: 'Contrast Cassandra AP availability staleness with HBase CP consistency write rejects under partition.'
    },
    {
      id: 'query-optimizer',
      name: 'Query Optimizer',
      icon: 'fa-solid fa-brain',
      component: QueryOptimizerVisualizer,
      description: 'Trace query parsing, predicate pushdowns, join costs, and optimal physical execution plans.'
    },
    {
      id: 'materialized-views',
      name: 'Materialized Views',
      icon: 'fa-solid fa-eye',
      component: MaterializedViewsVisualizer,
      description: 'Persist query aggregates to disk. Compare immediate vs manual refreshes and page scans.'
    },
    {
      id: 'oltp-olap',
      name: 'OLTP vs OLAP',
      icon: 'fa-solid fa-chart-line',
      component: OltpOlapVisualizer,
      description: 'Contrast row-oriented transactional stores (OLTP) with column-oriented analytics (OLAP) memory layouts.'
    },
    {
      id: 'data-warehousing',
      name: 'Data Warehousing',
      icon: 'fa-solid fa-warehouse',
      component: DataWarehousingVisualizer,
      description: 'Ingest operational RDBMS, APIs, and web click log files through staging ETL pipelines into warehouses.'
    },
    {
      id: 'snowflake-schema',
      name: 'Snowflake Schema',
      icon: 'fa-solid fa-snowflake',
      component: SnowflakeSchemaVisualizer,
      description: 'Model a central fact table surrounded by nested, normalized dimension table hierarchies.'
    },
    {
      id: 'star-schema',
      name: 'Star Schema',
      icon: 'fa-solid fa-star',
      component: StarSchemaVisualizer,
      description: 'Model a central fact table surrounded by denormalized flat dimension tables for low-join queries.'
    },
    {
      id: 'distributed-databases',
      name: 'Distributed Databases',
      icon: 'fa-solid fa-network-wired',
      component: DistributedDatabasesVisualizer,
      description: 'Simulate distributed Raft consensus syncing, quorum checks, leader crashes, and follower election campaigns.'
    },
    {
      id: 'event-sourcing',
      name: 'Event Sourcing',
      icon: 'fa-solid fa-history',
      component: EventSourcingVisualizer,
      description: 'Reconstruct state by replaying chronological immutable event ledgers and capturing checkpoints.'
    },
    {
      id: 'cqrs',
      name: 'CQRS Pattern',
      icon: 'fa-solid fa-arrows-split-up-and-left',
      component: CqrsVisualizer,
      description: 'Segregate writes (Command model) from reads (Query model) and observe eventual consistency syncing lags.'
    },
    {
      id: 'cdc-pattern',
      name: 'Change Data Capture (CDC)',
      icon: 'fa-solid fa-clock-rotate-left',
      component: CdcPatternVisualizer,
      description: 'Tail Write-Ahead Log (WAL) binary files, publish row mutations, and sync search index engines in real-time.'
    },
    {
      id: 'elasticsearch',
      name: 'Elasticsearch Indexing',
      icon: 'fa-solid fa-search',
      component: ElasticsearchVisualizer,
      description: 'Analyze text through tokenization, stopwords, and stemming pipelines into Inverted Index postings.'
    },
    {
      id: 'vector-databases',
      name: 'Vector Databases',
      icon: 'fa-solid fa-shapes',
      component: VectorDatabasesVisualizer,
      description: 'Plot high-dimensional embeddings, compute Cosine similarity distance, and find semantic nearest neighbors.'
    },
    {
      id: 'postgresql-internals',
      name: 'PostgreSQL Internals',
      icon: 'fa-solid fa-gears',
      component: PostgresInternalsVisualizer,
      description: 'Manage shared buffer dirty frames, MVCC xmin/xmax tuple visibility, and vacuum dead space sweeps.'
    }
  ]
};
