export default {
  id: 'module05-python-oop-advanced',
  title: 'Module 5: Python OOP Advanced',
  lessons: [
    {
      id: 'python-oop-advanced',
      title: 'Advanced OOP: Inheritance & Class Methods',
      slug: 'python-oop-advanced',
      description: 'Understand inheritance hierarchies, method overriding, super() bindings, and class/static methods.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Implement single and multiple inheritance",
        "Use super() to call parent classes methods",
        "Differentiate between instance, class, and static methods"
],
      content: `<h3>Advanced OOP: Inheritance & Class Methods</h3>
<p>Python OOP supports advanced relationship modeling like inheritance, method overriding, and specialized method decorators.</p>
<h4>1. Inheritance & super()</h4>
<p>Inheritance is defined by passing the parent class name in parentheses: <code>class Child(Parent):</code>. The <code>super()</code> function calls parent class methods cleanly, resolving Method Resolution Order (MRO).</p>
<h4>2. Class Methods and Static Methods</h4>
<p>Decorated with <code>@classmethod</code> (receives <code>cls</code>) and <code>@staticmethod</code> (receives no implicit instance/class references), these methods serve configurations and helpers.</p>`,
      theory: `<h3>Advanced OOP: Inheritance & Class Methods</h3>
<p>Python OOP supports advanced relationship modeling like inheritance, method overriding, and specialized method decorators.</p>
<h4>1. Inheritance & super()</h4>
<p>Inheritance is defined by passing the parent class name in parentheses: <code>class Child(Parent):</code>. The <code>super()</code> function calls parent class methods cleanly, resolving Method Resolution Order (MRO).</p>
<h4>2. Class Methods and Static Methods</h4>
<p>Decorated with <code>@classmethod</code> (receives <code>cls</code>) and <code>@staticmethod</code> (receives no implicit instance/class references), these methods serve configurations and helpers.</p>`,
      analogy: `<h3>Real-Life Analogy: Family Inheritance</h3>
<p>Inheritance is like inheriting your parents' traits. If your parent has brown eyes, you inherit that trait. However, you can choose to wear blue contact lenses (method overriding). If you still need your parents' original trait, you can reference it via super().</p>`,
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
            questionText: 'What decorator is used to define a method that operates on the class itself rather than instances?',
            options: [
          {
                    "text": "@staticmethod",
                    "isCode": true
          },
          {
                    "text": "@classmethod",
                    "isCode": true
          },
          {
                    "text": "@instancemethod",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: '@classmethod receives the class reference (cls) as its first argument and can modify class-level states.'
          }
        ]
      }
    }
  ]
};
