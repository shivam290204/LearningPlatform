export default {
  id: 'module02-control-flow',
  title: 'Module 2: Control Flow & Conditionals',
  lessons: [
  {
    "id": "control-structures",
    "title": "Control Structures & Conditionals",
    "slug": "control-structures",
    "description": "Deep dive into Control Structures & Conditionals conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Master the core rules of Control Structures & Conditionals",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>Control Structures & Conditionals</h3>\n<p>Control flow statement execution is managed using conditional checks and loops:</p>\n<ul>\n  <li><code>if-else</code> blocks evaluate Boolean expressions to fork paths.</li>\n  <li><code>switch</code> statements match values (primitives, Enums, Strings) to labeled code blocks.</li>\n  <li>Loops (<code>for</code>, <code>while</code>, <code>do-while</code>) repeat logic paths until their condition evaluates to false.</li>\n</ul>",
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
          "questionText": "Which conditional check is optimal for matching a single variable against multiple exact constant values?",
          "options": [
            {
              "text": "Nested if-else statements",
              "isCode": false
            },
            {
              "text": "switch-case blocks",
              "isCode": false
            },
            {
              "text": "for loops",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "The switch-case block is optimized for testing a single variable against multiple discrete, constant cases."
        }
      ]
    }
  }
]
};