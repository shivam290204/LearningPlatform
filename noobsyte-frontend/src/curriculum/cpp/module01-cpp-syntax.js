export default {
  id: 'module01-cpp-syntax',
  title: 'Module 1: C++ Syntax & Compilation',
  lessons: [
    {
      id: 'cpp-syntax',
      title: 'C++ Language Syntax & Compilation',
      slug: 'cpp-syntax',
      description: 'Learn main function structures, standard console streams, and the compilation pipeline stages.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Explain the compilation and linking process",
        "Write a main function returning integer status",
        "Use std::cout and std::cin for basic I/O"
],
      content: `<h3>C++ Language Syntax & Compilation</h3>
<p>C++ is a strongly typed, compiled language that provides direct control over hardware and system memory.</p>
<h4>1. The Main Function</h4>
<p>Every executable C++ program must define a global <code>main</code> function that returns an integer (0 for success, non-zero for failure): <code>int main() { return 0; }</code>.</p>
<h4>2. The Compilation Pipeline</h4>
<p>Unlike languages that use bytecode interpreters, C++ compiles source files directly into machine code. The pipeline has three main stages: Preprocessing (macro expansions), Compilation (generating assembly code), and Linking (merging object files and libraries into an executable).</p>`,
      theory: `<h3>C++ Language Syntax & Compilation</h3>
<p>C++ is a strongly typed, compiled language that provides direct control over hardware and system memory.</p>
<h4>1. The Main Function</h4>
<p>Every executable C++ program must define a global <code>main</code> function that returns an integer (0 for success, non-zero for failure): <code>int main() { return 0; }</code>.</p>
<h4>2. The Compilation Pipeline</h4>
<p>Unlike languages that use bytecode interpreters, C++ compiles source files directly into machine code. The pipeline has three main stages: Preprocessing (macro expansions), Compilation (generating assembly code), and Linking (merging object files and libraries into an executable).</p>`,
      analogy: `<h3>Real-Life Analogy: Building a House from Blueprints</h3>
<p>The compiler is like an architect checking the blueprints for structural syntax rules. Linking is like the general contractor bringing in materials from third-party suppliers (libraries) to assemble the final physical house (executable).</p>`,
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
            questionText: 'What is the entry point of every C++ executable program?',
            options: [
          {
                    "text": "void start()",
                    "isCode": true
          },
          {
                    "text": "int main()",
                    "isCode": true
          },
          {
                    "text": "class Program {}",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: 'The operating system loads the executable and invokes the global main() function as the entry point.'
          }
        ]
      }
    }
  ]
};
