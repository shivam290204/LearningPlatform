export default {
  id: 'module17-greedy',
  title: 'Module 17: Greedy Algorithms',
  lessons: [
  {
    "id": "greedy-randomized-algorithms",
    "title": "Greedy & Randomized Algorithms",
    "slug": "greedy-randomized-algorithms",
    "description": "Understand the concept of Greedy & Randomized Algorithms for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Implement Greedy & Randomized Algorithms structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Greedy & Randomized Algorithms</h3>\n<p>Approaches for optimization problems:</p>\n<ul>\n  <li><strong>Greedy:</strong> Makes the locally optimal choice at each step, hoping to find a global optimum (e.g. Prim's MST, Huffman Coding). Fast but does not guarantee a global optimum for all problems.</li>\n  <li><strong>Randomized:</strong> Uses random numbers to guide choices (e.g. Quick Sort partition pivots). Helps avoid worst-case scenarios.</li>\n</ul>",
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
          "questionText": "Does a Greedy algorithm always find the globally optimal solution?",
          "options": [
            {
              "text": "Yes, it guarantees a global optimum",
              "isCode": false
            },
            {
              "text": "No, it makes local choices that do not guarantee a global optimum for all problems",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Greedy algorithms choose the best immediate option, which can sometimes miss the global optimum."
        }
      ]
    }
  }
]
};