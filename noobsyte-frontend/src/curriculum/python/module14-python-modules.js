export default {
  id: 'module14-python-modules',
  title: 'Module 14: Python Modules & Packages',
  lessons: [
    {
      id: 'python-modules',
      title: 'Modules, Packages, and Imports in Python',
      slug: 'python-modules',
      description: 'Learn module imports, namespace isolation, package folders, and sys.path resolution rules.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Import modules and packages",
        "Explain __init__.py files role in packages",
        "Understand sys.path module lookup paths"
],
      content: `<h3>Modules, Packages, and Imports in Python</h3>
<p>Python organizes code modularly using Modules (single files) and Packages (directories containing modules).</p>
<h4>1. Modules and Packages</h4>
<p>Any file ending in <code>.js</code> or <code>.py</code> can be imported as a module. A directory is treated as a package if it contains an <code>__init__.py</code> file (optional since Python 3.3 but recommended for namespace setup).</p>
<h4>2. Namespace Isolation</h4>
<p>Using <code>import module_name</code> keeps namespaces isolated, avoiding naming conflicts between files: <code>module_name.function()</code>.</p>`,
      theory: `<h3>Modules, Packages, and Imports in Python</h3>
<p>Python organizes code modularly using Modules (single files) and Packages (directories containing modules).</p>
<h4>1. Modules and Packages</h4>
<p>Any file ending in <code>.js</code> or <code>.py</code> can be imported as a module. A directory is treated as a package if it contains an <code>__init__.py</code> file (optional since Python 3.3 but recommended for namespace setup).</p>
<h4>2. Namespace Isolation</h4>
<p>Using <code>import module_name</code> keeps namespaces isolated, avoiding naming conflicts between files: <code>module_name.function()</code>.</p>`,
      analogy: `<h3>Real-Life Analogy: Library Categorization</h3>
<p>Modules are like individual books on a subject. Packages are like departments in a library (e.g. Science, Fiction). To reference a book, you go to the department first, preventing conflicts between books sharing similar titles.</p>`,
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
            questionText: 'What file historically designates a directory as an importable Python package?',
            options: [
          {
                    "text": "main.py",
                    "isCode": true
          },
          {
                    "text": "__init__.py",
                    "isCode": true
          },
          {
                    "text": "package.json",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: '__init__.py files are used to mark directories on disk as Python package directories, initializing package-level setups.'
          }
        ]
      }
    }
  ]
};
