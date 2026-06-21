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
      isPlaceholder: true,
      difficulty: 'Beginner',
      frequency: 'High',
      objective: 'Observe HTTP request-response lifecycles, HTTP methods, headers, and body payloads.',
      features: ['Send GET/POST request', 'Header Inspector', 'DNS Lookup Simulation', 'Response Status Codes'],
      previewType: 'client-server'
    },
    {
      id: 'jwt-auth',
      name: 'JWT Auth Flow',
      icon: 'fa-solid fa-key',
      isPlaceholder: true,
      difficulty: 'Intermediate',
      frequency: 'High',
      objective: 'Token generation, headers, signature verification, and secure client-side storage.',
      features: ['Login Input', 'Token Signer Inspector', 'LocalStore save', 'Request Interceptor headers'],
      previewType: 'jwt'
    },
    {
      id: 'load-balancer',
      name: 'Load Balancer',
      icon: 'fa-solid fa-scale-balanced',
      isPlaceholder: true,
      difficulty: 'Intermediate',
      frequency: 'Very High',
      objective: 'Round-robin, IP Hash, and Least Connection request distributions across servers.',
      features: ['Request Generator', 'Round-Robin Dispatcher', 'Server Nodes CPU monitor', 'Failover simulation'],
      previewType: 'lb'
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache Workflows',
      icon: 'fa-solid fa-database',
      isPlaceholder: true,
      difficulty: 'Intermediate',
      frequency: 'Very High',
      objective: 'Cache-aside read/write paths, Cache Hits vs Misses, and LRU eviction policy.',
      features: ['DB Read request', 'Cache Hit/Miss indicators', 'Cache-aside write through', 'Eviction animation'],
      previewType: 'redis'
    },
    {
      id: 'message-queue',
      name: 'Message Queues',
      icon: 'fa-solid fa-envelope-open-text',
      isPlaceholder: true,
      difficulty: 'Intermediate',
      frequency: 'High',
      objective: 'Producer-Consumer decouplings, pub/sub topologies, and message acknowledgements.',
      features: ['Producer messages list', 'Queue broker buffer', 'Consumer polling threads', 'Dead Letter Queue'],
      previewType: 'mq'
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
