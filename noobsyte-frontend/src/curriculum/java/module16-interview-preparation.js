export default {
  id: 'module16-interview-preparation',
  title: 'Module 16: Java Interview Preparation',
  lessons: [
  {
    "id": "java-interview-prep",
    "title": "Java Interview Preparation",
    "slug": "java-interview-prep",
    "description": "Learn top Java placement interview concepts, including Reflection API, Annotations, and Garbage Collection tuning.",
    "difficulty": "Advanced",
    "estTime": "30 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "garbage-collection",
    "visualizations": [],
    "objectives": [
      "Explain advanced Reflection API inspect mechanisms",
      "Configure JVM options and Garbage Collection flags",
      "Explain Annotations and custom retention levels"
    ],
    "content": "<h3>Java Interview Preparation Guide</h3>\n<p>This module reviews advanced concepts targeted in core Java placement rounds at major tech firms.</p>\n<h4>1. Reflection API</h4>\n<p>Reflection allows a Java program to inspect, analyze, and modify classes, interfaces, fields, and methods at runtime, bypassing encapsulation barriers:</p>\n<pre><code>Class&lt;?&gt; clazz = Class.forName(\"com.noobsyte.User\");\nConstructor&lt;?&gt; cons = clazz.getDeclaredConstructor();\ncons.setAccessible(true); // Bypass private boundaries\nUser user = (User) cons.newInstance();</code></pre>\n<h4>2. Annotations & Retention</h4>\n<p>Annotations are markers that attach metadata to code without affecting execution logic. They are compiled and have different lifecycles defined by <code>@Retention</code>: Source, Class, or Runtime (accessible via Reflection).</p>",
    "theory": "<h3>Java Interview Preparation Guide</h3>\n<p>This module reviews advanced concepts targeted in core Java placement rounds at major tech firms.</p>\n<h4>1. Reflection API</h4>\n<p>Reflection allows a Java program to inspect, analyze, and modify classes, interfaces, fields, and methods at runtime, bypassing encapsulation barriers:</p>\n<pre><code>Class&lt;?&gt; clazz = Class.forName(\"com.noobsyte.User\");\nConstructor&lt;?&gt; cons = clazz.getDeclaredConstructor();\ncons.setAccessible(true); // Bypass private boundaries\nUser user = (User) cons.newInstance();</code></pre>\n<h4>2. Annotations & Retention</h4>\n<p>Annotations are markers that attach metadata to code without affecting execution logic. They are compiled and have different lifecycles defined by <code>@Retention</code>: Source, Class, or Runtime (accessible via Reflection).</p>",
    "analogy": "<h3>Real-Life Analogy: The Doctor Medical Scan</h3>\n<p>Reflection is like a medical MRI scan. A normal person (compiled class) cannot see their own organs. But an MRI machine (Reflection API) scans the body, reporting and displaying all internal organs, blood vessels, and structure details dynamically.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: What is the drawback of using Reflection?</strong><br/>A: Performance overhead (slow lookups), security violations (accesses private fields), and loss of compile-time safety checks.</li>\n</ul>",
    "commonMistakes": "<p><strong>Overusing reflection:</strong> Accessing private fields via reflection breaks security configurations and slows down operations.</p>",
    "practiceProblems": [
      {
        "title": "Access Private Field",
        "problemText": "Write a class with a private field \"secret\" and use reflection to print it from outside.",
        "solution": "Use getDeclaredField(\"secret\"), setAccessible(true), and field.get(obj) to read the secret value."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Which Annotation RetentionPolicy ensures metadata remains accessible during program execution?",
          "options": [
            {
              "text": "RetentionPolicy.SOURCE",
              "isCode": false
            },
            {
              "text": "RetentionPolicy.CLASS",
              "isCode": false
            },
            {
              "text": "RetentionPolicy.RUNTIME",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 2,
          "explanation": "RetentionPolicy.RUNTIME is the only policy that preserves annotations in bytecode, loading them into Metaspace for access via Reflection at runtime."
        }
      ]
    }
  }
]
};