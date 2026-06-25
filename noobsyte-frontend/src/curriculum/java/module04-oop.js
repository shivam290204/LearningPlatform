export default {
  id: 'module04-oop',
  title: 'Module 4: Object-Oriented Programming (OOP)',
  lessons: [
  {
    "id": "oop-basics",
    "title": "OOP Basics (Classes, Objects, Constructors)",
    "slug": "oop-basics",
    "description": "Deep dive into OOP Basics (Classes, Objects, Constructors) conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Master the core rules of OOP Basics (Classes, Objects, Constructors)",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>OOP Basics: Blueprints & Instances</h3>\n<p>Object-Oriented Programming models systems using classes and objects:</p>\n<ul>\n  <li><strong>Class:</strong> The blueprint defining variables and methods.</li>\n  <li><strong>Object:</strong> A concrete instance of the class allocated in Heap memory.</li>\n  <li><strong>Constructor:</strong> A special method called with the <code>new</code> keyword to initialize new object states.</li>\n</ul>",
    "analogy": "Think of this as structuring standard execution patterns.",
    "interviewNotes": "Explain core operations and visual workflows.",
    "commonMistakes": "Watch for edge cases and initialization triggers.",
    "practiceProblems": [
      {
        "title": "Code Lab",
        "problemText": "Write a basic demo implementation of the concept.",
        "solution": "// Reference the theory above"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Where are instance variables allocated in JVM memory?",
          "options": [
            {
              "text": "Directly in the Stack Frame",
              "isCode": false
            },
            {
              "text": "On the shared Heap as part of the allocated object structure",
              "isCode": false
            },
            {
              "text": "Inside the compilation class cache",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Instance variables reside on the Heap, packed inside the memory slot of the object they belong to."
        }
      ]
    }
  },
  {
    "id": "classes-objects",
    "title": "classes-objects",
    "slug": "classes-objects",
    "description": "Module placeholder",
    "difficulty": "Beginner",
    "estTime": "20 min",
    "quizAvailable": false,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [],
    "theory": "",
    "analogy": "",
    "interviewNotes": "",
    "commonMistakes": "",
    "practiceProblems": [],
    "quiz": null
  },
  {
    "id": "encapsulation",
    "title": "encapsulation",
    "slug": "encapsulation",
    "description": "Module placeholder",
    "difficulty": "Beginner",
    "estTime": "20 min",
    "quizAvailable": false,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [],
    "theory": "",
    "analogy": "",
    "interviewNotes": "",
    "commonMistakes": "",
    "practiceProblems": [],
    "quiz": null
  }
]
};