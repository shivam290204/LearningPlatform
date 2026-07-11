export default {
  id: 'module14-cpp-templates',
  title: 'Module 14: C++ Templates',
  lessons: [
    {
      id: 'cpp-templates',
      title: 'Templates & Generic Programming in C++',
      slug: 'cpp-templates',
      description: 'Master generic functions, generic class declarations, and template parameters.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Create template functions for generic execution",
        "Define template classes for custom containers",
        "Explain compile-time template instantiation"
],
      content: `<h3>Templates & Generic Programming in C++</h3>
<p>Templates allow writing generic code that works with any data type, without duplicating source code.</p>
<h4>1. Template Functions</h4>
<p>A template function parameterizes types using the <code>template&lt;typename T&gt;</code> syntax: <code>template&lt;typename T&gt; T getMax(T a, T b) { return (a &gt; b) ? a : b; }</code>.</p>
<h4>2. Compile-Time Instantiation</h4>
<p>When the compiler encounters a template call like <code>getMax&lt;int&gt;(5, 10)</code>, it dynamically generates a concrete version of the function for that type at compile-time, ensuring type safety with zero runtime overhead.</p>`,
      theory: `<h3>Templates & Generic Programming in C++</h3>
<p>Templates allow writing generic code that works with any data type, without duplicating source code.</p>
<h4>1. Template Functions</h4>
<p>A template function parameterizes types using the <code>template&lt;typename T&gt;</code> syntax: <code>template&lt;typename T&gt; T getMax(T a, T b) { return (a &gt; b) ? a : b; }</code>.</p>
<h4>2. Compile-Time Instantiation</h4>
<p>When the compiler encounters a template call like <code>getMax&lt;int&gt;(5, 10)</code>, it dynamically generates a concrete version of the function for that type at compile-time, ensuring type safety with zero runtime overhead.</p>`,
      analogy: `<h3>Real-Life Analogy: The Stencil Template</h3>
<p>A template is like a plastic drawing stencil of a star. The stencil itself has no color. You can use it to draw a blue star, a red star, or a yellow star. The stencil provides the shape, and you choose the color (data type) when drawing.</p>`,
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
            questionText: 'When are C++ template functions instantiated into concrete code?',
            options: [
          {
                    "text": "At runtime when the function is executed.",
                    "isCode": false
          },
          {
                    "text": "At compile-time when the compiler detects the function call.",
                    "isCode": false
          },
          {
                    "text": "During linking phase execution.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'C++ templates are resolved at compile-time; the compiler parses the call and generates type-specific implementations.'
          }
        ]
      }
    }
  ]
};
