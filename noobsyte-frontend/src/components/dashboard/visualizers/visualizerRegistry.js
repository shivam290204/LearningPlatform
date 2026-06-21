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
      isPlaceholder: true,
      description: 'Dynamic low/mid/high cursor updates on sorted arrays.'
    },
    {
      id: 'bst-tree',
      name: 'Binary Search Tree',
      icon: 'fa-solid fa-tree',
      isPlaceholder: true,
      description: 'Interactive node insertions, traversals, and balance rotations.'
    },
    {
      id: 'trie-visual',
      name: 'Trie (Prefix Tree)',
      icon: 'fa-solid fa-network-wired',
      isPlaceholder: true,
      description: 'Simulate search auto-completions and prefix merges visually.'
    }
  ],
  SYSTEM_DESIGN: [
    {
      id: 'client-server',
      name: 'Client-Server API',
      icon: 'fa-solid fa-network-wired',
      isPlaceholder: true,
      description: 'HTTP request-response lifecycles, HTTP methods, headers, and body payloads.'
    },
    {
      id: 'jwt-auth',
      name: 'JWT Auth Flow',
      icon: 'fa-solid fa-key',
      isPlaceholder: true,
      description: 'Token generation, headers, signature verification, and secure client-side storage.'
    },
    {
      id: 'load-balancer',
      name: 'Load Balancer',
      icon: 'fa-solid fa-scale-balanced',
      isPlaceholder: true,
      description: 'Round-robin, IP Hash, and Least Connection request distributions across servers.'
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache Workflows',
      icon: 'fa-solid fa-database',
      isPlaceholder: true,
      description: 'Cache-aside read/write paths, Cache Hits vs Misses, and LRU eviction policy.'
    },
    {
      id: 'message-queue',
      name: 'Message Queues',
      icon: 'fa-solid fa-envelope-open-text',
      isPlaceholder: true,
      description: 'Producer-Consumer decouplings, pub/sub topologies, and message acknowledgements.'
    }
  ],
  DATABASE: [
    {
      id: 'sql-joins',
      name: 'SQL Joins',
      icon: 'fa-solid fa-circle-nodes',
      isPlaceholder: true,
      description: 'Venn diagram overlaps of INNER, LEFT, RIGHT, and FULL OUTER joins.'
    },
    {
      id: 'db-indexing',
      name: 'Database Indexes',
      icon: 'fa-solid fa-search-plus',
      isPlaceholder: true,
      description: 'Compare full-table scans vs Index scans (pointer lookups).'
    },
    {
      id: 'b-plus-tree',
      name: 'B+ Tree Indexing',
      icon: 'fa-solid fa-sitemap',
      isPlaceholder: true,
      description: 'Multi-level branch node traversal down to leaf sequential lists.'
    },
    {
      id: 'mongodb-aggregation',
      name: 'MongoDB Aggregations',
      icon: 'fa-solid fa-filter',
      isPlaceholder: true,
      description: 'Dynamic pipelines: $match -> $group -> $sort -> $project step filters.'
    }
  ]
};
