export default {
  id: 'module13-cpp-stl-containers',
  title: 'Module 13: C++ STL Containers',
  lessons: [
    {
      id: 'cpp-stl-containers',
      title: 'C++ STL Containers (Maps, Sets, Queues)',
      slug: 'cpp-stl-containers',
      description: 'Explore standard templates library maps, sets, queues, and unordered collections.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Use std::map and std::unordered_map",
        "Differentiate between sorted and hashed containers",
        "Implement std::set collections for uniqueness"
],
      content: `<h3>C++ STL Containers (Maps, Sets, Queues)</h3>
<p>The C++ Standard Template Library (STL) provides optimized, generic container classes.</p>
<h4>1. std::map vs std::unordered_map</h4>
<ul>
  <li><code>std::map</code>: Built on Self-Balancing Binary Search Trees (Red-Black Trees). Keys are stored in sorted order. Lookups run in O(log N) time.</li>
  <li><code>std::unordered_map</code>: Built on Hash Tables. Keys are unsorted. Lookups run in O(1) average time.</li>
</ul>
<h4>2. std::set</h4>
<p>Stores unique keys in sorted order, making it efficient for lookup operations and sorting duplicates.</p>`,
      theory: `<h3>C++ STL Containers (Maps, Sets, Queues)</h3>
<p>The C++ Standard Template Library (STL) provides optimized, generic container classes.</p>
<h4>1. std::map vs std::unordered_map</h4>
<ul>
  <li><code>std::map</code>: Built on Self-Balancing Binary Search Trees (Red-Black Trees). Keys are stored in sorted order. Lookups run in O(log N) time.</li>
  <li><code>std::unordered_map</code>: Built on Hash Tables. Keys are unsorted. Lookups run in O(1) average time.</li>
</ul>
<h4>2. std::set</h4>
<p>Stores unique keys in sorted order, making it efficient for lookup operations and sorting duplicates.</p>`,
      analogy: `<h3>Real-Life Analogy: Sorted Filing Cabinet vs Index Pegs</h3>
<p>std::map is like a filing cabinet sorted alphabetically. Finding a file requires searching folders (binary search, O(log N)). std::unordered_map is like key rings hung on numbered hooks. If you know the hook number, you can grab the keys instantly (O(1) lookup).</p>`,
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
            questionText: 'What data structure is std::map built on in most C++ STL implementations?',
            options: [
          {
                    "text": "Hash Table",
                    "isCode": false
          },
          {
                    "text": "Self-Balancing Binary Search Tree (Red-Black Tree)",
                    "isCode": false
          },
          {
                    "text": "Doubly Linked List",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'std::map is implemented using balanced binary search trees, keeping elements sorted and ensuring O(log N) operations.'
          }
        ]
      }
    }
  ]
};
