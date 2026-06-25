export default {
  id: 'module15-design-patterns',
  title: 'Module 15: Software Design Patterns',
  lessons: [
  {
    "id": "java-design-patterns",
    "title": "Software Design Patterns",
    "slug": "java-design-patterns",
    "description": "Learn industry-standard architectural patterns like Singleton, Factory, Builder, and Observer.",
    "difficulty": "Advanced",
    "estTime": "25 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "jvm-architecture",
    "objectives": [
      "Implement thread-safe Singleton designs",
      "Construct objects using Factory and Builder patterns",
      "Apply behavioral Observer configurations"
    ],
    "theory": "<h3>Java Software Design Patterns</h3>\n<p>Design patterns are repeatable, tested solutions to common software design problems. They categorize into Creational, Structural, and Behavioral patterns.</p>\n<h4>1. Singleton Pattern</h4>\n<p>Ensures a class has only <em>one</em> instance and provides a global access point to it. A thread-safe double-checked locking Singleton looks like this:</p>\n<pre><code>public class DatabaseConnection {\n  private static volatile DatabaseConnection instance;\n  private DatabaseConnection() {} // Private constructor\n  \n  public static DatabaseConnection getInstance() {\n    if (instance == null) {\n      synchronized (DatabaseConnection.class) {\n        if (instance == null) {\n          instance = new DatabaseConnection();\n        }\n      }\n    }\n    return instance;\n  }\n}</code></pre>\n<h4>2. Factory Pattern</h4>\n<p>Delegates object instantiation logic to a separate helper class, abstracting construction details from the client.</p>\n<h4>3. Builder Pattern</h4>\n<p>Solves the issue of constructors with too many parameters (telescoping constructors) by constructing objects step-by-step using a nested Builder class.</p>",
    "analogy": "<h3>Real-Life Analogy: The Construction Blueprint</h3>\n<p>Rather than designing custom window hinges and doorframes for every house (which is error-prone), architect communities reuse pre-approved, safe blueprints (Design Patterns) like single-entry lobbies (Singleton) or standardized window modules (Factory).</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: Why is the Singleton instance marked as volatile?</strong><br/>A: To ensure visibility of changes across threads, preventing other threads from reading a half-initialized instance created during double-checked locking.</li>\n</ul>",
    "commonMistakes": "<p><strong>Lazy Singleton without thread synchronization:</strong> Creating a Singleton in multithreaded apps without synchronizing the creation method results in duplicate instances.</p>",
    "practiceProblems": [
      {
        "title": "Implement Builder Pattern",
        "problemText": "Create a Student class with name, age, rollNo, and address, implementing the Builder pattern.",
        "solution": "Define a nested StudentBuilder class with setter-like methods returning this, and a build() method returning the Student object."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Which keyword is critical in double-checked locking Singleton to prevent reference cache visibility issues?",
          "options": [
            {
              "text": "transient",
              "isCode": false
            },
            {
              "text": "volatile",
              "isCode": false
            },
            {
              "text": "synchronized",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "The volatile keyword guarantees that modifications to the Singleton instance variable are written to and read from main memory immediately, preventing cached half-initialized object reads."
        }
      ]
    }
  }
]
};