export default {
  id: 'module18-bit-manipulation',
  title: 'Module 18: Bit Manipulation',
  lessons: [
  {
    "id": "bit-manipulation",
    "title": "Bit Manipulation Techniques",
    "slug": "bit-manipulation",
    "description": "Learn bitwise operations, shifting numbers, setting/clearing bits, and fast bitwise algorithms.",
    "difficulty": "Intermediate",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "wrapper-classes",
    "objectives": [
      "Master bitwise AND, OR, XOR, NOT, and shift operators",
      "Set, clear, toggle, and inspect bits at index i",
      "Solve common bitwise puzzle questions"
    ],
    "theory": "<h3>Bit Manipulation</h3>\n<p>Bit manipulation operates on integer variables at the level of their individual bits (0s and 1s) rather than treating them as decimal numbers.</p>\n<h4>1. Bitwise Operators</h4>\n<ul>\n  <li><code>&</code> (AND): 1 if both bits are 1.</li>\n  <li><code>|</code> (OR): 1 if either bit is 1.</li>\n  <li><code>^</code> (XOR): 1 if bits are different. Useful for toggling.</li>\n  <li><code>~</code> (NOT): Inverts all bits.</li>\n  <li><code>&lt;&lt;</code> (Left Shift): Multiplies number by 2^k.</li>\n  <li><code>&gt;&gt;</code> (Right Shift): Divides number by 2^k.</li>\n</ul>\n<h4>2. Core Bitwise Formulas</h4>\n<ul>\n  <li>Check if number is even: <code>(N & 1) == 0</code></li>\n  <li>Clear the lowest set bit: <code>N & (N - 1)</code></li>\n  <li>Set bit at index i: <code>N | (1 << i)</code></li>\n  <li>Clear bit at index i: <code>N & ~(1 << i)</code></li>\n</ul>",
    "analogy": "<h3>Real-Life Analogy: The Toggle Switches</h3>\n<p>Think of bits as a row of light switches on a dashboard. Decimal addition is like rewriting the total number of glowing lights. Bit manipulation is like walking directly to switch number 3 and toggling it instantly, which is much faster than recalculating everything.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: How do you find the single non-duplicate element in a list where all other elements appear twice?</strong><br/>A: XOR all elements in the list. Duplicate pairs cancel out to 0 (since A ^ A = 0), leaving only the single element.</li>\n</ul>",
    "commonMistakes": "<p><strong>Shifting by negative values:</strong> Shifting a number by a negative index causes unpredictable behavior. Always shift by positive offsets.</p>",
    "practiceProblems": [
      {
        "title": "Count Set Bits",
        "problemText": "Count the number of 1s in the binary representation of an integer.",
        "solution": "Use a loop calling N = N & (N - 1) until N becomes 0, counting the number of operations."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What is the output of the expression N & (N - 1) when N is a power of 2?",
          "options": [
            {
              "text": "0",
              "isCode": false
            },
            {
              "text": "N - 1",
              "isCode": false
            },
            {
              "text": "1",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 0,
          "explanation": "Powers of two contain exactly one set bit. Clearing the lowest set bit using N & (N - 1) results in 0."
        }
      ]
    }
  }
]
};