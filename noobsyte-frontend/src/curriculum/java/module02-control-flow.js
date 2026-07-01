export default {
  id: 'module02-control-flow',
  title: 'Module 2: Control Flow & Conditionals',
  lessons: [
    {
      id: "control-structures",
      title: "Control Structures & Conditionals",
      slug: "control-structures",
      description: "Deep dive into Control Structures & Conditionals conceptual implementation structures.",
      difficulty: "Beginner",
      estTime: "15 min",
      quizAvailable: true,
      xpReward: 50,
      visualizer: null,
      visualizations: [],
      objectives: [
        "Master the core rules of Control Structures & Conditionals",
        "Explain structural mechanisms under the hood"
      ],
      content: `<article class="lesson-content">
  <!-- SECTION 1: HOOK / WHY THIS MATTERS -->
  <div class="theory-hook">
    <div class="hook-badge">⚡ WHY THIS MATTERS</div>
    <h2 class="hook-title">The Airline Loop Failure: How Control Flow Directs Digital Engines</h2>
    <p class="hook-body">
      In 2018, a major airline booking system in India suffered a server freeze that stranded thousands of passengers at airport counters across major cities. The culprit? An infinite <code>while</code> loop triggered by a null network response that continuously checked a queue pointer without updating the loop control variable. Control flow statements are the navigation systems of your software. Whether it is routing a UPI payment using <code>if-else</code> conditions, mapping Zomato order statuses via a <code>switch</code> expression, or processing massive arrays with a <code>for</code> loop, you are directing the execution flow of code. Today, you will master the mechanics of conditionals, loops, and modern switch expressions to write fast, non-blocking code.
    </p>
    <div class="hook-placement-note">
      <span class="placement-icon">🎯</span>
      <span>Asked in coding interviews and debugger rounds at <strong>Microsoft</strong>, <strong>Amazon</strong>, <strong>Infosys</strong>, and <strong>TCS Digital</strong>.</span>
    </div>
  </div>

  <!-- SECTION 2: CORE CONCEPTS (THEORY DEEP DIVE) -->
  <div class="theory-section">
    <div class="section-badge">📚 CORE THEORY</div>
    <h3 class="section-title">Conditionals, Loops &amp; Branching Mechanics</h3>
    
    <h4 class="concept-heading">1. Selection Statements: if-else &amp; Short-Circuit Logic</h4>
    <p>
      At the CPU level, execution branches via conditional jumps. In Java, selection is managed using <code>if</code>, <code>else if</code>, and <code>else</code> blocks. These statements evaluate expressions that must return a strict <code>boolean</code> value (Java does not allow integers as booleans, unlike C/C++). 
    </p>
    <p>
      An important optimization is <strong>short-circuit evaluation</strong>:
      - For the logical AND operator (<code>&amp;&amp;</code>), if the first operand is <code>false</code>, the JVM skips evaluating the second operand since the entire expression is guaranteed to be false.
      - For the logical OR operator (<code>||</code>), if the first operand is <code>true</code>, the JVM skips the second evaluation.
      This behavior is useful for preventing null pointer errors during checks, such as: <code>if (user != null &amp;&amp; user.isActive())</code>.
    </p>

    <h4 class="concept-heading">2. Multi-Way Branching: Traditional Switch vs. Java Switch Expressions</h4>
    <p>
      Traditional <code>switch</code> statements compare a single variable against discrete constant values. Historically, you had to add a <code>break</code> statement to the end of each case block to prevent code execution from falling through to the next case.
    </p>
    <p>
      Java 14 introduced **Switch Expressions**, which modernize multi-way branching:
      - They can return values directly, allowing assignment (e.g. <code>int rating = switch(status) { ... }</code>).
      - They use the arrow operator (<code>-&gt;</code>) instead of colons, which eliminates fall-through behavior and removes the need for <code>break</code> statements.
      - They require exhaustive branch handling: you must specify all cases or include a <code>default</code> branch.
      - For multi-line code blocks, they use the <code>yield</code> keyword to return a value.
    </p>
    
    <table class="complexity-table" style="margin: 1.5rem 0; width: 100%;">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Traditional Switch Statement</th>
          <th>Modern Switch Expression (Java 14+)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Syntax Structure</strong></td>
          <td>Case labels with colons (<code>case X:</code>)</td>
          <td>Arrow case labels (<code>case X -&gt;</code>)</td>
        </tr>
        <tr>
          <td><strong>Fall-through Rule</strong></td>
          <td>Default behavior (requires <code>break</code>)</td>
          <td>Eliminated (no fall-through)</td>
        </tr>
        <tr>
          <td><strong>Value Return</strong></td>
          <td>No (executes statement blocks only)</td>
          <td>Yes (returns value to assignments)</td>
        </tr>
        <tr>
          <td><strong>Exhaustiveness</strong></td>
          <td>Not enforced by compiler</td>
          <td>Strictly enforced (must cover all values)</td>
        </tr>
      </tbody>
    </table>

    <h4 class="concept-heading">3. Iteration Structures: for, while, and do-while</h4>
    <p>
      Iteration allows code to repeat until a guard condition changes. Java provides three iteration loops:
      - <strong>for:</strong> Optimal when the number of iterations is known before entry. It groups initialization, guard condition, and update statement on one line.
      - <strong>while:</strong> Used when looping depends on a dynamic condition (e.g., reading lines of a file). It checks the guard condition before executing the loop body.
      - <strong>do-while:</strong> Guarantees that the loop body executes <strong>at least once</strong> because the guard condition is evaluated at the end of the loop block.
    </p>

    <h4 class="concept-heading">4. Transfer Control: Break, Labeled Break, and Continue</h4>
    <p>
      Transfer keywords alter standard loop iteration behaviors:
      - <code>break</code> immediately terminates the loop body and resumes execution at the next statement.
      - <code>continue</code> skips the remaining code in the current iteration and jumps to the next condition evaluation.
      - <strong>Labeled Loops:</strong> In nested loops, <code>break</code> or <code>continue</code> only affect the innermost loop block. Java supports labeling loops (e.g. <code>outer: for(...)</code>), allowing a nested statement to break or continue an outer loop directly.
    </p>
  </div>

  <!-- SECTION 3: COLORED SYNTAX CODE BLOCKS -->
  <div class="theory-section">
    <div class="section-badge">💻 CODE LAB</div>
    <h3 class="section-title">Control Flow Implementations</h3>

    <h4 class="concept-heading">Example 1: Labeled Loops in Matrix Search</h4>
    <p>This code search demonstrates how to break out of nested loops using a labeled break statement.</p>
    <div class="code-block-wrapper">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">MatrixSearch.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">MatrixSearch</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">String</span><span style="color:#E6EDF3">[] args) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#79C0FF">int</span><span style="color:#E6EDF3">[][] matrix = {</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">      <span style="color:#E6EDF3">{</span><span style="color:#79C0FF">3</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">5</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">9</span><span style="color:#E6EDF3">},</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">      <span style="color:#E6EDF3">{</span><span style="color:#79C0FF">12</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">15</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">18</span><span style="color:#E6EDF3">},</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">      <span style="color:#E6EDF3">{</span><span style="color:#79C0FF">21</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">24</span><span style="color:#E6EDF3">, </span><span style="color:#79C0FF">27</span><span style="color:#E6EDF3}</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    <span style="color:#E6EDF3">};</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">target = </span><span style="color:#79C0FF">15</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">    <span style="color:#79C0FF">boolean</span> <span style="color:#E6EDF3">found = </span><span style="color:#FF7B72">false</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">    </span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">    <span style="color:#484F58; font-style:italic">    // outer label marks the target loop level</span></span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content">    <span style="color:#E6EDF3">searchLoop:</span></span></div>
        <div class="code-line"><span class="ln">13</span><span class="code-content">    <span style="color:#FF7B72">for</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">row = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; row &lt; matrix.length; row++) {</span></span></div>
        <div class="code-line"><span class="ln">14</span><span class="code-content">      <span style="color:#FF7B72">for</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">col = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; col &lt; matrix[row].length; col++) {</span></span></div>
        <div class="code-line"><span class="ln">15</span><span class="code-content">        <span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(matrix[row][col] == target) {</span></span></div>
        <div class="code-line"><span class="ln">16</span><span class="code-content">          found = <span style="color:#FF7B72">true</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">17</span><span class="code-content">          <span style="color:#484F58; font-style:italic">          // Terminate the outer loop directly</span></span></div>
        <div class="code-line"><span class="ln">18</span><span class="code-content">          <span style="color:#FF7B72">break</span> <span style="color:#E6EDF3">searchLoop;</span></span></div>
        <div class="code-line"><span class="ln">19</span><span class="code-content">        <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">20</span><span class="code-content">      <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">21</span><span class="code-content">    <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">22</span><span class="code-content">    <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Found target: "</span> <span style="color:#E6EDF3">+ found);</span> <span style="color:#484F58; font-style:italic">// Time: O(Row * Col) | Space: O(1)</span></span></div>
        <div class="code-line"><span class="ln">23</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">24</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">Found target: true</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>

    <h4 class="concept-heading">Example 2: Traditional Switch vs. Modern Switch Expression</h4>
    <p>This comparison demonstrates how modern switch expressions prevent fall-through errors.</p>
    
    <div class="wrong-label">❌ WRONG — Traditional Switch Missing Breaks (Fall-through Bug):</div>
    <div class="code-block-wrapper wrong-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">SwitchBug.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">code = </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">String</span> <span style="color:#E6EDF3">discount = </span><span style="color:#A5D6FF">""</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#FF7B72">switch</span><span style="color:#E6EDF3">(code) {</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">case</span> <span style="color:#79C0FF">1</span><span style="color:#E6EDF3">:</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">    discount = </span><span style="color:#A5D6FF">"10%"</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic"> // ❌ Fall-through: Executing continues down because break is missing</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">  <span style="color:#FF7B72">case</span> <span style="color:#79C0FF">2</span><span style="color:#E6EDF3">:</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    discount = </span><span style="color:#A5D6FF">"20%"</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content"><span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(discount);</span> <span style="color:#484F58; font-style:italic"> // Output is "20%", overriding "10%"!</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">20%</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>

    <div class="right-label">✅ CORRECT — Modern Switch Expression returning value:</div>
    <div class="code-block-wrapper correct-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">SwitchExpression.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">code = </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#484F58; font-style:italic">// Arrow syntax yields value cleanly. Time: O(1) | Space: O(1)</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#79C0FF">String</span> <span style="color:#E6EDF3">discount = </span><span style="color:#FF7B72">switch</span><span style="color:#E6EDF3">(code) {</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">case</span> <span style="color:#79C0FF">1</span> <span style="color:#E6EDF3">-&gt;</span> <span style="color:#A5D6FF">"10%"</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#FF7B72">case</span> <span style="color:#79C0FF">2</span> <span style="color:#E6EDF3">-&gt;</span> <span style="color:#A5D6FF">"20%"</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">  <span style="color:#FF7B72">default</span> <span style="color:#E6EDF3">-&gt;</span> <span style="color:#A5D6FF">"0%"</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content"><span style="color:#E6EDF3">};</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content"><span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(discount);</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">10%</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>

    <h4 class="concept-heading">Example 3: While vs. Do-While (Conditional Check Order)</h4>
    <p>This code shows how do-while executes its body before verifying constraints, compared to while.</p>
    <div class="code-block-wrapper">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">LoopCompare.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">LoopCompare</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">String</span><span style="color:#E6EDF3">[] args) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">val = </span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">    </span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">    <span style="color:#484F58; font-style:italic">    // while check prevents entry directly</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">    <span style="color:#FF7B72">while</span><span style="color:#E6EDF3">(val &lt; </span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">) {</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">      <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Inside while"</span><span style="color:#E6EDF3">);</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">    <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">    </span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">    <span style="color:#484F58; font-style:italic">    // do-while executes once, then checks</span></span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">    <span style="color:#FF7B72">do</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content">      <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Inside do-while"</span><span style="color:#E6EDF3">);</span></span></div>
        <div class="code-line"><span class="ln">13</span><span class="code-content">    <span style="color:#E6EDF3">} </span><span style="color:#FF7B72">while</span><span style="color:#E6EDF3">(val &lt; </span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">);</span> <span style="color:#484F58; font-style:italic"> // Time: O(1) | Space: O(1)</span></span></div>
        <div class="code-line"><span class="ln">14</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">15</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">Inside do-while</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 4: STEP-BY-STEP DRY RUN -->
  <div class="dryrun-section">
    <div class="section-badge">🔍 STEP-BY-STEP TRACE</div>
    <h3 class="section-title">Tracing Labeled Break in 2D Search</h3>
    <p class="dryrun-intro">
      Let's trace how the JVM executes a matrix search using a labeled break when searching for <code>15</code> in a 2x3 matrix:
    </p>

    <div class="dryrun-container">
      <div class="dryrun-step">
        <div class="step-circle">1</div>
        <div class="step-body">
          <div class="step-code">row = 0, col = 0 -> arr[0][0] = 3</div>
          <p class="step-explain">
            The outer loop starts. The inner loop evaluates <code>col = 0</code>. Since <code>3 != 15</code>, execution continues to the next column.
          </p>
          <div class="step-state">
            <span class="state-var">row = 0, col = 0</span>
            <span class="state-var">val = 3</span>
            <span class="state-result">3 != 15 → Continue</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step">
        <div class="step-circle">2</div>
        <div class="step-body">
          <div class="step-code">row = 0, col = 1 -> arr[0][1] = 5</div>
          <p class="step-explain">
            The inner loop advances to <code>col = 1</code>. Since <code>5 != 15</code>, execution continues.
          </p>
          <div class="step-state">
            <span class="state-var">row = 0, col = 1</span>
            <span class="state-var">val = 5</span>
            <span class="state-result">5 != 15 → Continue</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step">
        <div class="step-circle">3</div>
        <div class="step-body">
          <div class="step-code">row = 1, col = 0 -> arr[1][0] = 12</div>
          <p class="step-explain">
            The outer loop advances to <code>row = 1</code>. The inner loop resets to <code>col = 0</code>. Since <code>12 != 15</code>, execution continues.
          </p>
          <div class="step-state">
            <span class="state-var">row = 1, col = 0</span>
            <span class="state-var">val = 12</span>
            <span class="state-result">12 != 15 → Continue</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step">
        <div class="step-circle">4</div>
        <div class="step-body">
          <div class="step-code">row = 1, col = 1 -> arr[1][1] = 15</div>
          <p class="step-explain">
            The inner loop advances to <code>col = 1</code>. Since <code>15 == 15</code>, we update <code>found = true</code> and execute <code>break searchLoop</code>.
          </p>
          <div class="step-state">
            <span class="state-var">row = 1, col = 1</span>
            <span class="state-var">val = 15</span>
            <span class="state-result">15 == 15 → Break outer outer loop!</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step" style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px; margin-top: 15px;">
        <h5 style="margin: 0 0 8px 0; color: #FFA657;">ASCII Flow Control Chart</h5>
        <span style="font-family: monospace; display: block; white-space: pre; color: #E6EDF3; line-height: 1.4;">
[Start Loop] -&gt; row=0 -&gt; col=0 (3)  -&gt; col=1 (5) -&gt; col=2 (9)
                   |
                row=1 -&gt; col=0 (12) -&gt; col=1 (15) [Match]
                                        |
                                [break searchLoop]
                                        |
                                        ▼
                                 [Exit Matrix]
        </span>
      </div>

      <div class="dryrun-result">
        <span class="result-icon">✅</span>
        <span>Labled break completely bypassed row=2 checks and remaining column iterations, executing in 4 steps instead of checking all 9 elements.</span>
      </div>
    </div>
  </div>

  <!-- SECTION 5: COMPLEXITY ANALYSIS TABLE -->
  <div class="complexity-section">
    <div class="section-badge">⚡ COMPLEXITY ANALYSIS</div>
    <h3 class="section-title">Time &amp; Space Complexity of Iteration Loops</h3>
    <p class="complexity-intro">
      Loop complexities are determined by the count of elements traversed. Condition checks evaluate in <code>O(1)</code> time, while nested structures multiply complexities.
    </p>

    <table class="complexity-table">
      <thead>
        <tr>
          <th>Loop Structure</th>
          <th>Best Case Time</th>
          <th>Worst Case Time</th>
          <th>Auxiliary Space</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Single Loop (0 to N)</td>
          <td><span class="complexity-good">O(1)</span> (via break)</td>
          <td><span class="complexity-ok">O(N)</span></td>
          <td><span class="complexity-good">O(1)</span></td>
        </tr>
        <tr>
          <td>Nested Loops (N x M)</td>
          <td><span class="complexity-good">O(1)</span> (via break)</td>
          <td><span class="complexity-bad">O(N * M)</span></td>
          <td><span class="complexity-good">O(1)</span></td>
        </tr>
        <tr>
          <td>Branching Conditions</td>
          <td><span class="complexity-good">O(1)</span></td>
          <td><span class="complexity-good">O(1)</span></td>
          <td><span class="complexity-good">O(1)</span></td>
        </tr>
      </tbody>
    </table>

    <div class="complexity-intuition">
      <h4>Linear vs. Quadratic Iteration Scales</h4>
      <p>
        A single loop scales linearly. If you double the inputs, execution time doubles. Nested loops scale quadratically (<code>O(N^2)</code> when N = M). Processing 1 million items in nested loops requires 1 trillion checks, which can cause timeout failures.
      </p>

      <div class="complexity-comparison">
        <div class="comp-row">
          <span class="comp-n">N = 100</span>
          <span class="comp-linear good-complexity">Linear: 100 iterations</span>
          <span class="comp-log bad-complexity">Quadratic: 10,000 iterations</span>
        </div>
        <div class="comp-row">
          <span class="comp-n">N = 10,000</span>
          <span class="comp-linear good-complexity">Linear: 10,000 iterations</span>
          <span class="comp-log bad-complexity">Quadratic: 100,000,000 iterations</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 6: COMMON MISTAKES -->
  <div class="mistakes-section">
    <div class="section-badge">🚫 COMMON MISTAKES</div>
    <h3 class="section-title">Logical Traps in Control Flow</h3>

    <!-- Mistake 1 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #1: Semicolon after loop header declaration</h4>
      </div>
      <p class="mistake-scenario">
        Adding a semicolon at the end of a <code>for</code> or <code>while</code> header terminates the statement immediately. The block below is then treated as a separate, non-loop block.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i=</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i&lt;</span><span style="color:#79C0FF">3</span><span style="color:#E6EDF3">; i++);</span> <span style="color:#484F58; font-style:italic"> // ❌ Semicolon creates an empty loop body. Loop runs 3 times doing nothing.</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#E6EDF3">{</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(i);</span> <span style="color:#484F58; font-style:italic"> // ❌ Error: cannot find symbol 'i' (scope is closed!)</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i=</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i&lt;</span><span style="color:#79C0FF">3</span><span style="color:#E6EDF3">; i++) {</span> <span style="color:#484F58; font-style:italic"> // ✅ No semicolon</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(i);</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Semicolons change loop structures, which can cause compiler errors or infinite loops.
      </div>
    </div>

    <!-- Mistake 2 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #2: Infinite Loop due to incorrect index increment direction</h4>
      </div>
      <p class="mistake-scenario">
        Incrementing the loop index in the wrong direction prevents the guard condition from evaluating to false, resulting in an infinite loop.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i=</span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">; i&gt;</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i++) {</span> <span style="color:#484F58; font-style:italic"> // ❌ Incrementing 'i' instead of decrementing. 'i' is always &gt; 0.</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// Loop body runs forever, eventually triggering integer overflow!</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i=</span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">; i&gt;</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i--) {</span> <span style="color:#484F58; font-style:italic"> // ✅ Decrements 'i' towards the exit threshold</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// Safely terminates</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Infinite loops consume CPU resources, causing application hangs.
      </div>
    </div>

    <!-- Mistake 3 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #3: Object reference comparisons using == instead of .equals()</h4>
      </div>
      <p class="mistake-scenario">
        The <code>==</code> operator compares reference addresses on the Stack, not the actual values on the Heap. Comparing Strings using <code>==</code> can fail.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">String</span> <span style="color:#E6EDF3">s1 = </span><span style="color:#FF7B72">new</span> <span style="color:#79C0FF">String</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Delhi"</span><span style="color:#E6EDF3">);</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(s1 == </span><span style="color:#A5D6FF">"Delhi"</span><span style="color:#E6EDF3">) {</span> <span style="color:#484F58; font-style:italic"> // ❌ Compares pointer address (stack address != constant pool address)</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// Code block does not execute</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">String</span> <span style="color:#E6EDF3">s1 = </span><span style="color:#FF7B72">new</span> <span style="color:#79C0FF">String</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Delhi"</span><span style="color:#E6EDF3">);</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(s1.</span><span style="color:#D2A8FF">equals</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Delhi"</span><span style="color:#E6EDF3">)) {</span> <span style="color:#484F58; font-style:italic"> // ✅ Correct value comparison</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// Safely executes</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Causes logical bypass errors in conditional checks.
      </div>
    </div>

    <!-- Mistake 4 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #4: Unreachable Code after break statements</h4>
      </div>
      <p class="mistake-scenario">
        Placing code statements inside loop bodies directly after an unconditional <code>break</code> statement causes compilation failures.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">while</span><span style="color:#E6EDF3">(</span><span style="color:#FF7B72">true</span><span style="color:#E6EDF3">) {</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">break</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Running"</span><span style="color:#E6EDF3">);</span> <span style="color:#484F58; font-style:italic"> // ❌ Compilation Error: unreachable statement</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">boolean</span> <span style="color:#E6EDF3">keepRunning = </span><span style="color:#FF7B72">true</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">while</span><span style="color:#E6EDF3">(keepRunning) {</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#E6EDF3">keepRunning = </span><span style="color:#FF7B72">false</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Running"</span><span style="color:#E6EDF3">);</span> <span style="color:#484F58; font-style:italic"> // ✅ Code statement executes before loop exit</span></span></div>
          <div class="code-line"><span class="ln">5</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Java enforces strict reachable checks to ensure all lines of code are executable.
      </div>
    </div>

    <!-- Mistake 5 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #5: Variable scope leaks in loops</h4>
      </div>
      <p class="mistake-scenario">
        Declaring a loop index variable outside the loop header keeps it in scope after the loop finishes. This can lead to variable shadowing and memory leaks.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(i=</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i&lt;</span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">; i++) {</span> <span style="color:#484F58; font-style:italic"> // ... loop body </span> <span style="color:#E6EDF3">}</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#484F58; font-style:italic">// Variable i remains in scope here, consuming stack space and shadowing variables.</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i=</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i&lt;</span><span style="color:#79C0FF">10</span><span style="color:#E6EDF3">; i++) {</span> <span style="color:#484F58; font-style:italic"> // ... loop body </span> <span style="color:#E6EDF3">}</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#484F58; font-style:italic">// Variable i leaves the scope and its memory is reclaimed.</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Declaring variables with the smallest possible scope makes code cleaner and prevents bugs.
      </div>
    </div>
  </div>

  <!-- SECTION 7: INTERVIEW PREPARATION -->
  <div class="interview-section">
    <div class="section-badge">🎯 INTERVIEW PREP</div>
    <h3 class="section-title">Control Flow Placement Q&amp;A</h3>

    <div class="interview-companies">
      <span class="company-tag amazon">Amazon</span>
      <span class="company-tag google">Google</span>
      <span class="company-tag tcs">TCS</span>
      <span class="company-tag infosys">Infosys</span>
      <span class="company-tag flipkart">Flipkart</span>
    </div>

    <!-- Q1 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q1</span>
        <span class="qa-text">What is the difference between a break statement and a continue statement inside a loop?</span>
        <div class="qa-companies">
          <span class="mini-tag">TCS</span>
          <span class="mini-tag">Infosys</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          The <code>break</code> statement immediately terminates the loop body and resumes execution at the next statement outside the loop. The <code>continue</code> statement skips the remaining statements in the current iteration and jumps to the next loop update and condition evaluation.
        </p>
        <div class="answer-key-point">
          💡 Key point: Break terminates the loop; continue skips to the next iteration.
        </div>
      </div>
    </div>

    <!-- Q2 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q2</span>
        <span class="qa-text">How does a do-while loop differ from a while loop?</span>
        <div class="qa-companies">
          <span class="mini-tag">Infosys</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          A <code>while</code> loop is an entry-controlled loop that evaluates its guard condition before executing the loop body. If the condition is false initially, the loop does not run. A <code>do-while</code> loop is an exit-controlled loop that evaluates its condition after executing the loop body, guaranteeing that the loop body runs at least once.
        </p>
        <div class="answer-key-point">
          💡 Key point: while checks conditions first; do-while executes the loop body once before checking.
        </div>
      </div>
    </div>

    <!-- Q3 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q3</span>
        <span class="qa-text">What are labeled loops in Java, and what problem do they solve?</span>
        <div class="qa-companies">
          <span class="mini-tag">Amazon</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          In nested loops, standard <code>break</code> or <code>continue</code> statements only affect the innermost loop. Labeled loops allow you to associate a label with an outer loop, enabling a nested statement to break or continue the outer loop directly. This makes it easier to exit nested loops without using extra flag variables.
        </p>
        <div class="answer-key-point">
          💡 Key point: Labeled loops let you break or continue outer loops from nested statements.
        </div>
      </div>
    </div>

    <!-- Q4 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q4</span>
        <span class="qa-text">Explain the benefits of modern Switch Expressions (Java 14+) over traditional switch statements.</span>
        <div class="qa-companies">
          <span class="mini-tag">Google</span>
          <span class="mini-tag">Amazon</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Modern switch expressions use case arrow syntax (<code>-&gt;</code>) instead of colons, which eliminates fall-through behavior and the need for <code>break</code> statements. They can also return values directly, allowing assignment to variables. The compiler enforces exhaustiveness for switch expressions, requiring you to cover all values or include a <code>default</code> case.
        </p>
        <div class="answer-key-point">
          💡 Key point: Switch expressions prevent fall-through errors, return values, and require exhaustive case coverage.
        </div>
      </div>
    </div>

    <!-- Q5 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q5</span>
        <span class="qa-text">Why is it dangerous to use floating-point variables as loop index counters?</span>
        <div class="qa-companies">
          <span class="mini-tag">Google</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Floating-point types cannot represent all decimal values precisely. Adding fractions (e.g. <code>i += 0.1f</code>) inside a loop can accumulate rounding errors, causing loop guard conditions to evaluate incorrectly and leading to infinite loops or off-by-one errors.
        </p>
        <div class="answer-key-point">
          💡 Key point: Decimal math rounding errors can cause loop guard conditions to fail, leading to infinite loops.
        </div>
      </div>
    </div>

    <!-- Q6 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q6</span>
        <span class="qa-text">What is short-circuit evaluation in Java logical operators?</span>
        <div class="qa-companies">
          <span class="mini-tag">TCS</span>
          <span class="mini-tag">Infosys</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Short-circuit evaluation optimizes logical operations by skipping unnecessary evaluations. For logical AND (<code>&amp;&amp;</code>), if the first expression is false, the second is skipped. For logical OR (<code>||</code>), if the first expression is true, the second is skipped. This is useful for preventing null pointer exceptions during checks.
        </p>
        <div class="answer-key-point">
          💡 Key point: Logical operators skip evaluating the second expression when the outcome is guaranteed by the first.
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 8: PRACTICE PROBLEMS -->
  <div class="practice-section">
    <div class="section-badge">💪 PRACTICE PROBLEMS</div>
    <h3 class="section-title">Control Flow Challenges</h3>

    <!-- Problem 1 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">01</span>
        <span class="difficulty-easy">Easy</span>
        <span class="platform-tag">Placement Lab #1</span>
      </div>
      <h4 class="problem-title">Prime Checker Loop</h4>
      <p class="problem-desc">
        Write a program that takes an integer N and determines if it is prime. Optimize the loop condition to run in O(sqrt(N)) time.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Shows how to optimize loop limits to improve runtime performance.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Instead of checking up to N-1, iterate while <code>i * i &lt;= N</code>. If no factors are found by that point, the number is prime.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(sqrt(N)) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 2 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">02</span>
        <span class="difficulty-easy">Easy</span>
        <span class="platform-tag">Placement Lab #2</span>
      </div>
      <h4 class="problem-title">ATM PIN Validator</h4>
      <p class="problem-desc">
        Implement an ATM PIN validation loop using a do-while structure. Allow the user a maximum of 3 attempts, locking the account if they fail.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Uses a do-while loop to prompt the user for input at least once.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Keep a counter variable. Prompt the user inside the <code>do</code> block, increment the counter on failure, and loop while <code>pin != correctPIN &amp;&amp; attempts &lt; 3</code>.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(1) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 3 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">03</span>
        <span class="difficulty-medium">Medium</span>
        <span class="platform-tag">LeetCode #54</span>
      </div>
      <h4 class="problem-title">Spiral Matrix Traversal</h4>
      <p class="problem-desc">
        Given an M x N matrix, return all elements of the matrix in spiral order.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Uses nested loop control variables to traverse nested arrays.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Track 4 boundaries: top, bottom, left, and right. Loop and shift boundaries inwards after each row or column traversal.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-ok">O(M * N) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 4 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">04</span>
        <span class="difficulty-medium">Medium</span>
        <span class="platform-tag">Placement Lab #3</span>
      </div>
      <h4 class="problem-title">Tax Slab switch Evaluator</h4>
      <p class="problem-desc">
        Create a program that calculates income tax using Java Switch Expressions based on tax slabs.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Demonstrates using Switch expressions to return calculated values.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Divide income by 100,000 to get a slab category integer, then use a switch expression to calculate the tax rate.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(1) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 5 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">05</span>
        <span class="difficulty-hard">Hard</span>
        <span class="platform-tag">LeetCode #3</span>
      </div>
      <h4 class="problem-title">Longest Substring Without Repeating Characters</h4>
      <p class="problem-desc">
        Given a string s, find the length of the longest substring without repeating characters.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Uses a sliding window loop with conditional checks.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Use a <code>for</code> loop with a fast pointer, a <code>while</code> loop with a slow pointer, and a set to track duplicates.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(N) time</span> | <span class="complexity-good">O(K) space</span>
      </div>
    </div>

    <!-- Problem 6 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">06</span>
        <span class="difficulty-hard">Hard</span>
        <span class="platform-tag">Placement Lab #4</span>
      </div>
      <h4 class="problem-title">Nested Loop Optimizer</h4>
      <p class="problem-desc">
        Rewrite a nested loop algorithm that has O(N^2) complexity to run in O(N) time using a map.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Shows how to optimize nested loops to improve performance scaling.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Identify redundant operations in the inner loop and store results in a map to replace the inner loop with O(1) lookups.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(N) time</span> | <span class="complexity-good">O(N) space</span>
      </div>
    </div>
  </div>

  <!-- SECTION 9: LESSON SUMMARY -->
  <div class="summary-section">
    <div class="summary-glow"></div>
    <div class="section-badge">✅ SUMMARY</div>
    <h3 class="summary-title">What You Learned Today</h3>
    
    <ul class="summary-list">
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Control flow statements direct code execution paths.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Java <code>if-else</code> structures evaluate conditional expressions.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Short-circuit evaluation optimizes evaluations for AND (<code>&amp;&amp;</code>) and OR (<code>||</code>) operators.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Traditional switch statements require break statements to prevent fall-through errors.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Switch expressions use arrows (<code>-&gt;</code>) to return values without fall-through errors.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>The <code>while</code> loop checks conditions at entry; the <code>do-while</code> loop checks at exit.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Labeled loops allow inner statements to break or continue outer loops directly.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Adding semicolons at the end of loop headers terminates them immediately, creating empty loop bodies.</span>
      </li>
    </ul>
    
    <div class="interview-takeaways">
      <h4>🎯 Say This in Your Interview:</h4>
      <div class="quote-block">
        "Java control structures coordinate branching and loops. Traditional switch statements require explicit break statements to prevent fall-through, while modern Switch Expressions use arrow labels to return values directly and prevent fall-through. Labeled break statements allow you to exit nested loop structures directly."
      </div>
    </div>
    
    <div class="next-lesson-card">
      <span class="next-label">Up Next &rarr;</span>
      <span class="next-title">Pseudo Code &amp; Logic Building</span>
      <span class="next-desc">
        Learn how to model algorithms and plan logic structures before writing code.
      </span>
    </div>
  </div>

  <h2>Real-Life Analogy</h2>
  <div class="analogy-intro">
    <h2 class="analogy-main-title">Understanding Control Flow Through Real Life</h2>
    <p class="analogy-subtitle">
      Let's look at how code branches and loops using real-world analogies.
    </p>
  </div>

  <!-- ANALOGY 1 -->
  <div class="analogy-card analogy-primary">
    <div class="analogy-number">Analogy 1</div>
    <div class="analogy-icon">🛣️</div>
    <h3 class="analogy-title">The Toll Plaza: branching via if-else</h3>
    
    <div class="analogy-story">
      <p>
        Imagine driving a car on the Delhi-Gurugram Expressway. As you approach the toll plaza, the highway branches into different lanes. One set of lanes is labeled <strong>FASTag only</strong>, and another is labeled <strong>Cash payments</strong>.
      </p>
      <p>
        A sensor scans your windshield. <strong>If</strong> a valid FASTag is detected, the barrier opens and you pass through. <strong>Else</strong>, you are directed to the cash lane where you must pay manually.
      </p>
      <p>
        This matches Java's <code>if-else</code> branching. Your vehicle is the execution thread. The sensor check is the conditional statement, and the lanes are the separate code blocks executed depending on the outcome of the scan.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Car on Highway</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Execution Thread</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">FASTag Sensor Scan</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Conditional check: if (hasFastag)</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">FASTag Gate Lane</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">If Block Code</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Cash Payment Lane</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Else Block Code</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Conditional statements direct code execution paths based on Boolean evaluations.</p>
    </div>
  </div>

  <!-- ANALOGY 2 -->
  <div class="analogy-card analogy-secondary">
    <div class="analogy-number">Analogy 2</div>
    <div class="analogy-icon">🍔</div>
    <h3 class="analogy-title">The Zomato Kitchen: Switch Cases</h3>
    
    <div class="analogy-story">
      <p>
        Imagine the kitchen of a busy restaurant in Bengaluru receiving Zomato orders. An order status updates periodically: <code>PLACED</code>, <code>PREPARING</code>, <code>OUT_FOR_DELIVERY</code>, or <code>DELIVERED</code>.
      </p>
      <p>
        The kitchen screen monitors these statuses. When the status is <code>PLACED</code>, the system alerts the chef. When <code>PREPARING</code>, it updates the food timer. When <code>OUT_FOR_DELIVERY</code>, it sends GPS coordinates to the customer.
      </p>
      <p>
        Instead of using nested <code>if-else</code> checks, this state routing is managed using a <code>switch</code> expression. Each order status maps to a specific action label, directing execution to the correct code branch.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Order Status Enum</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Switch Control variable</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Status Case Labels</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Case Conditions</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Specific Kitchen Actions</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Case Code Blocks</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Invalid Status Alert</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Default Fallback case</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Switch statements map variable states to specific execution blocks.</p>
    </div>
  </div>

  <!-- ANALOGY 3 -->
  <div class="analogy-card analogy-tertiary">
    <div class="analogy-number">Analogy 3</div>
    <div class="analogy-icon">🌀</div>
    <h3 class="analogy-title">The Washing Machine: Loops and Gates</h3>
    
    <div class="analogy-story">
      <p>
        Consider a washing machine set to a 10-minute wash cycle. The agitator drum must rotate repeatedly until the timer reaches zero.
      </p>
      <p>
        This is a standard <code>for</code> loop. The timer starts at 10 (initialization), decrements by 1 each minute (update), and continues spinning while the timer is greater than zero (guard condition).
      </p>
      <p>
        Now, consider the water filling sequence. The machine must pump water until the drum is full. This is a <code>while</code> loop. It checks if the water level is below target. If it is, it keeps pumping. If the drum is already full, it skips the pumping block entirely.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Agitator Rotation</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Loop Iteration Body</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Cycle Timer Dial</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Loop Counter variable</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Pumping Water until Full</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">while (waterLevel &lt; full)</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Power Cut (Emergency stop)</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Break Statement</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Loops repeat execution blocks while their guard conditions remain true.</p>
    </div>
  </div>

  <!-- BEFORE vs AFTER UNDERSTANDING -->
  <div class="analogy-before-after">
    <h3>Before &amp; After Learning This</h3>
    <div class="ba-grid">
      <div class="ba-before">
        <h4>😕 Before (What you thought)</h4>
        <p>You thought switch statements always need break statements, and nested loops cannot be exited directly.</p>
      </div>
      <div class="ba-after">
        <h4>😊 After (What you now know)</h4>
        <p>You know switch expressions prevent fall-through errors, and labeled breaks allow you to exit nested loops directly.</p>
      </div>
    </div>
  </div>

  <!-- VISUAL MEMORY AID -->
  <div class="memory-aid">
    <h3>Remember It Forever: The One-Line Mental Model</h3>
    <div class="memory-card">
      <p class="memory-quote">
        "Switch expressions use arrows to return values cleanly, while labeled breaks allow you to exit nested loops directly."
      </p>
    </div>
  </div>
</article>`,
      theory: `<h3>Core Theory: Control Flow & Conditionals</h3>
<p>Control flow statements in Java direct the execution path of code based on conditions and loops. They include selection statements (<code>if</code>, <code>else if</code>, <code>switch</code>), iteration statements (<code>for</code>, <code>while</code>, <code>do-while</code>), and jump statements (<code>break</code>, <code>continue</code>, <code>return</code>).</p>
<p>Java enforces strict boolean expressions in conditionals (no truthy/falsy values like C). Short-circuit evaluation optimizes <code>&&</code> and <code>||</code> by skipping unnecessary operand evaluation. Modern switch expressions (Java 14+) use arrow syntax to eliminate fall‑through and can return values directly.</p>
<p>Loops repeat blocks while a guard condition holds. Nested loops multiply complexities, and labeled breaks allow exiting outer loops from inner blocks, reducing the need for extra flags.</p>`,
      analogy: "A toll plaza with FASTag lanes branching drivers based on a sensor check, a Zomato kitchen routing orders by status, or a washing machine timer spinning until zero – all represent control flow directing actions based on conditions.",
      interviewNotes: "Key interview points: differences between traditional switch and switch expressions, labeled break to exit nested loops, short-circuit evaluation for null safety, avoiding infinite loops with correct index updates, and why floating‑point variables should not be loop counters.",
      commonMistakes: "• Semicolon after loop header creates an empty body.\n• Off‑by‑one errors when using <= instead of < with array length.\n• Using == to compare strings instead of .equals().\n• Unreachable code after unconditional break/return.\n• Floating‑point arithmetic causing infinite loops due to rounding.\n• Variable scope leakage when declaring loop counters outside the loop.",
      practiceProblems: [
        {
          title: "Prime Checker Loop",
          problemText: "Write a method that takes an integer N and returns true if N is prime. Optimize the loop to run in O(√N) time.",
          solution: `public static boolean isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}`
        },
        {
          title: "ATM PIN Validator",
          problemText: "Implement a PIN validation loop using do-while. Allow a maximum of 3 attempts. After 3 failures, lock the account.",
          solution: `public static void validatePin() {
    Scanner sc = new Scanner(System.in);
    final String correctPin = "1234";
    int attempts = 0;
    String input;
    do {
        System.out.print("Enter PIN: ");
        input = sc.nextLine();
        attempts++;
        if (input.equals(correctPin)) {
            System.out.println("Access granted.");
            break;
        }
        System.out.println("Incorrect PIN. Attempts left: " + (3 - attempts));
    } while (attempts < 3 && !input.equals(correctPin));
    if (!input.equals(correctPin)) {
        System.out.println("Account locked.");
    }
}`
        },
        {
          title: "Spiral Matrix Traversal",
          problemText: "Given an M x N matrix, return all elements in spiral order.",
          solution: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    if (matrix.length == 0) return result;
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) result.add(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) result.add(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
            left++;
        }
    }
    return result;
}`
        },
        {
          title: "Tax Slab Switch Evaluator",
          problemText: "Create a program that calculates income tax using Java Switch Expressions based on tax slabs.",
          solution: `public static double calculateTax(int income) {
    int slab = income / 100_000;
    double tax = switch (slab) {
        case 0, 1, 2 -> income * 0.05;      // up to 2.5L
        case 3, 4, 5 -> income * 0.10;      // 2.5L to 5L
        case 6, 7 -> income * 0.15;          // 5L to 7.5L
        default -> income * 0.20;            // above 7.5L
    };
    return tax;
}`
        },
        {
          title: "Longest Substring Without Repeating Characters",
          problemText: "Given a string s, find the length of the longest substring without repeating characters.",
          solution: `public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right))) {
            set.remove(s.charAt(left));
            left++;
        }
        set.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`
        },
        {
          title: "Nested Loop Optimizer",
          problemText: "Rewrite a nested loop algorithm that finds all pairs (i, j) with a given sum, from O(N^2) to O(N) using a map.",
          solution: `// O(N^2) version:
public static void findPairsN2(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] == target) {
                System.out.println(arr[i] + " + " + arr[j]);
            }
        }
    }
}

// O(N) version using a map:
public static void findPairsON(int[] arr, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int num : arr) {
        int complement = target - num;
        if (seen.contains(complement)) {
            System.out.println(num + " + " + complement);
        }
        seen.add(num);
    }
}`
        }
      ],
      quiz: {
        questions: [
          {
            questionText: "What is the result of missing a break statement in a traditional switch-case block?",
            options: [
              { text: "A compile-time error occurs immediately.", isCode: false },
              { text: "Execution falls through to the next case block regardless of condition matches.", isCode: false },
              { text: "The switch block terminates immediately.", isCode: false },
              { text: "The JVM throws a NullPointerException at runtime.", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "In traditional switch statements, missing a 'break' statement allows execution to fall through to subsequent case blocks until a 'break' or the end of the switch block is reached."
          },
          {
            questionText: "What does this code print?\n\nouter:\nfor(int i = 0; i < 3; i++) {\n  for(int j = 0; j < 3; j++) {\n    if (i == 1) break outer;\n    System.out.print(i + \"\" + j + \" \");\n  }\n}",
            options: [
              { text: "00 01 02 10 11 12 20 21 22", isCode: false },
              { text: "00 01 02", isCode: false },
              { text: "00 01 02 20 21 22", isCode: false },
              { text: "00 01 02 10", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "When 'i == 1', the 'break outer' statement terminates the outer loop. This prevents any further iterations of both loops, so only '00 01 02' is printed."
          },
          {
            questionText: "What compilation issue exists in the following code block?\n\nint check = 5;\nif (check = 10) {\n  System.out.println(\"Match\");\n}",
            options: [
              { text: "The if guard contains an assignment operator (=) instead of a comparison operator (==), yielding an int instead of a boolean.", isCode: false },
              { text: "Variables cannot be declared in the same scope as if statements.", isCode: false },
              { text: "The if block is missing a default else condition.", isCode: false },
              { text: "The syntax requires a switch statement instead of if.", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "In Java, 'check = 10' is an assignment expression that evaluates to the integer 10. Java requires a strict 'boolean' type inside 'if' guard statements, so this triggers a compilation error."
          },
          {
            questionText: "You are building a command line utility that parses lines of a file until it reaches the end. Which loop structure is best suited for this task?",
            options: [
              { text: "A traditional for loop", isCode: false },
              { text: "A do-while loop", isCode: false },
              { text: "A while loop", isCode: false },
              { text: "An enhanced nested for loop", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "A 'while' loop is optimal when the exact iteration count is unknown beforehand. It checks the guard condition (e.g., if there is another line to read) before entering the loop body, preventing execution when the file is empty."
          },
          {
            questionText: "What is the worst-case time complexity of traversing a two-dimensional matrix of size N x M using nested loops?",
            options: [
              { text: "O(N + M)", isCode: false },
              { text: "O(1)", isCode: false },
              { text: "O(N * M)", isCode: false },
              { text: "O(N^2)", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "Traversing a matrix of size N x M requires visiting every element once. The outer loop runs N times, and for each iteration, the inner loop runs M times, resulting in a worst-case time complexity of O(N * M)."
          }
        ]
      }
    },
    {
      id: "pseudo-code",
      title: "Pseudo Code & Logic Building",
      slug: "pseudo-code",
      description: "Master Pseudo Code & Logic Building conceptual implementation and quiz review.",
      difficulty: "Beginner",
      estTime: "15 min",
      quizAvailable: true,
      xpReward: 50,
      visualizer: null,
      visualizations: [],
      objectives: [
        "Understand Pseudo Code & Logic Building fundamentals",
        "Explain structural complexity and dry-run boundaries"
      ],
      content: `<article class="lesson-content">
  <!-- SECTION 1: HOOK / WHY THIS MATTERS -->
  <div class="theory-hook">
    <div class="hook-badge">⚡ WHY THIS MATTERS</div>
    <h2 class="hook-title">The NASA Mars Climate Orbiter Crash: The Cost of Skipping Logic Design</h2>
    <p class="hook-body">
      In 1999, the Mars Climate Orbiter disintegrated in the Martian atmosphere, costing over ₹900 crore. The disaster occurred because one engineering team used imperial units while another used metric units for thrust calculations. This logic mismatch went unnoticed during coding because the teams jumped straight to writing code without aligning on their algorithms. Had they written language-agnostic pseudo-code and dry-run their calculations on paper, the unit discrepancy would have been caught instantly. Pseudo-code is your logic blueprint. It separates mathematical and logical design from syntax, helping you find bugs before you compile.
    </p>
    <div class="hook-placement-note">
      <span class="placement-icon">🎯</span>
      <span>Tested in technical interviews and whiteboarding rounds at <strong>Google</strong>, <strong>Amazon</strong>, <strong>Flipkart</strong>, and <strong>TCS Digital</strong>.</span>
    </div>
  </div>

  <!-- SECTION 2: CORE CONCEPTS (THEORY DEEP DIVE) -->
  <div class="theory-section">
    <div class="section-badge">📚 CORE THEORY</div>
    <h3 class="section-title">Fundamentals of Pseudo-Code &amp; Logic Design</h3>
    
    <h4 class="concept-heading">1. What is Pseudo-Code?</h4>
    <p>
      Pseudo-code is an informal, language-agnostic way of representing algorithms. It uses structured English to describe step-by-step logic without requiring strict programming language syntax (like semicolons, curly braces, or type declarations). 
    </p>
    <p>
      Its primary goal is to make algorithms readable by humans, enabling developers, architects, and product managers to verify logic before coding starts.
    </p>

    <h4 class="concept-heading">2. Key Building Blocks of Pseudo-Code</h4>
    <p>
      Good pseudo-code uses standardized, capitalized keywords to represent control structures:
    </p>
    <div class="concept-types">
      <div class="concept-type-card">
        <h5 class="type-name">Input &amp; Output Operations</h5>
        <p>Represent reading values and displaying results:</p>
        <ul class="type-list">
          <li><code>READ / INPUT:</code> Prompts for or reads user inputs (e.g., <code>READ username</code>).</li>
          <li><code>PRINT / WRITE / OUTPUT:</code> Displays results to the output stream (e.g., <code>PRINT "Hello"</code>).</li>
        </ul>
      </div>

      <div class="concept-type-card">
        <h5 class="type-name">Control Flow Structures</h5>
        <p>Guide the path of execution based on logic conditions:</p>
        <ul class="type-list">
          <li><code>IF / THEN / ELSE / ENDIF:</code> Conditional branching blocks.</li>
          <li><code>WHILE / ENDWHILE:</code> Loops that repeat while a condition remains true.</li>
          <li><code>FOR / TO / STEP / ENDFOR:</code> Loops that iterate a set number of times.</li>
        </ul>
      </div>
    </div>

    <h4 class="concept-heading">3. Guidelines for Writing Readable Pseudo-Code</h4>
    <p>
      To write effective pseudo-code:
      - Use standard keywords in UPPERCASE (e.g., <code>READ</code>, <code>IF</code>, <code>WHILE</code>).
      - Maintain clear indentation levels to show nested logic blocks.
      - Keep statements clear and precise (e.g., write <code>Set average = sum / count</code> rather than "calculate the average value").
      - Focus on logic instead of specific language constructs (e.g., write <code>Initialize List</code> rather than <code>ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;()</code>).
    </p>
    
    <table class="complexity-table" style="margin: 1.5rem 0; width: 100%;">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Unstructured Pseudo-Code</th>
          <th>Structured Pseudo-Code</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Keywords</strong></td>
          <td>Uses lowercase, varied terms (<code>get</code>, <code>show</code>)</td>
          <td>Uses standardized uppercase terms (<code>READ</code>, <code>PRINT</code>)</td>
        </tr>
        <tr>
          <td><strong>Indentation</strong></td>
          <td>Flat layout without indentation</td>
          <td>Indented levels to show nested blocks</td>
        </tr>
        <tr>
          <td><strong>Logic Focus</strong></td>
          <td>Vague instructions (e.g., "Sort the list")</td>
          <td>Step-by-step algorithms (e.g., nested loops)</td>
        </tr>
      </tbody>
    </table>

    <h4 class="concept-heading">4. Logic Building &amp; Problem Decomposition</h4>
    <p>
      Problem decomposition is the process of breaking down a complex problem into smaller, manageable steps. 
    </p>
    <p>
      To build a solution:
      - Define inputs, outputs, and constraints clearly.
      - Plan the steps in plain English first.
      - Refine the steps into structured pseudo-code.
      - Test the pseudo-code with sample inputs on paper (dry-running) to catch edge-case errors before you write the actual code.
    </p>
  </div>

  <!-- SECTION 3: COLORED SYNTAX CODE BLOCKS -->
  <div class="theory-section">
    <div class="section-badge">💻 CODE LAB</div>
    <h3 class="section-title">Pseudo-Code to Java Conversions</h3>

    <h4 class="concept-heading">Example 1: Bubble Sort Logic (Pseudo-Code vs. Java)</h4>
    <p>This side-by-side comparison shows the relationship between language-agnostic pseudo-code and its Java implementation.</p>
    
    <div class="wrong-label">Pseudo-Code Logic:</div>
    <div class="code-block-wrapper wrong-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">PseudoCode</span>
        <span class="code-filename">bubble_sort.txt</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">PROCEDURE</span> <span style="color:#FFA657">BubbleSort</span><span style="color:#E6EDF3">(arr, size)</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">FOR</span> <span style="color:#E6EDF3">i = 0</span> <span style="color:#FF7B72">TO</span> <span style="color:#E6EDF3">size - 1</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#FF7B72">FOR</span> <span style="color:#E6EDF3">j = 0</span> <span style="color:#FF7B72">TO</span> <span style="color:#E6EDF3">size - i - 2</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">      <span style="color:#FF7B72">IF</span> <span style="color:#E6EDF3">arr[j] &gt; arr[j+1]</span> <span style="color:#FF7B72">THEN</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">        <span style="color:#484F58; font-style:italic">        // Swap elements</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">        <span style="color:#E6EDF3">temp = arr[j]</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">        <span style="color:#E6EDF3">arr[j] = arr[j+1]</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">        <span style="color:#E6EDF3">arr[j+1] = temp</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">      <span style="color:#FF7B72">ENDIF</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">    <span style="color:#FF7B72">ENDFOR</span></span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">  <span style="color:#FF7B72">ENDFOR</span></span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content"><span style="color:#FF7B72">ENDPROCEDURE</span></span></div>
      </div>
    </div>

    <div class="right-label">Java Implementation:</div>
    <div class="code-block-wrapper correct-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">BubbleSort.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">BubbleSort</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">bubbleSort</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span><span style="color:#E6EDF3">[] arr) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">n = arr.length;</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">    <span style="color:#FF7B72">for</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i &lt; n - </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">; i++) {</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">      <span style="color:#FF7B72">for</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">j = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; j &lt; n - i - </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">; j++) {</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">        <span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(arr[j] &gt; arr[j+1]) {</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">          <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">temp = arr[j];</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">          arr[j] = arr[j+1];</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">          arr[j+1] = temp;</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">        <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">      <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content">    <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">13</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">14</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">Sorted Array values verified in O(N^2) Time complexity.</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>

    <h4 class="concept-heading">Example 2: Find Maximum (Safe Bounds Handling)</h4>
    <p>This comparison shows how to handle array bounds checks safely when finding the maximum value in an array.</p>
    
    <div class="wrong-label">❌ WRONG — Assuming Non-Empty Array:</div>
    <div class="code-block-wrapper wrong-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">UnsafeMax.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">UnsafeMax</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static int</span> <span style="color:#D2A8FF">getMax</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span><span style="color:#E6EDF3">[] arr) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">max = arr[</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">];</span> <span style="color:#484F58; font-style:italic"> // ❌ Throws ArrayIndexOutOfBoundsException if array is empty</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">    <span style="color:#FF7B72">for</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i = </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">; i &lt; arr.length; i++) {</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">      <span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(arr[i] &gt; max) max = arr[i];</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">    <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    <span style="color:#FF7B72">return</span> <span style="color:#E6EDF3">max;</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
    </div>

    <div class="right-label">✅ CORRECT — Validate Array Bounds First:</div>
    <div class="code-block-wrapper correct-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">SafeMax.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">SafeMax</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static int</span> <span style="color:#D2A8FF">getMax</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span><span style="color:#E6EDF3">[] arr) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(arr == </span><span style="color:#79C0FF">null</span> <span style="color:#E6EDF3">|| arr.length == </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">) {</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">      <span style="color:#FF7B72">throw new</span> <span style="color:#FFA657">IllegalArgumentException</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Array cannot be null or empty"</span><span style="color:#E6EDF3">);</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">    <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">max = arr[</span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">];</span> <span style="color:#484F58; font-style:italic"> // Safe allocation. Time: O(N) | Space: O(1)</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    <span style="color:#FF7B72">for</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i = </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">; i &lt; arr.length; i++) {</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">      <span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(arr[i] &gt; max) max = arr[i];</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">    <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">    <span style="color:#FF7B72">return</span> <span style="color:#E6EDF3">max;</span></span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
    </div>
  </div>

  <!-- SECTION 4: STEP-BY-STEP DRY RUN -->
  <div class="dryrun-section">
    <div class="section-badge">🔍 STEP-BY-STEP TRACE</div>
    <h3 class="section-title">Tracing Binary Search Logic Design</h3>
    <p class="dryrun-intro">
      Let's trace how a Binary Search algorithm parses a sorted array step-by-step to find the index of target value <code>12</code>:
    </p>

    <div class="dryrun-container">
      <div class="dryrun-step">
        <div class="step-circle">1</div>
        <div class="step-body">
          <div class="step-code">low = 0, high = 4 -&gt; mid = 2 (val = 8)</div>
          <p class="step-explain">
            The algorithm initializes boundaries to cover the entire array. The midpoint element is <code>8</code>. Since <code>8 &lt; 12</code>, the target must reside in the right partition.
          </p>
          <div class="step-state">
            <span class="state-var">low = 0, high = 4</span>
            <span class="state-var">mid = 2, arr[mid] = 8</span>
            <span class="state-result">8 &lt; 12 → Search right partition (low = 3)</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step">
        <div class="step-circle">2</div>
        <div class="step-body">
          <div class="step-code">low = 3, high = 4 -&gt; mid = 3 (val = 12)</div>
          <p class="step-explain">
            The boundaries narrow to the right partition. The new midpoint element is <code>12</code>. Since <code>12 == 12</code>, the algorithm returns index 3.
          </p>
          <div class="step-state">
            <span class="state-var">low = 3, high = 4</span>
            <span class="state-var">mid = 3, arr[mid] = 12</span>
            <span class="state-result">12 == 12 → Target found! Return 3</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step" style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px; margin-top: 15px;">
        <h5 style="margin: 0 0 8px 0; color: #FFA657;">Binary Search Partition Reduction</h5>
        <span style="font-family: monospace; display: block; white-space: pre; color: #E6EDF3; line-height: 1.4;">
Initial array:   [ 2,  5,  8, 12, 16 ]
                  L        M        H
After step 1:            [ 12, 16 ]
                             LM   H
        </span>
      </div>

      <div class="dryrun-result">
        <span class="result-icon">✅</span>
        <span>Binary search located target 12 in 2 steps, whereas a linear search would have taken 4 steps.</span>
      </div>
    </div>
  </div>

  <!-- SECTION 5: COMPLEXITY ANALYSIS TABLE -->
  <div class="complexity-section">
    <div class="section-badge">⚡ COMPLEXITY ANALYSIS</div>
    <h3 class="section-title">Search Algorithm Complexities</h3>
    <p class="complexity-intro">
      Understanding complexity curves is essential for logic design. Designing algorithms that minimize processing steps improves scaling behavior.
    </p>

    <table class="complexity-table">
      <thead>
        <tr>
          <th>Algorithm Design</th>
          <th>Best Case</th>
          <th>Average Case</th>
          <th>Worst Case</th>
          <th>Auxiliary Space</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Linear Search</td>
          <td><span class="complexity-good">O(1)</span></td>
          <td><span class="complexity-ok">O(N)</span></td>
          <td><span class="complexity-ok">O(N)</span></td>
          <td><span class="complexity-good">O(1)</span></td>
        </tr>
        <tr>
          <td>Binary Search</td>
          <td><span class="complexity-good">O(1)</span></td>
          <td><span class="complexity-good">O(log N)</span></td>
          <td><span class="complexity-good">O(log N)</span></td>
          <td><span class="complexity-good">O(1)</span></td>
        </tr>
      </tbody>
    </table>

    <div class="complexity-intuition">
      <h4>The Power of Logarithmic Scaling</h4>
      <p>
        Linear searches scale proportionally with input size. In contrast, binary search halves the search space at each step. This allows it to locate an item among 1 million elements in just 20 comparison steps.
      </p>

      <div class="complexity-comparison">
        <div class="comp-row">
          <span class="comp-n">N = 100</span>
          <span class="comp-linear bad-complexity">Linear Search: 100 checks</span>
          <span class="comp-log good-complexity">Binary Search: 7 checks</span>
        </div>
        <div class="comp-row">
          <span class="comp-n">N = 1,000,000</span>
          <span class="comp-linear bad-complexity">Linear Search: 1,000,000 checks</span>
          <span class="comp-log good-complexity">Binary Search: 20 checks</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 6: COMMON MISTAKES -->
  <div class="mistakes-section">
    <div class="section-badge">🚫 COMMON MISTAKES</div>
    <h3 class="section-title">Common Logic Mistakes in Algorithm Design</h3>

    <!-- Mistake 1 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #1: Semicolons or syntax inside pseudo-code</h4>
      </div>
      <p class="mistake-scenario">
        Writing code syntax inside pseudo-code makes it harder for non-technical stakeholders to read, defeating its purpose as a language-agnostic blueprint.
      </p>
      
      <div class="wrong-label">❌ WRONG — Too Language-Specific:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">public void</span> <span style="color:#D2A8FF">addElements</span><span style="color:#E6EDF3">(ArrayList&lt;Integer&gt; list) {</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">sum = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i : list) { sum += i; }</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT — Language-Agnostic:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">PROCEDURE</span> <span style="color:#FFA657">CalculateSum</span><span style="color:#E6EDF3">(list)</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  Set sum = 0</span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">FOR EACH</span> item <span style="color:#FF7B72">IN</span> list</span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content">    sum = sum + item</span></div>
          <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#FF7B72">ENDFOR</span></span></div>
          <div class="code-line"><span class="ln">6</span><span class="code-content">  <span style="color:#FF7B72">RETURN</span> sum</span></div>
          <div class="code-line"><span class="ln">7</span><span class="code-content"><span style="color:#FF7B72">ENDPROCEDURE</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Language-agnostic design ensures pseudo-code remains readable by all team members.
      </div>
    </div>

    <!-- Mistake 2 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #2: Off-by-one errors in loop terminations</h4>
      </div>
      <p class="mistake-scenario">
        Looping to index <code>N</code> instead of <code>N - 1</code> when using zero-indexed arrays triggers <code>IndexOutOfBounds</code> errors.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i &lt;= arr.length; i++) {</span> <span style="color:#484F58; font-style:italic"> // ❌ Index equals length at final step, causing exception</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(arr[i]);</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">for</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">i = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">; i &lt; arr.length; i++) {</span> <span style="color:#484F58; font-style:italic"> // ✅ Stops before index equals length</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(arr[i]);</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Off-by-one errors are a common source of array index crashes.
      </div>
    </div>

    <!-- Mistake 3 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #3: Integer division truncations</h4>
      </div>
      <p class="mistake-scenario">
        Dividing two integers in Java truncates decimal values, which can introduce rounding errors.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">sum = </span><span style="color:#79C0FF">15</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">count = </span><span style="color:#79C0FF">2</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">avg = sum / count;</span> <span style="color:#484F58; font-style:italic"> // ❌ Performs integer division first: 15 / 2 = 7, then assigns 7.0</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">sum = </span><span style="color:#79C0FF">15</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">count = </span><span style="color:#79C0FF">2</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">avg = (</span><span style="color:#79C0FF">double</span><span style="color:#E6EDF3">) sum / count;</span> <span style="color:#484F58; font-style:italic"> // ✅ Casting forces double-precision division: 7.5</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Integer truncation causes mathematical calculation discrepancies.
      </div>
    </div>

    <!-- Mistake 4 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #4: Writing vague instructions in pseudo-code</h4>
      </div>
      <p class="mistake-scenario">
        Writing vague instructions like "Search the user database" does not define the search algorithm, leaving the implementation unclear.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content">Search user database for matching record</span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">FOR EACH</span> user <span style="color:#FF7B72">IN</span> database</span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">IF</span> user.id == targetId <span style="color:#FF7B72">THEN</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#FF7B72">RETURN</span> user</span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#FF7B72">ENDIF</span></span></div>
          <div class="code-line"><span class="ln">5</span><span class="code-content"><span style="color:#FF7B72">ENDFOR</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Defining loop and lookup actions explicitly prevents gaps during implementation.
      </div>
    </div>

    <!-- Mistake 5 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #5: Integer overflow checks after overflow has occurred</h4>
      </div>
      <p class="mistake-scenario">
        Checking if a sum exceeds maximum values after performing the addition fails because overflow has already occurred.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">sum = a + b;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(sum &gt; </span><span style="color:#79C0FF">Integer</span><span style="color:#E6EDF3">.MAX_VALUE) {</span> <span style="color:#484F58; font-style:italic"> // 2 Will never be true since 'sum' rolls over</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// Handle overflow</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(a &gt; </span><span style="color:#79C0FF">Integer</span><span style="color:#E6EDF3">.MAX_VALUE - b) {</span> <span style="color:#484F58; font-style:italic"> // ✅ Detects overflow risk before addition</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// Handle overflow</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Prevents math errors from causing silent logic failures.
      </div>
    </div>
  </div>

  <!-- SECTION 7: INTERVIEW PREPARATION -->
  <div class="interview-section">
    <div class="section-badge">🎯 INTERVIEW PREP</div>
    <h3 class="section-title">Logic &amp; Pseudo-Code Interview Questions</h3>

    <div class="interview-companies">
      <span class="company-tag amazon">Amazon</span>
      <span class="company-tag google">Google</span>
      <span class="company-tag tcs">TCS</span>
      <span class="company-tag infosys">Infosys</span>
      <span class="company-tag flipkart">Flipkart</span>
    </div>

    <!-- Q1 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q1</span>
        <span class="qa-text">Why do interviewers ask candidates to write pseudo-code before writing actual code?</span>
        <div class="qa-companies">
          <span class="mini-tag">Google</span>
          <span class="mini-tag">Amazon</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Interviewers use pseudo-code to evaluate a candidate's problem-solving approach independently of syntax constraints. It shows if the candidate can structure an algorithm logically, decompose complex problems, and design control paths before getting bogged down in compile-time specifics.
        </p>
        <div class="answer-key-point">
          💡 Key point: Pseudo-code isolates logical thinking from language syntax constraints.
        </div>
      </div>
    </div>

    <!-- Q2 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q2</span>
        <span class="qa-text">Compare flowcharts and pseudo-code as design tools.</span>
        <div class="qa-companies">
          <span class="mini-tag">Infosys</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Flowcharts are graphical diagrams that use symbols (like diamonds for decisions and rectangles for processes) to show control paths visually. They are helpful for presenting high-level system flows. Pseudo-code is a text-based, structured representation that is closer to actual code. This makes it easier to model detailed loops, indices, and nested conditions.
        </p>
        <div class="answer-key-point">
          💡 Key point: Flowcharts are visual design diagrams; pseudo-code is text-based and closer to code logic.
        </div>
      </div>
    </div>

    <!-- Q3 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q3</span>
        <span class="qa-text">How do you handle exceptions or validation failures in pseudo-code?</span>
        <div class="qa-companies">
          <span class="mini-tag">Amazon</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          In pseudo-code, handle exceptions using defensive conditional statements at the beginning of procedures (e.g., <code>IF array is empty THEN RETURN error</code>). You can also use structured keywords like <code>TRY</code>, <code>CATCH</code>, or <code>THROW ERROR</code> to model error recovery paths.
        </p>
        <div class="answer-key-point">
          💡 Key point: Use defensive checks and standard TRY-CATCH blocks to document exception handling in pseudo-code.
        </div>
      </div>
    </div>

    <!-- Q4 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q4</span>
        <span class="qa-text">Write a pseudo-code procedure for a recursive calculation, like Factorial.</span>
        <div class="qa-companies">
          <span class="mini-tag">TCS</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Recursive structures can be modeled using base case conditionals:
          <code>PROCEDURE Factorial(n)</code>
          <code>&nbsp;&nbsp;IF n == 0 OR n == 1 THEN RETURN 1</code>
          <code>&nbsp;&nbsp;ELSE RETURN n * Factorial(n - 1)</code>
          <code>ENDPROCEDURE</code>
        </p>
        <div class="answer-key-point">
          💡 Key point: Recursive algorithms require a conditional base case check to prevent infinite recursion.
        </div>
      </div>
    </div>

    <!-- Q5 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q5</span>
        <span class="qa-text">How do you represent keys, lookups, and key-value structures in pseudo-code?</span>
        <div class="qa-companies">
          <span class="mini-tag">Flipkart</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Represent dictionaries or maps using key-value terms:
          <code>Initialize Map dynamicMap</code>
          <code>Set dynamicMap["keyName"] = value</code>
          <code>IF dynamicMap CONTAINS KEY searchKey THEN ...</code>
          This keeps lookups clear without specifying concrete classes like HashMap.
        </p>
        <div class="answer-key-point">
          💡 Key point: Use terms like Map, key checks, and bracket indexes to model key-value lookups.
        </div>
      </div>
    </div>

    <!-- Q6 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q6</span>
        <span class="qa-text">What does it mean to dry-run an algorithm?</span>
        <div class="qa-companies">
          <span class="mini-tag">TCS</span>
          <span class="mini-tag">Infosys</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Dry-running is the process of executing an algorithm's steps manually on paper. You trace input variables through branches and loops, recording state changes in a table. This helps you identify off-by-one errors, boundary exceptions, and logic issues before writing code.
        </p>
        <div class="answer-key-point">
          💡 Key point: Dry-running checks algorithm logic manually by tracing variable changes on paper.
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 8: PRACTICE PROBLEMS -->
  <div class="practice-section">
    <div class="section-badge">💪 PRACTICE PROBLEMS</div>
    <h3 class="section-title">Logic Challenges</h3>

    <!-- Problem 1 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">01</span>
        <span class="difficulty-easy">Easy</span>
        <span class="platform-tag">Placement Lab #1</span>
      </div>
      <h4 class="problem-title">Iterative Factorial Logic</h4>
      <p class="problem-desc">
        Write pseudo-code to calculate the factorial of a number iteratively. Include guard checks to handle negative values.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Teaches iterative multiplication loops and parameter validation.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Verify if <code>N &lt; 0</code>. Initialize <code>result = 1</code>, then loop from 2 to N, updating <code>result = result * i</code>.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(N) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 2 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">02</span>
        <span class="difficulty-easy">Easy</span>
        <span class="platform-tag">Placement Lab #2</span>
      </div>
      <h4 class="problem-title">Palindrome Logic Builder</h4>
      <p class="problem-desc">
        Write a pseudo-code procedure to determine if a string is a palindrome. Use a two-pointer approach to optimize execution.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Demonstrates two-pointer traversal logic inside loop blocks.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Initialize <code>left = 0</code> and <code>right = length - 1</code>. While <code>left &lt; right</code>, verify if characters match, and shift pointers inwards.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(N) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 3 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">03</span>
        <span class="difficulty-medium">Medium</span>
        <span class="platform-tag">Placement Lab #3</span>
      </div>
      <h4 class="problem-title">First Non-Repeated Character</h4>
      <p class="problem-desc">
        Write a pseudo-code algorithm to locate the first non-repeated character in a string using a tracking map.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Models logic that combines character tracking with map counts.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Traverse the string to build a map of character frequencies, then traverse the string a second time to find the first character with a count of 1.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(N) time</span> | <span class="complexity-good">O(K) space</span>
      </div>
    </div>

    <!-- Problem 4 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">04</span>
        <span class="difficulty-medium">Medium</span>
        <span class="platform-tag">Placement Lab #4</span>
      </div>
      <h4 class="problem-title">Sieve of Eratosthenes</h4>
      <p class="problem-desc">
        Write pseudo-code to generate all prime numbers up to N using the Sieve of Eratosthenes algorithm.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Teaches cross-reference index array logic.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Create a boolean array initialized to true. Loop from 2 up to sqrt(N), marking multiples of each prime as false.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-ok">O(N log log N) time</span> | <span class="complexity-ok">O(N) space</span>
      </div>
    </div>

    <!-- Problem 5 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">05</span>
        <span class="difficulty-hard">Hard</span>
        <span class="platform-tag">LeetCode #141</span>
      </div>
      <h4 class="problem-title">Linked List Cycle Detection</h4>
      <p class="problem-desc">
        Write pseudo-code to determine if a linked list contains a cycle using Floyd's cycle-finding algorithm.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Models logic using fast and slow moving pointers.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Initialize <code>slow = head</code> and <code>fast = head</code>. While <code>fast</code> and <code>fast.next</code> are not null, advance slow by 1 node and fast by 2 nodes, checking if they meet.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(N) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 6 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">06</span>
        <span class="difficulty-hard">Hard</span>
        <span class="platform-tag">Placement Lab #5</span>
      </div>
      <h4 class="problem-title">0/1 Knapsack Decision Algorithm</h4>
      <p class="problem-desc">
        Write pseudo-code to solve the 0/1 Knapsack problem using dynamic programming.
      </p>
      <div class="problem-connection">
        <strong>Connection:</strong> Models recursive decisions and optimization matrices.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Build an item-by-weight decision grid. Fill each cell by choosing the maximum value between including or excluding the current item.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-ok">O(N * W) time</span> | <span class="complexity-ok">O(N * W) space</span>
      </div>
    </div>
  </div>

  <!-- SECTION 9: LESSON SUMMARY -->
  <div class="summary-section">
    <div class="summary-glow"></div>
    <div class="section-badge">✅ SUMMARY</div>
    <h3 class="summary-title">What You Learned Today</h3>
    
    <ul class="summary-list">
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Pseudo-code is a language-agnostic way to represent algorithm logic.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Standard keywords (<code>READ</code>, <code>PRINT</code>, <code>IF</code>, <code>WHILE</code>) are capitalized.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Indentation is used to define nested logic blocks.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Problem decomposition splits complex problems into manageable steps.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Dry-running helps identify index errors and logical bugs on paper.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Logic checks at loop exits can prevent off-by-one errors.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Dividing integers truncates decimals in Java.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Excluding coding syntax keeps pseudo-code readable for all team members.</span>
      </li>
    </ul>
    
    <div class="interview-takeaways">
      <h4>🎯 Say This in Your Interview:</h4>
      <div class="quote-block">
        "Pseudo-code is a language-agnostic design tool used to plan algorithm logic. It separates logical design from syntax specifics. This allows you to verify logic paths and dry-run loops on paper to catch edge-case errors early."
      </div>
    </div>
    
    <div class="next-lesson-card">
      <span class="next-label">Up Next &rarr;</span>
      <span class="next-title">Methods &amp; Execution</span>
      <span class="next-desc">
        Learn how the JVM structures method execution, handles parameters, and manages the execution stack.
      </span>
    </div>
  </div>

  <h2>Real-Life Analogy</h2>
  <div class="analogy-intro">
    <h2 class="analogy-main-title">Understanding Pseudo-Code Through Real Life</h2>
    <p class="analogy-subtitle">
      Let's look at how planning algorithm logic compares to real-world tasks.
    </p>
  </div>

  <!-- ANALOGY 1 -->
  <div class="analogy-card analogy-primary">
    <div class="analogy-number">Analogy 1</div>
    <div class="analogy-icon">📖</div>
    <h3 class="analogy-title">The Recipe Book: Language-Agnostic Cooking</h3>
    
    <div class="analogy-story">
      <p>
        Imagine your grandmother explaining how to make masala chai. She says: <em>"Crush ginger, boil water, add tea leaves, pour milk, and simmer until it turns golden brown."</em>
      </p>
      <p>
        This instruction is a recipe (equivalent to pseudo-code). It describes the step-by-step logic in simple language. It does not depend on whether you use a gas stove, an electric hotplate, or an induction cooktop (equivalent to programming languages).
      </p>
      <p>
        Implementing the recipe on a modern induction cooktop with digital buttons requires specific steps (equivalent to syntax). The underlying culinary logic remains the same regardless of the appliance you use.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Grandmother's Recipe</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Pseudo-Code Blueprint</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Cooking Masala Chai</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Running Algorithm</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Induction Cooktop Settings</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Java Programming Syntax</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Kitchen Counter Space</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">JVM Memory Space</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Pseudo-code defines the logical steps of an algorithm, independent of programming language syntax.</p>
    </div>
  </div>

  <!-- ANALOGY 2 -->
  <div class="analogy-card analogy-secondary">
    <div class="analogy-number">Analogy 2</div>
    <div class="analogy-icon">📐</div>
    <h3 class="analogy-title">The Blueprint of a House</h3>
    
    <div class="analogy-story">
      <p>
        Before building a house in Mumbai, an architect designs a detailed blueprint. This shows the dimensions of rooms, doors, and plumbing paths on paper.
      </p>
      <p>
        The blueprint is not a physical house. You cannot live inside it. It is a plan that helps engineers spot design errors (like placing a pillar in front of the main entrance) before laying the foundation.
      </p>
      <p>
        Writing pseudo-code is like drawing this blueprint. It allows you to verify loop bounds and branching conditions on paper before writing code and compiling.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Blueprint Plan</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Pseudo-Code Algorithm</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Laying Bricks &amp; Mortar</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Writing Source Code</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Spotting Blueprint Errors</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Dry-running Logic on Paper</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">The Physical House</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">The Compiled Application</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Blueprints let you identify structural flaws before you start construction.</p>
    </div>
  </div>

  <!-- ANALOGY 3 -->
  <div class="analogy-card analogy-tertiary">
    <div class="analogy-number">Analogy 3</div>
    <div class="analogy-icon">💃</div>
    <h3 class="analogy-title">Why Pseudo-Code is NOT a programming language (Choreography Notes)</h3>
    
    <div class="analogy-story">
      <p>
        A choreographer writes dance steps on a notepad: <em>"Take 3 steps forward, turn clockwise, jump, clap."</em>
      </p>
      <p>
        These notes describe the dance logic. The notes themselves cannot dance. They are instructions written for dancers to interpret.
      </p>
      <p>
        Pseudo-code works the same way. The JVM cannot execute pseudo-code directly. It is written for developers to read, plan logic, and then implement in a programming language like Java.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Choreography Notes</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Pseudo-Code Instructions</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Dancers interpreting Steps</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Programmers implementing Logic</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">The Dance Performance</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Application Execution</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Step Boundaries</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Loop Guards</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Pseudo-code is written for human review and must be translated into code to run.</p>
    </div>
  </div>

  <!-- BEFORE vs AFTER UNDERSTANDING -->
  <div class="analogy-before-after">
    <h3>Before &amp; After Learning This</h3>
    <div class="ba-grid">
      <div class="ba-before">
        <h4>😕 Before (What you thought)</h4>
        <p>You thought programming is about syntax, and writing code directly is the fastest way to build software.</p>
      </div>
      <div class="ba-after">
        <h4>😊 After (What you now know)</h4>
        <p>You know planning logic with pseudo-code helps you find bugs early and makes writing code easier.</p>
      </div>
    </div>
  </div>

  <!-- VISUAL MEMORY AID -->
  <div class="memory-aid">
    <h3>Remember It Forever: The One-Line Mental Model</h3>
    <div class="memory-card">
      <p class="memory-quote">
        "Write logic in pseudo-code to plan your approach; implement in Java to compile and run."
      </p>
    </div>
  </div>
</article>`,
      theory: `<h3>Core Theory: Pseudo‑Code & Logic Building</h3>
<p>Pseudo-code is a language‑agnostic, human‑readable description of an algorithm. It uses standardized keywords (<code>READ</code>, <code>PRINT</code>, <code>IF</code>, <code>WHILE</code>, <code>FOR</code>) and indentation to model control flow without syntactical restrictions.</p>
<p>Good pseudo-code separates logic from implementation, allowing developers to reason about correctness, edge cases, and complexity before writing actual code. Dry‑running the algorithm on paper helps uncover off‑by‑one errors, infinite loops, and boundary failures early.</p>`,
      analogy: "Pseudo-code is like a recipe that explains how to make masala chai in simple steps, independent of whether you use a gas stove or induction cooktop. Or like an architect's blueprint that lets you spot design flaws before laying bricks.",
      interviewNotes: "Interviewers ask for pseudo-code to assess a candidate's algorithmic thinking without syntax distractions. Be prepared to write clear, structured pseudo-code for common problems (search, sort, recursion). Emphasise the importance of dry‑runs and handling edge cases.",
      commonMistakes: "• Writing language‑specific syntax inside pseudo‑code (defeats its purpose).\n• Off‑by‑one errors when iterating to array.length instead of length‑1.\n• Integer division truncation when calculating averages.\n• Vague instructions like 'search the database' without specifying how.\n• Checking overflow after performing the operation instead of before.",
      practiceProblems: [
        {
          title: "Iterative Factorial Logic",
          problemText: "Write pseudo-code to calculate the factorial of a number iteratively. Include guard checks for negative inputs.",
          solution: `PROCEDURE Factorial(n)
  IF n < 0 THEN
    RETURN error "Negative input not allowed"
  ENDIF
  Set result = 1
  FOR i = 2 TO n
    result = result * i
  ENDFOR
  RETURN result
ENDPROCEDURE`
        },
        {
          title: "Palindrome Logic Builder",
          problemText: "Write pseudo-code to determine if a string is a palindrome using a two‑pointer approach.",
          solution: `PROCEDURE IsPalindrome(str)
  Set left = 0, right = length(str) - 1
  WHILE left < right
    IF str[left] != str[right] THEN
      RETURN false
    ENDIF
    left = left + 1
    right = right - 1
  ENDWHILE
  RETURN true
ENDPROCEDURE`
        },
        {
          title: "First Non‑Repeated Character",
          problemText: "Write pseudo-code to find the first non‑repeated character in a string using a tracking map.",
          solution: `PROCEDURE FirstNonRepeated(str)
  Initialize Map freq
  // First pass: count frequencies
  FOR each character ch in str
    freq[ch] = freq[ch] + 1
  ENDFOR
  // Second pass: find first character with count 1
  FOR each character ch in str
    IF freq[ch] == 1 THEN
      RETURN ch
    ENDIF
  ENDFOR
  RETURN null  // no non‑repeated character
ENDPROCEDURE`
        },
        {
          title: "Sieve of Eratosthenes",
          problemText: "Write pseudo-code to generate all prime numbers up to N using the Sieve of Eratosthenes.",
          solution: `PROCEDURE SieveOfEratosthenes(N)
  Create boolean array isPrime[0..N] and set all to true
  Set isPrime[0] = false, isPrime[1] = false
  FOR i = 2 TO sqrt(N)
    IF isPrime[i] THEN
      FOR j = i * i TO N STEP i
        isPrime[j] = false
      ENDFOR
    ENDIF
  ENDFOR
  // Collect primes
  Initialize List primes
  FOR i = 2 TO N
    IF isPrime[i] THEN
      Add i to primes
    ENDIF
  ENDFOR
  RETURN primes
ENDPROCEDURE`
        },
        {
          title: "Linked List Cycle Detection",
          problemText: "Write pseudo-code to detect a cycle in a linked list using Floyd’s algorithm.",
          solution: `PROCEDURE HasCycle(head)
  IF head is null THEN RETURN false
  Set slow = head, fast = head
  WHILE fast != null AND fast.next != null
    slow = slow.next
    fast = fast.next.next
    IF slow == fast THEN
      RETURN true   // cycle detected
    ENDIF
  ENDWHILE
  RETURN false
ENDPROCEDURE`
        },
        {
          title: "0/1 Knapsack Decision",
          problemText: "Write pseudo-code for the 0/1 Knapsack problem using dynamic programming.",
          solution: `PROCEDURE Knapsack(values, weights, capacity)
  Set N = length(values)
  Create 2D array dp[N+1][capacity+1]
  FOR i = 0 TO N
    FOR w = 0 TO capacity
      IF i == 0 OR w == 0 THEN
        dp[i][w] = 0
      ELSE IF weights[i-1] <= w THEN
        dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])
      ELSE
        dp[i][w] = dp[i-1][w]
      ENDIF
    ENDFOR
  ENDFOR
  RETURN dp[N][capacity]
ENDPROCEDURE`
        }
      ],
      quiz: {
        questions: [
          {
            questionText: "What is the primary purpose of writing pseudo-code?",
            options: [
              { text: "To optimize code compilation speeds.", isCode: false },
              { text: "To define algorithm logic in a language-agnostic format.", isCode: false },
              { text: "To compile directly on specialized virtual machines.", isCode: false },
              { text: "To replace class files inside jar bundles.", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Pseudo-code describes the step-by-step logic of an algorithm in a language-agnostic format, helping developers plan and review logic before writing code."
          },
          {
            questionText: "What does this pseudo-code return when input is 5?\n\nFUNCTION Calc(n)\n  IF n <= 1 THEN RETURN 1\n  ELSE RETURN n * Calc(n - 2)\nENDFUNCTION",
            options: [
              { text: "120", isCode: false },
              { text: "15", isCode: false },
              { text: "1", isCode: false },
              { text: "Infinite Loop Error", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "The function calculates: 5 * Calc(3) -> 5 * 3 * Calc(1) -> 5 * 3 * 1 = 15. The base case check terminates the recursion when n reaches 1."
          },
          {
            questionText: "Identify the logical error in this search pseudo-code:\n\nFUNCTION Search(arr, target)\n  FOR i = 0 TO arr.length\n    IF arr[i] == target THEN RETURN i\n  ENDFOR\n  RETURN -1\nENDFUNCTION",
            options: [
              { text: "The loop index bounds check causes an off-by-one error at index 'arr.length'.", isCode: false },
              { text: "Variable assignments inside FOR loops are invalid.", isCode: false },
              { text: "The return statement should be inside the IF block only.", isCode: false },
              { text: "There is no default fallback returning 0.", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Since arrays are zero-indexed, the maximum index is 'arr.length - 1'. Looping up to 'arr.length' will cause an index out of bounds error at the final step."
          },
          {
            questionText: "You are planning a user registration check. Which pseudo-code structure is best suited to handle a scenario where input values are optional?",
            options: [
              { text: "A nested DO-WHILE loop", isCode: false },
              { text: "An IF-THEN-ELSE branch check", isCode: false },
              { text: "An exhaustive SWITCH statement", isCode: false },
              { text: "A FOR loop matching indexes", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "An IF-THEN-ELSE block is optimal for conditional checks, allowing you to branch execution based on whether optional input values are present."
          },
          {
            questionText: "What is the worst-case time complexity of this nested pseudo-code block?\n\nFOR i = 1 TO N\n  FOR j = i TO N\n    PRINT i * j\n  ENDFOR\nENDFOR",
            options: [
              { text: "O(N)", isCode: false },
              { text: "O(log N)", isCode: false },
              { text: "O(N^2)", isCode: false },
              { text: "O(N log N)", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "The outer loop runs N times. The inner loop runs N - i + 1 times. The total number of iterations is N + (N-1) + ... + 1 = N*(N+1)/2, which matches O(N^2) complexity."
          }
        ]
      }
    }
  ]
};