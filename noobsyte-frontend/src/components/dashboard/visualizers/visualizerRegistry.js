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
      id: 'sql-joins',
      name: 'SQL Joins',
      icon: 'fa-solid fa-circle-nodes',
      isPlaceholder: true,
      difficulty: 'Beginner',
      frequency: 'Very High',
      objective: 'Venn diagram overlaps of INNER, LEFT, RIGHT, and FULL OUTER joins.',
      features: ['Venn diagram selector', 'Interactive tables', 'Resulting join output table', 'Compiled SQL query builder'],
      previewType: 'joins'
    },
    {
      id: 'db-indexing',
      name: 'Database Indexes',
      icon: 'fa-solid fa-search-plus',
      isPlaceholder: true,
      difficulty: 'Intermediate',
      frequency: 'High',
      objective: 'Compare full-table scans vs Index scans (pointer lookups).',
      features: ['Un-indexed query speed test', 'B-Tree Index scan path', 'Page Read operations counter', 'Scan path highlighter'],
      previewType: 'indexing'
    },
    {
      id: 'b-plus-tree',
      name: 'B+ Tree Indexing',
      icon: 'fa-solid fa-sitemap',
      isPlaceholder: true,
      difficulty: 'Advanced',
      frequency: 'High',
      objective: 'Multi-level branch node traversal down to leaf sequential lists.',
      features: ['Search Key path', 'Root/Internal/Leaf nodes representation', 'Leaf page sequence links', 'Range query scan path'],
      previewType: 'bplus'
    },
    {
      id: 'mongodb-aggregation',
      name: 'MongoDB Aggregations',
      icon: 'fa-solid fa-filter',
      isPlaceholder: true,
      difficulty: 'Intermediate',
      frequency: 'High',
      objective: 'Dynamic pipelines: $match -> $group -> $sort -> $project step filters.',
      features: ['Document records input', '$match stage filter', '$group accumulators', 'Stage output records list'],
      previewType: 'aggregation'
    }
  ]
};
