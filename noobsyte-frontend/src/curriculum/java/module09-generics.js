export default {
  id: 'module09-generics',
  title: 'Module 9: Generics & Type Safety',
  lessons: [
  {
    "id": "java-generics",
    "title": "Java Generics",
    "slug": "java-generics",
    "description": "Learn about parameterized types, compile-time safety, wildcard configurations, and type erasure.",
    "difficulty": "Intermediate",
    "estTime": "18 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "wrapper-classes",
    "objectives": [
      "Define generic classes, interfaces, and methods",
      "Explain compile-time type safety advantages",
      "Understand Type Erasure mechanics in the JVM"
    ],
    "theory": "<h3>Java Generics & Type Safety</h3>\n<p>Generics were introduced in Java 5 to enable types (classes and methods) to be parameterized. It allows developers to write classes that handle various object types with strict type checking at compile-time.</p>\n<h4>1. Why Use Generics?</h4>\n<p>Before generics, collections stored raw <code>Object</code> references, requiring unsafe explicit casts:</p>\n<pre><code>List list = new ArrayList();\nlist.add(\"Hello\");\nString s = (String) list.get(0); // Risk of ClassCastException at runtime</code></pre>\n<p>With Generics, type errors are caught during compilation:</p>\n<pre><code>List&lt;String&gt; list = new ArrayList&lt;&gt;();\nlist.add(\"Hello\");\nString s = list.get(0); // Safe compile-checked assignment</code></pre>\n<h4>2. Type Erasure</h4>\n<p>To ensure backward compatibility with older Java versions, the Java compiler uses **Type Erasure**. It replaces all generic type parameters with their bounds (usually <code>Object</code>) during compilation. Thus, type parameter information is completely absent in the compiled <code>.class</code> bytecode at runtime.</p>",
    "analogy": "<h3>Real-Life Analogy: Prescribed Boxes</h3>\n<p>Think of generics as shipping boxes with explicit labels. A box labeled \"Medicines Only\" prevents workers from placing toys inside at the warehouse (representing compile-time checks). Once the cargo is loaded onto the train, the labels are ignored, and it's treated as standard cargo cargo (representing Type Erasure), but the safety check has already been guaranteed.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: What is Type Erasure?</strong><br/>A: The process where the Java compiler replaces generic types with their upper bound or Object, removing type parameter info from runtime bytecode.</li>\n</ul>",
    "commonMistakes": "<p><strong>Instantiating generic arrays:</strong> Writing <code>T[] array = new T[10];</code> is illegal in Java because type parameters are not available at runtime due to erasure.</p>",
    "practiceProblems": [
      {
        "title": "Generic Swap Method",
        "problemText": "Write a generic method to swap elements in an array.",
        "solution": "public <T> void swap(T[] arr, int i, int j) { T temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; }"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What happens to generic type parameters after compilation?",
          "options": [
            {
              "text": "They are retained as metadata inside the Heap objects",
              "isCode": false
            },
            {
              "text": "They are removed from the bytecode via Type Erasure",
              "isCode": false
            },
            {
              "text": "They are converted to runtime reflections descriptors",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Generics are a compile-time feature. The compiler removes them during compilation to maintain backward compatibility, replacing them with Object or bounds."
        }
      ]
    }
  }
]
};