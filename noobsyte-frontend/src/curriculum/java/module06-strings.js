export default {
  id: 'module06-strings',
  title: 'Module 6: Strings & Memory Pool',
  lessons: [
  {
    "id": "java-strings",
    "title": "Strings & String Pool",
    "slug": "java-strings",
    "description": "Learn about String immutability, the String Constant Pool, StringBuilder, and StringBuffer.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "string-pool",
    "objectives": [
      "Understand why String objects are immutable in Java",
      "Explain the JVM String Constant Pool memory reuse",
      "Contrast String, StringBuilder, and StringBuffer"
    ],
    "theory": "<h3>Strings & String Pool</h3>\n<p>In Java, a <code>String</code> is an object that represents a sequence of characters. Unlike standard objects, strings are <strong>immutable</strong>—once created, their value cannot be changed.</p>\n<h4>1. String Constant Pool (SCP)</h4>\n<p>To optimize memory, the JVM stores string literals in a special memory area within the Heap called the <strong>String Constant Pool</strong>. When you write:</p>\n<pre><code>String s1 = \"Hello\";\nString s2 = \"Hello\";</code></pre>\n<p>The JVM checks the SCP. If \"Hello\" already exists, it assigns the existing reference to <code>s2</code>. No new object is created. However, if you use the <code>new</code> keyword:</p>\n<pre><code>String s3 = new String(\"Hello\");</code></pre>\n<p>The JVM is forced to create a new <code>String</code> object in the normal Heap memory, bypassing SCP reuse. This wastes memory.</p>\n<h4>2. StringBuilder vs. StringBuffer</h4>\n<p>If you perform heavy string modifications (like concatenating in a loop), using <code>String</code> creates thousands of temporary garbage objects. Instead, use mutable classes:</p>\n<ul>\n  <li><strong>StringBuilder:</strong> Fast, mutable, but <strong>not thread-safe</strong>. Best for single-threaded loops.</li>\n  <li><strong>StringBuffer:</strong> Fast, mutable, and <strong>thread-safe</strong> (all methods are synchronized). Use in multithreaded environments.</li>\n</ul>",
    "analogy": "<h3>Real-Life Analogy: The Hotel Key Cabinet</h3>\n<p>Think of the String Constant Pool as a hotel key cabinet. When guests ask for the key to Room 101, the hotel manager doesn't cut a new key. They check the cabinet, see that key 101 already exists, and hand it over. If a guest explicitly demands their own custom copy of Key 101 printed from scratch, the manager has to forge a new key (representing <code>new String(\"101\")</code>) which takes extra space and resources.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: Why is String immutable in Java?</strong><br/>A: Security (strings carry DB credentials, connection parameters), caching (String Pool), and thread safety (immutable objects are naturally thread-safe).</li>\n  <li><strong>Q: How do you check if two Strings are equal?</strong><br/>A: Always use <code>.equals()</code> for semantic value checking. The <code>==</code> operator compares reference memory addresses.</li>\n</ul>",
    "commonMistakes": "<p><strong>Concatenating Strings in a loop:</strong> Writing <code>str += i;</code> inside a loop creates a new String object on each iteration, causing high garbage collection overhead. Always use <code>StringBuilder.append()</code> instead.</p>",
    "practiceProblems": [
      {
        "title": "Reverse a String",
        "problemText": "Write a program to reverse a given string without using built-in reverse functions.",
        "solution": "Use a loop starting from the end of the string to the beginning, appending characters to a StringBuilder."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Which memory segment contains the String Constant Pool in modern JVMs?",
          "options": [
            {
              "text": "The Stack Area",
              "isCode": false
            },
            {
              "text": "The Method Area (Metaspace)",
              "isCode": false
            },
            {
              "text": "The Heap Area",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 2,
          "explanation": "In modern Java versions (Java 7 and above), the String Constant Pool resides directly inside the Heap Area for efficient garbage collection."
        }
      ]
    }
  }
]
};