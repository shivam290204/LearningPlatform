export default {
  id: 'module03-methods',
  title: 'Module 3: Methods & Execution',
  lessons: [
  {
    "id": "java-functions",
    "title": "Functions & Method Execution",
    "slug": "java-functions",
    "description": "Deep dive into Functions & Method Execution conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Master the core rules of Functions & Method Execution",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>Functions & Method Execution</h3>\n<p>In Java, functions are called **Methods** and must belong to a class. They encapsulate reusable blocks of statements.</p>\n<p>Each time a method is called, a new Stack Frame is created containing its parameters and local variables. Java is strictly **pass-by-value**, meaning it passes copies of primitive values or copied object reference pointers.</p>",
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
          "questionText": "What parameter passing strategy does Java utilize?",
          "options": [
            {
              "text": "Pass-by-reference",
              "isCode": false
            },
            {
              "text": "Pass-by-value",
              "isCode": false
            },
            {
              "text": "Dynamic binding scope",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Java is strictly pass-by-value. For objects, the value passed is a copy of the memory address reference pointer."
        }
      ]
    }
  }
]
};