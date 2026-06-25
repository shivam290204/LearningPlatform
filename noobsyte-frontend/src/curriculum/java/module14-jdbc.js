export default {
  id: 'module14-jdbc',
  title: 'Module 14: Java Database Connectivity (JDBC)',
  lessons: [
  {
    "id": "java-jdbc",
    "title": "Java Database Connectivity (JDBC)",
    "slug": "java-jdbc",
    "description": "Learn SQL database drivers, connection configurations, PreparedStatements, and transaction safety controls.",
    "difficulty": "Advanced",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "concurrency-sync",
    "objectives": [
      "Configure JDBC drivers and connections pools",
      "Execute SQL queries using PreparedStatements to block injections",
      "Manage manual transactions and rollback points"
    ],
    "theory": "<h3>Java Database Connectivity (JDBC)</h3>\n<p>JDBC is an API that allows Java applications to execute SQL statements and interact with relational databases (MySQL, PostgreSQL, Oracle).</p>\n<h4>1. Connection Workflow</h4>\n<p>To connect to a database, you load the appropriate database driver and request a connection from the <code>DriverManager</code> using a JDBC URL:</p>\n<pre><code>Connection conn = DriverManager.getConnection(\"jdbc:mysql://localhost:3306/db\", \"user\", \"pass\");</code></pre>\n<h4>2. Statements vs. PreparedStatements</h4>\n<ul>\n  <li><strong>Statement:</strong> Compiles and executes SQL every time. Susceptible to **SQL Injection** attacks because variables are concatenated directly.</li>\n  <li><strong>PreparedStatement:</strong> Pre-compiles SQL queries on the database server. Safer, faster, and protects against SQL injection using parameter placeholders (<code>?</code>).</li>\n</ul>\n<h4>3. Transaction Management</h4>\n<p>By default, JDBC connections have <code>autoCommit = true</code>, committing every SQL line automatically. For transactions, set <code>conn.setAutoCommit(false)</code>, executing all lines inside a block before calling <code>conn.commit()</code> or <code>conn.rollback()</code> on error.</p>",
    "analogy": "<h3>Real-Life Analogy: The Bank Teller</h3>\n<p>A Statement is like writing your withdrawal request on a napkin; anyone can inject characters and change it. A PreparedStatement is like filling out an official bank form with explicit input boxes. The teller compiles the form, and you can only write inside the pre-determined parameter boxes, preventing fraudulent modifications.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: How does PreparedStatement prevent SQL injection?</strong><br/>A: It compiles the query structure first, treating parameter arguments strictly as values rather than executable code.</li>\n</ul>",
    "commonMistakes": "<p><strong>Using regular Statements for user inputs:</strong> Concatenating string variables directly into SQL queries allows malicious SQL injections.</p>",
    "practiceProblems": [
      {
        "title": "Insert User safely",
        "problemText": "Write a JDBC snippet to insert a new user (name, email) safely using PreparedStatement.",
        "solution": "String sql = \"INSERT INTO users (name, email) VALUES (?, ?)\"; PreparedStatement pstmt = conn.prepareStatement(sql); pstmt.setString(1, name); pstmt.setString(2, email); pstmt.executeUpdate();"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Why is PreparedStatement preferred over Statement in Java JDBC?",
          "options": [
            {
              "text": "It runs queries inside Stack frames",
              "isCode": false
            },
            {
              "text": "It pre-compiles queries and prevents SQL Injection",
              "isCode": false
            },
            {
              "text": "It automatically commits transactions",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "PreparedStatements pre-compile SQL queries, parsing placeholders securely to prevent code injection attacks."
        }
      ]
    }
  }
]
};