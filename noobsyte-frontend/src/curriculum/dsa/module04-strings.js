export default {
  id: 'module04-strings',
  title: 'Module 4: Strings in DSA',
  lessons: [
  {
    "id": "dsa-strings",
    "title": "Strings in DSA",
    "slug": "dsa-strings",
    "description": "Learn string representation, reverse logic, palindrome checking, and pattern matching algorithms.",
    "difficulty": "Intermediate",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "string-pool",
    "objectives": [
      "Implement string traversals and pointer operations",
      "Solve palindrome and anagram checks in optimal complexity",
      "Understand pattern matching algorithms (KMP, Rabin-Karp)"
    ],
    "theory": "<h3>Strings in Data Structures</h3>\n<p>Strings are array sequences of characters. Many interview problems involve manipulating strings using indexing algorithms.</p>\n<h4>1. Anagram and Palindrome Checks</h4>\n<ul>\n  <li><strong>Palindrome:</strong> String reads the same backward as forward. Solve in O(N) using two pointers moving inward.</li>\n  <li><strong>Anagram:</strong> Two strings contain identical characters in different orders. Check in O(N) using a character frequency hash table or sorting in O(N log N).</li>\n</ul>\n<h4>2. Pattern Matching Algorithms</h4>\n<p>Given a text T of size N and pattern P of size M:</p>\n<ul>\n  <li><strong>Naive Search:</strong> Slides and matches characters. Time complexity: O(N * M).</li>\n  <li><strong>Rabin-Karp:</strong> Uses rolling hashes to filter potential matches in O(N + M) average time.</li>\n  <li><strong>KMP (Knuth-Morris-Pratt):</strong> Uses a precompiled prefix table (LPS) to avoid backtracking, running in O(N + M).</li>\n</ul>",
    "analogy": "<h3>Real-Life Analogy: The Book Index</h3>\n<p>Searching for words inside a library manual without KMP is like reading every word from the beginning whenever you fail to match. KMP is like writing down intermediate matched prefixes on a notepad, allowing you to skip backward index checks directly to the next probable starting character.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: What is the advantage of Rabin-Karp?</strong><br/>A: It uses rolling hashes, making it highly efficient for multiple pattern matching problems.</li>\n</ul>",
    "commonMistakes": "<p><strong>Creating extra copies:</strong> Repeatedly using substrings inside loops creates temporary string copies, leading to O(N^2) memory costs. Always use index boundaries instead.</p>",
    "practiceProblems": [
      {
        "title": "Check Palindrome",
        "problemText": "Check if a string is a palindrome after removing non-alphanumeric characters.",
        "solution": "Use two pointers from left and right, skipping non-alphanumeric characters, and comparing elements."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What is the time complexity of Knuth-Morris-Pratt (KMP) pattern matching algorithm in the worst case?",
          "options": [
            {
              "text": "O(N * M)",
              "isCode": false
            },
            {
              "text": "O(N + M)",
              "isCode": false
            },
            {
              "text": "O(N log M)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "KMP builds a Longest Prefix Suffix (LPS) table, achieving a linear worst-case time complexity of O(N + M)."
        }
      ]
    }
  },
  {
    "id": "suffix-trees-arrays",
    "title": "Suffix Trees & Suffix Arrays",
    "slug": "suffix-trees-arrays",
    "description": "Understand the concept of Suffix Trees & Suffix Arrays for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Implement Suffix Trees & Suffix Arrays structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Suffix Trees & Suffix Arrays</h3>\n<p>These structures analyze substring properties in text:</p>\n<ul>\n  <li><strong>Suffix Tree:</strong> A compressed trie containing all suffixes of a string. Allows substring searches and pattern matching in <code>O(M)</code> time, where M is the pattern length.</li>\n  <li><strong>Suffix Array:</strong> A sorted array of all suffixes of a string. More space-efficient than suffix trees, supporting queries in <code>O(M log N)</code> time.</li>\n</ul>",
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
          "questionText": "How does a Suffix Array compare to a Suffix Tree?",
          "options": [
            {
              "text": "Suffix arrays are faster but use more memory",
              "isCode": false
            },
            {
              "text": "Suffix arrays are more space-efficient but require slightly longer search runtimes",
              "isCode": false
            },
            {
              "text": "Suffix arrays cannot search for substrings",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Suffix Arrays use a sorted array layout that saves significant memory over suffix trees, but lookups take O(M log N) instead of O(M) time."
        }
      ]
    }
  }
]
};