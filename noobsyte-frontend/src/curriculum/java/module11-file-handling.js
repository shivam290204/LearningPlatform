export default {
  id: 'module11-file-handling',
  title: 'Module 11: File Handling & Java I/O',
  lessons: [
  {
    "id": "java-file-handling",
    "title": "Java File Handling & I/O",
    "slug": "java-file-handling",
    "description": "Master streams, reader/writer abstractions, serialization, and Java NIO path configurations.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "exception-hierarchy",
    "objectives": [
      "Learn Byte Streams vs Character Streams",
      "Implement Object Serialization and Deserialization",
      "Use modern Java NIO Files and Path libraries"
    ],
    "theory": "<h3>Java File Handling & I/O</h3>\n<p>Java supports input and output operations through **Streams**—sequences of data flowing from a source to a destination.</p>\n<h4>1. Byte Streams vs. Character Streams</h4>\n<ul>\n  <li><strong>Byte Streams:</strong> Handle binary data (images, files) byte by byte. Base classes: <code>InputStream</code>, <code>OutputStream</code>.</li>\n  <li><strong>Character Streams:</strong> Handle text data, converting bytes to characters using encoding sets automatically. Base classes: <code>Reader</code>, <code>Writer</code>.</li>\n</ul>\n<h4>2. Object Serialization</h4>\n<p>Serialization is the process of converting an object's state into a byte stream, allowing it to be saved to a file or transmitted over a network. To serialize an object, its class must implement the <code>Serializable</code> marker interface. Variables marked as <code>transient</code> are skipped during serialization.</p>",
    "analogy": "<h3>Real-Life Analogy: The Water Pipeline</h3>\n<p>Byte streams are like a pipe pumping raw water (raw bytes). Character streams are like a water filtration pipe that treats the water (converting bytes to readable characters) as it flows, ensuring it's ready for consumption (reading).</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: What is the transient keyword?</strong><br/>A: It indicates that a field should not be serialized when saving the object to a file.</li>\n</ul>",
    "commonMistakes": "<p><strong>Forgetting to close file streams:</strong> Leaving streams open locks files on the OS level and leaks memory. Always use a <strong>try-with-resources</strong> statement to close streams automatically.</p>",
    "practiceProblems": [
      {
        "title": "Read File Line by Line",
        "problemText": "Write a program to read a text file line by line and print it.",
        "solution": "Use BufferedReader inside a try-with-resources block calling readLine() in a loop."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Which keyword prevents a class variable from being serialized to disk?",
          "options": [
            {
              "text": "volatile",
              "isCode": false
            },
            {
              "text": "transient",
              "isCode": false
            },
            {
              "text": "static",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Variables marked with the transient keyword are skipped during JVM Object Serialization."
        }
      ]
    }
  }
]
};