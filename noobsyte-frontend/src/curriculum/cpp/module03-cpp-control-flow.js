export default {
  id: 'module03-cpp-control-flow',
  title: 'Module 3: C++ Control Flow',
  lessons: [
    {
      id: 'cpp-control-flow',
      title: 'Control Flow & Conditional Loops in C++',
      slug: 'cpp-control-flow',
      description: 'Master loops, switch statements, condition blocks, and logic flow paths.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Implement conditional if-else statements",
        "Code switch statements with break clauses",
        "Write for, while, and do-while loops"
],
      content: `<h3>Control Flow & Conditional Loops in C++</h3>
<p>Control flow structures allow branching and repeating execution paths in compiled C++ code.</p>
<h4>1. Switch Statements</h4>
<p>A <code>switch</code> statement evaluates an integral condition and jumps directly to a matching case block. Each case must terminate with a <code>break</code> statement, or execution will "fall through" into the next case.</p>
<h4>2. Iteration Loops</h4>
<p>C++ supports <code>for</code> loops, <code>while</code> loops, and <code>do-while</code> loops. The <code>do-while</code> loop is unique because it guarantees the loop body will execute at least once before checking the condition.</p>`,
      theory: `<h3>Control Flow & Conditional Loops in C++</h3>
<p>Control flow structures allow branching and repeating execution paths in compiled C++ code.</p>
<h4>1. Switch Statements</h4>
<p>A <code>switch</code> statement evaluates an integral condition and jumps directly to a matching case block. Each case must terminate with a <code>break</code> statement, or execution will "fall through" into the next case.</p>
<h4>2. Iteration Loops</h4>
<p>C++ supports <code>for</code> loops, <code>while</code> loops, and <code>do-while</code> loops. The <code>do-while</code> loop is unique because it guarantees the loop body will execute at least once before checking the condition.</p>`,
      analogy: `<h3>Real-Life Analogy: The Train Track Switcher</h3>
<p>A switch statement is like a train track switcher. The train arrives at a junction and is routed onto a specific branch line based on its destination key. If you forget to place a stop barrier (break), the train will keep rolling down subsequent tracks.</p>`,
      interviewNotes: '<ul><li><strong>Q: What is a common interview question here?</strong><br/>A: Refer to the lesson text and analogies for typical conceptual questions.</li></ul>',
      commonMistakes: '<p>Ensure you review syntax rules and formatting types to avoid common compilation or runtime errors.</p>',
      practiceProblems: [
        {
          title: 'Basic Practice Challenge',
          problemText: 'Write a basic script to demonstrate the main concepts of this lesson.',
          solution: 'Consult the documentation and code examples above to implement your code.'
        }
      ],
      quiz: {
        questions: [
          {
            questionText: 'What is unique about a "do-while" loop compared to a standard "while" loop?',
            options: [
          {
                    "text": "It runs in a separate thread in memory.",
                    "isCode": false
          },
          {
                    "text": "It executes the loop body at least once before evaluating the condition.",
                    "isCode": false
          },
          {
                    "text": "It evaluates the condition at the start of the block.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'A do-while loop evaluates its termination condition at the bottom of the loop body, guaranteeing at least one execution pass.'
          }
        ]
      }
    }
  ]
};
