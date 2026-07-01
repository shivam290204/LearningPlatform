export default {
  id: 'module13-java8-features',
  title: 'Module 13: Java 8 Features',
  lessons: [
  {
    "id": "java-8-features",
    "title": "Java 8 Features",
    "slug": "java-8-features",
    "description": "Master Lambda expressions, Functional Interfaces, Streams API pipelining, and the Optional container.",
    "difficulty": "Intermediate",
    "estTime": "22 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "wrapper-classes",
    "visualizations": [],
    "objectives": [
      "Write Lambda expressions and Method References",
      "Utilize built-in Functional Interfaces",
      "Build map-filter-reduce pipelines with the Streams API"
    ],
    "content": "<h3>Java 8 Functional Programming Features</h3>\n<p>Java 8 introduced functional programming concepts to Java, enabling cleaner, more expressive code.</p>\n<h4>1. Lambda Expressions & Functional Interfaces</h4>\n<p>A lambda expression is an anonymous method (without a name or return type) that can be passed around as a first-class citizen. It implements a <strong>Functional Interface</strong>—an interface having exactly <em>one</em> abstract method (e.g. <code>Runnable</code>, <code>Predicate</code>, <code>Function</code>).</p>\n<h4>2. Streams API</h4>\n<p>The <code>java.util.stream</code> package provides a pipeline to process collections of objects in a declarative style. Stream operations are chained:</p>\n<pre><code>List&lt;String&gt; filtered = list.stream()\n  .filter(name -> name.startsWith(\"A\"))\n  .map(String::toUpperCase)\n  .collect(Collectors.toList());</code></pre>\n<p>Stream operations are <strong>lazy</strong>—intermediate operations (like <code>filter</code>) are not executed until a terminal operation (like <code>collect</code>) is invoked.</p>",
    "theory": "<h3>Java 8 Functional Programming Features</h3>\n<p>Java 8 introduced functional programming concepts to Java, enabling cleaner, more expressive code.</p>\n<h4>1. Lambda Expressions & Functional Interfaces</h4>\n<p>A lambda expression is an anonymous method (without a name or return type) that can be passed around as a first-class citizen. It implements a <strong>Functional Interface</strong>—an interface having exactly <em>one</em> abstract method (e.g. <code>Runnable</code>, <code>Predicate</code>, <code>Function</code>).</p>\n<h4>2. Streams API</h4>\n<p>The <code>java.util.stream</code> package provides a pipeline to process collections of objects in a declarative style. Stream operations are chained:</p>\n<pre><code>List&lt;String&gt; filtered = list.stream()\n  .filter(name -> name.startsWith(\"A\"))\n  .map(String::toUpperCase)\n  .collect(Collectors.toList());</code></pre>\n<p>Stream operations are <strong>lazy</strong>—intermediate operations (like <code>filter</code>) are not executed until a terminal operation (like <code>collect</code>) is invoked.</p>",
    "analogy": "<h3>Real-Life Analogy: The Assembly Belt</h3>\n<p>The Streams API is like a factory assembly line conveyor belt. Items (data) pass through multiple stations where they are painted (mapped), defective ones are discarded (filtered), and the final batch is packed into boxes (collected).</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: What is the difference between intermediate and terminal operations in Streams?</strong><br/>A: Intermediate operations (map, filter) return a new stream and are lazy. Terminal operations (collect, forEach) trigger execution and return a non-stream result.</li>\n</ul>",
    "commonMistakes": "<p><strong>Reusing a stream:</strong> A stream can only be traversed once. Attempting to call operations on a closed stream throws an <code>IllegalStateException</code>.</p>",
    "practiceProblems": [
      {
        "title": "Filter Even Numbers",
        "problemText": "Given a list of integers, filter out odd numbers and double the even ones using streams.",
        "solution": "list.stream().filter(n -> n % 2 == 0).map(n -> n * 2).collect(Collectors.toList());"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Which Stream operation is terminal and initiates the pipeline execution?",
          "options": [
            {
              "text": "filter",
              "isCode": false
            },
            {
              "text": "map",
              "isCode": false
            },
            {
              "text": "forEach",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 2,
          "explanation": "forEach is a terminal operation that triggers processing, while map and filter are lazy intermediate operations."
        }
      ]
    }
  }
]
};