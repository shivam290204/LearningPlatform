export default {
  id: 'module10-python-dictionaries',
  title: 'Module 10: Python Dictionaries',
  lessons: [
    {
      id: 'python-dictionaries',
      title: 'Dictionaries & Hash Maps in Python',
      slug: 'python-dictionaries',
      description: 'Master hash map dictionaries, key-value lookups, hash collision safety, and dictionary views.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Perform dictionary key-value CRUD operations",
        "Describe Python dict hashing implementations",
        "Use dict methods like get, keys, and items"
],
      content: `<h3>Dictionaries & Hash Maps in Python</h3>
<p>A Python <code>dict</code> is an unordered (ordered by insertion since Python 3.7) collection of key-value pairs built on hash tables.</p>
<h4>1. Key-Value Lookup</h4>
<p>Keys are unique and must be hashable (immutable). Accessing a key that does not exist throws a <code>KeyError</code>. Using <code>dict.get(key, default)</code> prevents this error by returning a fallback value.</p>
<h4>2. Hash Map Mechanics</h4>
<p>Python hashes keys to find storage indices. Lookups, insertions, and deletions run in amortized O(1) time complexity.</p>`,
      theory: `<h3>Dictionaries & Hash Maps in Python</h3>
<p>A Python <code>dict</code> is an unordered (ordered by insertion since Python 3.7) collection of key-value pairs built on hash tables.</p>
<h4>1. Key-Value Lookup</h4>
<p>Keys are unique and must be hashable (immutable). Accessing a key that does not exist throws a <code>KeyError</code>. Using <code>dict.get(key, default)</code> prevents this error by returning a fallback value.</p>
<h4>2. Hash Map Mechanics</h4>
<p>Python hashes keys to find storage indices. Lookups, insertions, and deletions run in amortized O(1) time complexity.</p>`,
      analogy: `<h3>Real-Life Analogy: The Library Rolodex</h3>
<p>A dictionary is like a library card catalog index. Instead of searching every shelf in the library for a book title (O(N) search), you look up the title key in the catalog index (O(1) search) to find its coordinate shelf location instantly.</p>`,
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
            questionText: 'What is returned by "d.get(\'age\', 25)" if the key \'age\' does not exist in dictionary "d"?',
            options: [
          {
                    "text": "None",
                    "isCode": true
          },
          {
                    "text": "25",
                    "isCode": true
          },
          {
                    "text": "KeyError",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: 'The get() method returns the specified default value (25) if the key is not found, preventing a KeyError.'
          }
        ]
      }
    }
  ]
};
