export default {
  id: 'module14-trie',
  title: 'Module 14: Tries',
  lessons: [
  {
    "id": "trie-prefix-tree",
    "title": "Trie (Prefix Tree)",
    "slug": "trie-prefix-tree",
    "description": "Understand the concept of Trie (Prefix Tree) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "trie-visual",
    "visualizations": [],
    "objectives": [
      "Implement Trie (Prefix Tree) structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Trie (Prefix Tree)</h3>\n<p>A **Trie** is a specialized tree structure used for storing strings over an alphabet. Each node contains characters, and paths from the root represent prefixes of strings.</p>\n<p>Tries are optimal for auto-complete search engines, checking spelling, and prefix matching. Lookup runs in <code>O(L)</code> where L is the length of the query string.</p>",
    "theory": "<h3>Trie (Prefix Tree)</h3>\n<p>A **Trie** is a specialized tree structure used for storing strings over an alphabet. Each node contains characters, and paths from the root represent prefixes of strings.</p>\n<p>Tries are optimal for auto-complete search engines, checking spelling, and prefix matching. Lookup runs in <code>O(L)</code> where L is the length of the query string.</p>",
    "analogy": "Think of this like structural sorting in daily logistics.",
    "interviewNotes": "Explain base cases and complexity boundaries.",
    "commonMistakes": "Watch for null pointers and index boundaries.",
    "practiceProblems": [
      {
        "title": "Solve Coding Challenge",
        "problemText": "Implement the concept and test edge cases.",
        "solution": "// Reference the theory above"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What is the lookup time complexity for a string of length L in a Trie containing N strings?",
          "options": [
            {
              "text": "O(log N)",
              "isCode": false
            },
            {
              "text": "O(L)",
              "isCode": false
            },
            {
              "text": "O(N * L)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Trie search times depend only on the length of the target string (L), not the total number of words in the Trie."
        }
      ]
    }
  }
]
};