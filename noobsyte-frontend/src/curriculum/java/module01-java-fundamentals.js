export default {
  id: 'module01-java-fundamentals',
  title: 'Module 1: Java Fundamentals',
  lessons: [
    {
      id: "java-syntax",
      title: "Language Syntax & Variables",
      slug: "java-syntax",
      description: "Deep dive into Language Syntax & Variables conceptual implementation structures.",
      difficulty: "Beginner",
      estTime: "25 min",
      quizAvailable: true,
      xpReward: 50,
      visualizer: "jvm-memory",
      visualizations: [],
      objectives: [
        "Master the core rules of Language Syntax & Variables",
        "Explain structural mechanisms under the hood"
      ],
      content: `<article class="lesson-content">
  <!-- SECTION 1: HOOK / WHY THIS MATTERS -->
  <div class="theory-hook">
    <div class="hook-badge">⚡ WHY THIS MATTERS</div>
    <h2 class="hook-title">The ₹10,000 Crore Memory Slip: Why Syntax &amp; Variables Dictate Production Success</h2>
    <p class="hook-body">
      When Flipkart runs its Big Billion Days sale, its servers process over 50,000 requests per second. Every single request instantiates variables, allocates stack frames, and dereferences heap pointers. A single wrong variable type declaration—like using a 32-bit signed integer instead of a 64-bit long for transaction IDs—can cause integer overflow, crashing the checkout gateway and costing crores in minutes. Java's strict syntax and strong type system are not constraints; they are the shields guarding high-throughput enterprise systems. Today, you will learn the exact memory layout of Java primitives and references under the JVM hood, enabling you to build highly optimized, crash-proof programs.
    </p>
    <div class="hook-placement-note">
      <span class="placement-icon">🎯</span>
      <span>Asked in technical screening and system design rounds at <strong>Google</strong>, <strong>Amazon</strong>, <strong>Paytm</strong>, and <strong>TCS Digital</strong>.</span>
    </div>
  </div>

  <!-- SECTION 2: CORE CONCEPTS (THEORY DEEP DIVE) -->
  <div class="theory-section">
    <div class="section-badge">📚 CORE THEORY</div>
    <h3 class="section-title">Anatomy of Java's Strongly-Typed System</h3>
    
    <h4 class="concept-heading">1. The Blueprint: Class-Centric Execution &amp; Entry Points</h4>
    <p>
      Unlike procedural languages where code can float freely, Java enforces a strict class-centric execution model. Every executable statement, variable declaration, and helper routine must live inside a class template. When you start a Java application, the JVM Class Loader dynamically loads the target class bytecode into the Metaspace (formerly Method Area) and looks for the standard entry point: <code>public static void main(String[] args)</code>. 
    </p>
    <p>
      Each keyword in this signature has a strict architectural purpose:
      - <code>public</code> exposes the method to the JVM runtime executing outside the package.
      - <code>static</code> permits execution without instantiating an object of the outer class.
      - <code>void</code> ensures no return values are pushed back to the JVM system loader.
      - <code>String[] args</code> captures CLI arguments, loading them into an array reference on the heap.
    </p>

    <h4 class="concept-heading">2. Static vs. Dynamic Typing</h4>
    <p>
      Java is statically and strongly typed. <em>Static typing</em> means that every variable name must be bound to a declared data type at compile time. This type binding cannot be altered during execution. <em>Strong typing</em> guarantees that the compiler prevents operations on incompatible types (e.g., subtracting a String from an integer) without explicit type conversions. This eliminates type safety failures before bytecode reaches the CPU.
    </p>

    <h4 class="concept-heading">3. Primitives vs. References: The Core Memory Bifurcation</h4>
    <p>
      Java splits variables into two categories based on how they hold values in memory:
    </p>
    <div class="concept-types">
      <div class="concept-type-card">
        <h5 class="type-name">Primitive Data Types</h5>
        <p>Primitives store raw values directly in the stack memory locations assigned to their variables. Java defines exactly eight primitive types to ensure cross-platform sizing consistency:</p>
        <ul class="type-list">
          <li><strong>byte (1 byte / 8-bit):</strong> Stores values from -128 to 127. Used for raw binary streams.</li>
          <li><strong>short (2 bytes / 16-bit):</strong> Stores integers from -32,768 to 32,767. Rarely used today.</li>
          <li><strong>int (4 bytes / 32-bit):</strong> Default integer type. Range: -2^31 to 2^31-1 (approx. &plusmn;2.14 billion).</li>
          <li><strong>long (8 bytes / 64-bit):</strong> For large calculations. Suffix with <code>L</code> (e.g., <code>5000000000L</code>).</li>
          <li><strong>float (4 bytes / 32-bit):</strong> Single-precision floating point. Suffix with <code>f</code> (e.g., <code>3.14f</code>).</li>
          <li><strong>double (8 bytes / 64-bit):</strong> Double-precision float. Default type for decimals.</li>
          <li><strong>char (2 bytes / 16-bit):</strong> Stores UTF-16 Unicode characters (e.g., <code>'A'</code>).</li>
          <li><strong>boolean (Size JVM-dependent):</strong> Stores logical values <code>true</code> or <code>false</code>.</li>
        </ul>
      </div>

      <div class="concept-type-card">
        <h5 class="type-name">Reference Data Types</h5>
        <p>Reference variables store 32-bit or 64-bit memory addresses (pointers) pointing to dynamic objects allocated in the Heap workspace. The reference variable itself lives on the Stack, but the actual object payload resides in the Heap. Reference types include User Classes, Interfaces, Arrays, and Strings.</p>
        <ul class="type-list">
          <li><strong>Memory Cost:</strong> Pointers consume 4 bytes on 32-bit JVMs (or 64-bit with Compressed OOPs) and 8 bytes on standard 64-bit JVMs.</li>
          <li><strong>Null State:</strong> Can be set to <code>null</code>, indicating the variable does not point to any heap address.</li>
        </ul>
      </div>
    </div>

    <h4 class="concept-heading">Comparison Matrix: Stack Primitives vs. Heap References</h4>
    <table class="complexity-table" style="margin: 1.5rem 0; width: 100%;">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Primitive Types</th>
          <th>Reference Types</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Storage Location</strong></td>
          <td>Direct Value on Stack</td>
          <td>Address on Stack &rarr; Object on Heap</td>
        </tr>
        <tr>
          <td><strong>Default Values (Class scope)</strong></td>
          <td>Numeric: 0/0.0, Boolean: false, Char: '\\u0000'</td>
          <td>Always <code>null</code></td>
        </tr>
        <tr>
          <td><strong>Memory Size</strong></td>
          <td>Fixed based on type (1 to 8 bytes)</td>
          <td>4 or 8 bytes (pointer size) + Heap object overhead</td>
        </tr>
        <tr>
          <td><strong>Operations</strong></td>
          <td>Manipulated directly via arithmetic/logical operators</td>
          <td>Accessed via dereferencing operator (<code>.</code>)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 3: COLORED SYNTAX CODE BLOCKS -->
  <div class="theory-section">
    <div class="section-badge">💻 CODE LAB</div>
    <h3 class="section-title">Interactive Syntax &amp; Memory Layout Traces</h3>

    <h4 class="concept-heading">Example 1: Primitives Initialization &amp; Stack Allocations</h4>
    <p>This code demonstrates the initialization of all major primitives. Note how variables are allocated on the Stack.</p>
    <div class="code-block-wrapper">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">PrimitiveAllocations.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">PrimitiveAllocations</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">String</span><span style="color:#E6EDF3">[] args) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#484F58; font-style:italic">    // Primitives allocate fixed cells directly on the Stack Frame</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">itemCount = </span><span style="color:#79C0FF">42</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic">// 32-bit signed int, stack value: 42</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">    <span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">price = </span><span style="color:#79C0FF">99.99</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic">// 64-bit IEEE float, stack value: 99.99</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">    <span style="color:#79C0FF">long</span> <span style="color:#E6EDF3">transactionId = </span><span style="color:#79C0FF">9081234567L</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic"> // 64-bit long, suffix 'L' tells compiler not to use int limit</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    <span style="color:#79C0FF">boolean</span> <span style="color:#E6EDF3">isCompleted = </span><span style="color:#FF7B72">true</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic">// logical true</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">    </span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">    <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Count: "</span> <span style="color:#E6EDF3">+ itemCount);</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">    <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Transaction ID: "</span> <span style="color:#E6EDF3">+ transactionId);</span></span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">Count: 42</span>
          <span class="output-text">Transaction ID: 9081234567</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>

    <h4 class="concept-heading">Example 2: Reference Variable Copying vs. Primitive Copying</h4>
    <p>This program highlights reference passing. Copying a reference copy-pastes the memory address, not the heap object payload itself.</p>
    <div class="code-block-wrapper">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">ReferenceCopying.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">PaytmWallet</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">balance;</span> <span style="color:#484F58; font-style:italic">// Heap primitive field</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FFA657">PaytmWallet</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">b) { <span style="color:#FF7B72">this</span>.balance = b; }</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content"></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">ReferenceCopying</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">String</span><span style="color:#E6EDF3">[] args) {</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">x = </span><span style="color:#79C0FF">100</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">y = x;</span> <span style="color:#484F58; font-style:italic"> // Deep value copy. y gets a separate cell with value 100</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">    y = </span><span style="color:#79C0FF">200</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic">  // Does NOT affect x</span></span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">    </span></div>
        <div class="code-line"><span class="ln">12</span><span class="code-content">    <span style="color:#FFA657">PaytmWallet</span> <span style="color:#E6EDF3">w1 = </span><span style="color:#FF7B72">new</span> <span style="color:#FFA657">PaytmWallet</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">500.0</span><span style="color:#E6EDF3">);</span> <span style="color:#484F58; font-style:italic">// w1 gets heap ref, say: 0x9A01</span></span></div>
        <div class="code-line"><span class="ln">13</span><span class="code-content">    <span style="color:#FFA657">PaytmWallet</span> <span style="color:#E6EDF3">w2 = w1;</span> <span style="color:#484F58; font-style:italic">                       // w2 copies ADDRESS 0x9A01. No new heap object is made.</span></span></div>
        <div class="code-line"><span class="ln">14</span><span class="code-content">    w2.balance = </span><span style="color:#79C0FF">1000.0</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic">                    // Altering object via w2 updates shared object state</span></span></div>
        <div class="code-line"><span class="ln">15</span><span class="code-content">    </span></div>
        <div class="code-line"><span class="ln">16</span><span class="code-content">    <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"x: "</span> <span style="color:#E6EDF3">+ x);</span> <span style="color:#484F58; font-style:italic"> // Prints 100 (unaffected)</span></span></div>
        <div class="code-line"><span class="ln">17</span><span class="code-content">    <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"w1 balance: "</span> <span style="color:#E6EDF3">+ w1.balance);</span> <span style="color:#484F58; font-style:italic"> // Prints 1000.0 (affected by w2 pointer change!)</span></span></div>
        <div class="code-line"><span class="ln">18</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">19</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">x: 100</span>
          <span class="output-text">w1 balance: 1000.0</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>

    <h4 class="concept-heading">Example 3: Primitive Narrowing Casting (WRONG vs. CORRECT)</h4>
    <p>This code shows narrowing type conversion. Declaring values outside ranges triggers compiler errors. Explicit casting acts as an acknowledgment check to override compile errors.</p>
    
    <div class="wrong-label">❌ WRONG — Lossy Conversion without Cast:</div>
    <div class="code-block-wrapper wrong-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">UnsafeCasting.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">UnsafeCasting</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">String</span><span style="color:#E6EDF3">[] args) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">pi = </span><span style="color:#79C0FF">3.14159</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">wholePi = pi;</span> <span style="color:#484F58; font-style:italic"> // ❌ Compile-Time Error: incompatible types: possible lossy conversion from double to int</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
    </div>

    <div class="right-label">✅ CORRECT — Explicit Casting Suffix:</div>
    <div class="code-block-wrapper correct-code">
      <div class="code-header">
        <div class="code-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-lang-badge">Java</span>
        <span class="code-filename">SafeCasting.java</span>
      </div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">SafeCasting</span> <span style="color:#E6EDF3">{</span></span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span><span style="color:#E6EDF3">(</span><span style="color:#79C0FF">String</span><span style="color:#E6EDF3">[] args) {</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">    <span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">pi = </span><span style="color:#79C0FF">3.14159</span><span style="color:#E6EDF3">;</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">    <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">wholePi = (</span><span style="color:#79C0FF">int</span><span style="color:#E6EDF3">) pi;</span> <span style="color:#484F58; font-style:italic"> // Explicit cast truncates fraction. Time: O(1) | Space: O(1)</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">    <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Truncated value: "</span> <span style="color:#E6EDF3">+ wholePi);</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">  <span style="color:#E6EDF3">}</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
      </div>
      <div class="code-output">
        <div class="output-label">▶ OUTPUT</div>
        <div class="output-body">
          <span class="output-text">Truncated value: 3</span>
          <span class="output-cursor">█</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 4: STEP-BY-STEP DRY RUN -->
  <div class="dryrun-section">
    <div class="section-badge">🔍 STEP-BY-STEP TRACE</div>
    <h3 class="section-title">Tracing Memory Mapping on Variable Declarations</h3>
    <p class="dryrun-intro">
      Let's trace how the JVM organizes the Stack Frame of the <code>main</code> thread and the JVM Heap space when executing these three lines of code:
    </p>
    <div class="code-block-wrapper" style="margin: 10px 0;">
      <pre style="margin: 0; padding: 12px; color: #E6EDF3; font-family: monospace;">
int speed = 80;
String city = new String("Delhi");
String copyCity = city;</pre>
    </div>

    <div class="dryrun-container">
      <div class="dryrun-step">
        <div class="step-circle">1</div>
        <div class="step-body">
          <div class="step-code">int speed = 80;</div>
          <p class="step-explain">
            The JVM allocates a 32-bit slot in the Local Variable Array of the active Stack Frame. The raw value <code>80</code> is written directly into this slot.
          </p>
          <div class="step-state">
            <span class="state-var">Stack: [speed: 80]</span>
            <span class="state-var">Heap: [empty]</span>
            <span class="state-result">Direct value assignment on Stack</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step">
        <div class="step-circle">2</div>
        <div class="step-body">
          <div class="step-code">String city = new String("Delhi");</div>
          <p class="step-explain">
            The <code>new</code> operator instantiates a new <code>String</code> object in the Heap space at address <code>0x9C04</code> containing "Delhi". The address <code>0x9C04</code> is assigned to the Stack variable reference named <code>city</code>.
          </p>
          <div class="step-state">
            <span class="state-var">Stack: [speed: 80, city: 0x9C04]</span>
            <span class="state-var">Heap: [0x9C04 -> "Delhi"]</span>
            <span class="state-result">Pointer link established from Stack to Heap</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step">
        <div class="step-circle">3</div>
        <div class="step-body">
          <div class="step-code">String copyCity = city;</div>
          <p class="step-explain">
            The reference address <code>0x9C04</code> stored in <code>city</code> is copied into a new Stack slot named <code>copyCity</code>. Now, both variables point to the same String object on the Heap. No new object is allocated.
          </p>
          <div class="step-state">
            <span class="state-var">Stack: [speed: 80, city: 0x9C04, copyCity: 0x9C04]</span>
            <span class="state-var">Heap: [0x9C04 -> "Delhi"]</span>
            <span class="state-result">Single Heap object shared by two reference variables</span>
          </div>
        </div>
      </div>

      <div class="dryrun-step" style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px; margin-top: 15px;">
        <h5 style="margin: 0 0 8px 0; color: #FFA657;">ASCII Memory Visual Mapping</h5>
        <span style="font-family: monospace; display: block; white-space: pre; color: #E6EDF3; line-height: 1.4;">
STACK FRAME (main)                     JVM HEAP
┌───────────────────────┐             ┌───────────────────┐
│ speed = 80            │             │                   │
│ city = 0x9C04  ───────┼────────────&gt;│ 0x9C04: "Delhi"   │
│ copyCity = 0x9C04 ────┼────────────&gt;│                   │
└───────────────────────┘             └───────────────────┘
        </span>
      </div>

      <div class="dryrun-result">
        <span class="result-icon">✅</span>
        <span>Trace completed. Reassigning copyCity to a new value does not alter the "Delhi" String object itself, demonstrating Java's reference containment rules.</span>
      </div>
    </div>
  </div>

  <!-- SECTION 5: COMPLEXITY ANALYSIS TABLE -->
  <div class="complexity-section">
    <div class="section-badge">⚡ COMPLEXITY ANALYSIS</div>
    <h3 class="section-title">Stack vs. Heap Memory Access Performance</h3>
    <p class="complexity-intro">
      Understanding the performance trade-offs of primitives (allocated on Stack) vs references (instantiated on Heap) is critical for optimal system design. Stack access is practically instantaneous because it follows a linear LIFO order managed directly by the CPU pointer registers. Heap access involves dereferencing addresses and incurs cache-miss penalties.
    </p>

    <table class="complexity-table">
      <thead>
        <tr>
          <th>Operation</th>
          <th>Stack Allocation (Primitives)</th>
          <th>Heap Allocation (Objects)</th>
          <th>Variable Read/Access</th>
          <th>Garbage Collection Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Complexity</td>
          <td><span class="complexity-good">O(1)</span></td>
          <td><span class="complexity-ok">O(1) average</span></td>
          <td><span class="complexity-good">O(1)</span></td>
          <td><span class="complexity-good">O(0) None</span></td>
        </tr>
        <tr>
          <td>Mechanism</td>
          <td>Pointer adjustment</td>
          <td>Dynamic allocation search</td>
          <td>Direct vs Dereference</td>
          <td>Stack frame pop vs GC sweeps</td>
        </tr>
      </tbody>
    </table>

    <div class="complexity-intuition">
      <h4>Why Object Instantiation is Slower</h4>
      <p>
        Creating a primitive variable on the stack is a simple <code>O(1)</code> instruction that slides the stack pointer register. Instantiating a Heap object requires locating a contiguous memory block via the JVM allocator, building object headers, and writing field values, followed by garbage collection overhead when the pointer leaves the scope.
      </p>

      <div class="complexity-comparison">
        <div class="comp-row">
          <span class="comp-n">Allocating 1M Primitives (int)</span>
          <span class="comp-log good-complexity">Stack: ~1ms (O(1) direct slide)</span>
        </div>
        <div class="comp-row">
          <span class="comp-n">Allocating 1M Objects (Integer)</span>
          <span class="comp-linear bad-complexity">Heap: ~45ms (O(1) allocation + GC checks)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 6: COMMON MISTAKES -->
  <div class="mistakes-section">
    <div class="section-badge">🚫 COMMON MISTAKES</div>
    <h3 class="section-title">Compile &amp; Runtime Pitfalls in Java Variables</h3>

    <!-- Mistake 1 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #1: Using Uninitialized Local Variables</h4>
      </div>
      <p class="mistake-scenario">
        Unlike class-level fields, local variables inside methods are NOT assigned default values by the JVM. Accessing them before initialization fails compilation.
      </p>
      
      <div class="wrong-label">❌ WRONG — Fails to Compile:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">count;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(count);</span> <span style="color:#484F58; font-style:italic"> // ❌ Compilation Error: variable count might not have been initialized</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT — Define Default Value First:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">count = </span><span style="color:#79C0FF">0</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(count);</span> <span style="color:#484F58; font-style:italic"> // ✅ Compiles fine</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Java eliminates random garbage value reads from unallocated stack cells to prevent security leaks, forcing compile-time errors.
      </div>
    </div>

    <!-- Mistake 2 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #2: Declaring Floats without 'f' Suffix</h4>
      </div>
      <p class="mistake-scenario">
        Decimals default to double precision (64-bit). Assigning double to float causes compilation failures due to narrowing.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">float</span> <span style="color:#E6EDF3">rate = </span><span style="color:#79C0FF">5.75</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic"> // ❌ Error: possible loss of precision</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">float</span> <span style="color:#E6EDF3">rate = </span><span style="color:#79C0FF">5.75f</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic"> // ✅ Suffix 'f' signals 32-bit precision float constant</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Helps you avoid unintentional compiler truncations.
      </div>
    </div>

    <!-- Mistake 3 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #3: Integer Overflow Silent Errors</h4>
      </div>
      <p class="mistake-scenario">
        Exceeding <code>int</code> limits does not trigger compiler errors or throw runtime exceptions; it silently rolls over into a negative value.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">max = </span><span style="color:#79C0FF">2147483647</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">overflowed = max + </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic"> // ❌ Overflow rolls over to -2147483648</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">long</span> <span style="color:#E6EDF3">max = </span><span style="color:#79C0FF">2147483647L</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">long</span> <span style="color:#E6EDF3">safeValue = max + </span><span style="color:#79C0FF">1</span><span style="color:#E6EDF3">;</span> <span style="color:#484F58; font-style:italic"> // ✅ Safely fits in 64-bit allocation range</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Silent overflows lead to logic bugs in loops, indices, and financial math that are difficult to debug.
      </div>
    </div>

    <!-- Mistake 4 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #4: Floating Point Precision Checks in Conditionals</h4>
      </div>
      <p class="mistake-scenario">
        Floating-point math has precision limits. Comparing them directly using <code>==</code> can fail due to tiny rounding discrepancies.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">diff = </span><span style="color:#79C0FF">1.0</span> <span style="color:#E6EDF3">- </span><span style="color:#79C0FF">0.9</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(diff == </span><span style="color:#79C0FF">0.1</span><span style="color:#E6EDF3">) {</span> <span style="color:#484F58; font-style:italic"> // ❌ May evaluate to false (diff is actually 0.09999999999999998)</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Equal"</span><span style="color:#E6EDF3">);</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">diff = </span><span style="color:#79C0FF">1.0</span> <span style="color:#E6EDF3">- </span><span style="color:#79C0FF">0.9</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">epsilon = </span><span style="color:#79C0FF">0.000001</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(</span><span style="color:#79C0FF">Math</span><span style="color:#E6EDF3">.</span><span style="color:#D2A8FF">abs</span><span style="color:#E6EDF3">(diff - </span><span style="color:#79C0FF">0.1</span><span style="color:#E6EDF3">) &lt; epsilon) {</span> <span style="color:#484F58; font-style:italic"> // ✅ Checks difference against tiny delta tolerance</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#79C0FF">System</span><span style="color:#E6EDF3">.out.</span><span style="color:#D2A8FF">println</span><span style="color:#E6EDF3">(</span><span style="color:#A5D6FF">"Equal"</span><span style="color:#E6EDF3">);</span></span></div>
          <div class="code-line"><span class="ln">5</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Imprecise floating point evaluations can lead to logical errors in systems checks.
      </div>
    </div>

    <!-- Mistake 5 -->
    <div class="mistake-card">
      <div class="mistake-header">
        <span class="mistake-icon">❌</span>
        <h4 class="mistake-title">Mistake #5: Dereferencing Unassigned Objects (NullPointer)</h4>
      </div>
      <p class="mistake-scenario">
        Declaring a reference variable allocates a stack slot with value <code>null</code>. Attempting to call methods on it throws a <code>NullPointerException</code> at runtime.
      </p>
      
      <div class="wrong-label">❌ WRONG:</div>
      <div class="code-block-wrapper wrong-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">String</span> <span style="color:#E6EDF3">name;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#484F58; font-style:italic">// ... name is never instantiated</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">len = name.</span><span style="color:#D2A8FF">length</span><span style="color:#E6EDF3">();</span> <span style="color:#484F58; font-style:italic"> // ❌ Throws NullPointerException at runtime</span></span></div>
        </div>
      </div>
      
      <div class="right-label">✅ CORRECT:</div>
      <div class="code-block-wrapper correct-code">
        <div class="code-body">
          <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#79C0FF">String</span> <span style="color:#E6EDF3">name = </span><span style="color:#A5D6FF">"Arjun"</span><span style="color:#E6EDF3">;</span></span></div>
          <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">if</span> <span style="color:#E6EDF3">(name != </span><span style="color:#79C0FF">null</span><span style="color:#E6EDF3">) {</span></span></div>
          <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#79C0FF">int</span> <span style="color:#E6EDF3">len = name.</span><span style="color:#D2A8FF">length</span><span style="color:#E6EDF3">();</span> <span style="color:#484F58; font-style:italic"> // ✅ Safe dereference check</span></span></div>
          <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#E6EDF3">}</span></span></div>
        </div>
      </div>
      
      <div class="mistake-why">
        <strong>Why this matters:</strong> Null pointer crashes are a common source of production runtime bugs in Java apps.
      </div>
    </div>
  </div>

  <!-- SECTION 7: INTERVIEW PREPARATION -->
  <div class="interview-section">
    <div class="section-badge">🎯 INTERVIEW PREP</div>
    <h3 class="section-title">Java Variables Placement Questions</h3>

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
        <span class="qa-text">Why does Java not support free-floating global variables like C++?</span>
        <div class="qa-companies">
          <span class="mini-tag">TCS</span>
          <span class="mini-tag">Infosys</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Java enforces a class-centric model to protect the namespace and ensure object encapsulation. Free-floating variables can lead to naming collisions across libraries and encourage global state corruption. By forcing all variables to be class fields or local variables, Java prevents uncontrolled mutations, supports structured garbage collection, and makes code modular.
        </p>
        <div class="answer-key-point">
          💡 Key point: Java eliminates global variables to prevent scope collisions and maintain OOP encapsulation.
        </div>
      </div>
    </div>

    <!-- Q2 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q2</span>
        <span class="qa-text">Explain stack frame memory allocation differences for primitives versus reference values.</span>
        <div class="qa-companies">
          <span class="mini-tag">Amazon</span>
          <span class="mini-tag">Flipkart</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          For primitives (e.g., <code>int</code>, <code>double</code>), the actual raw data is written directly to the stack frame of the executing thread. For reference variables, the stack frame only stores the 32-bit or 64-bit memory address pointer of the target object. The actual object is dynamically allocated in the shared JVM Heap.
        </p>
        <div class="answer-key-point">
          💡 Key point: Stack stores raw values for primitives, but only references (heap addresses) for objects.
        </div>
      </div>
    </div>

    <!-- Q3 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q3</span>
        <span class="qa-text">What is the difference between widening and narrowing conversions in Java primitives, and what are their runtime safety profiles?</span>
        <div class="qa-companies">
          <span class="mini-tag">Google</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Widening (implicit casting) converts a smaller primitive to a larger type (e.g., <code>int</code> to <code>double</code>) and is safe from data loss, so the compiler performs it automatically. Narrowing (explicit casting) converts a larger primitive to a smaller type (e.g., <code>double</code> to <code>int</code>) and can result in truncation or data loss. Narrowing requires explicit syntax overrides (e.g., <code>(int) myDouble</code>) to compile.
        </p>
        <div class="answer-key-point">
          💡 Key point: Widening is implicit and safe; narrowing is explicit and can lead to precision loss.
        </div>
      </div>
    </div>

    <!-- Q4 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q4</span>
        <span class="qa-text">Does declaring a reference variable as final make the referenced Heap object immutable?</span>
        <div class="qa-companies">
          <span class="mini-tag">Amazon</span>
          <span class="mini-tag">Google</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          No. Marking a reference variable as <code>final</code> only prevents reassignment of the reference variable to a new heap address. The fields inside the object it points to can still be modified. To make the object itself immutable, the class definition must mark all internal fields as private and final, and omit mutator methods (setters).
        </p>
        <div class="answer-key-point">
          💡 Key point: Final prevents reference pointer reassignment, but does not freeze object fields.
        </div>
      </div>
    </div>

    <!-- Q5 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q5</span>
        <span class="qa-text">Why does Java reject the assignment of a double constant value directly to a float type?</span>
        <div class="qa-companies">
          <span class="mini-tag">TCS</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          Java treats all decimal literals (e.g., <code>5.75</code>) as 64-bit double precision values by default. Assigning a double to a 32-bit float requires narrowing, which can lead to precision loss. The compiler flags this as an error unless you add the <code>f</code> suffix (e.g., <code>5.75f</code>) or perform an explicit cast.
        </p>
        <div class="answer-key-point">
          💡 Key point: Decimal literals are treated as double by default, requiring the 'f' suffix for floats.
        </div>
      </div>
    </div>

    <!-- Q6 -->
    <div class="qa-item">
      <div class="qa-question">
        <span class="qa-number">Q6</span>
        <span class="qa-text">What is the memory size of a reference variable in a 64-bit Java Virtual Machine?</span>
        <div class="qa-companies">
          <span class="mini-tag">Google</span>
          <span class="mini-tag">Flipkart</span>
        </div>
      </div>
      <div class="qa-answer">
        <p>
          On a standard 64-bit JVM, reference variables consume 8 bytes (64 bits). However, most modern JVMs use a feature called Compressed OOPs (Ordinary Object Pointers), which optimizes pointers to 4 bytes (32 bits) when the Heap size is under 32GB.
        </p>
        <div class="answer-key-point">
          💡 Key point: Reference size is 8 bytes, but is optimized to 4 bytes via Compressed OOPs on typical heaps.
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 8: PRACTICE PROBLEMS -->
  <div class="practice-section">
    <div class="section-badge">💪 PRACTICE PROBLEMS</div>
    <h3 class="section-title">Variables &amp; Syntax Coding Exercises</h3>

    <!-- Problem 1 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">01</span>
        <span class="difficulty-easy">Easy</span>
        <span class="platform-tag">Placement Lab #1</span>
      </div>
      <h4 class="problem-title">Primitive Reference Swapper</h4>
      <p class="problem-desc">
        Write a Java program that attempts to swap the values of two integers and two object coordinates, tracing how values change on the Stack vs Heap.
      </p>
      <div class="problem-connection">
        <strong>Connection to this lesson:</strong> Tests your understanding of pass-by-value and reference copying rules.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Remember that Java copies stack value frames on method invocations. Swapping references inside a helper method will not swap them in the main method.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(1) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 2 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">02</span>
        <span class="difficulty-easy">Easy</span>
        <span class="platform-tag">Placement Lab #2</span>
      </div>
      <h4 class="problem-title">Range Boundary Checker</h4>
      <p class="problem-desc">
        Write a utility program that accepts a string input, parses it, and determines the smallest primitive data type (byte, short, int, long) that can store it.
      </p>
      <div class="problem-connection">
        <strong>Connection to this lesson:</strong> Validates primitive type sizes and overflow boundary limits.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Compare the parsed value to the wrapper constants (e.g. <code>Byte.MIN_VALUE</code> and <code>Byte.MAX_VALUE</code>) in order of size.
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
        <span class="platform-tag">LeetCode #7</span>
      </div>
      <h4 class="problem-title">Reverse Integer (With Overflow Checks)</h4>
      <p class="problem-desc">
        Given a signed 32-bit integer, reverse its digits. If reversing the integer causes it to overflow the 32-bit signed integer range, return 0.
      </p>
      <div class="problem-connection">
        <strong>Connection to this lesson:</strong> Teaches overflow identification in integer calculations.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Before multiplying your running sum by 10, check if it exceeds <code>Integer.MAX_VALUE / 10</code>.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(log N) time</span> | <span class="complexity-good">O(1) space</span>
      </div>
    </div>

    <!-- Problem 4 -->
    <div class="problem-card">
      <div class="problem-header">
        <span class="problem-number">04</span>
        <span class="difficulty-medium">Medium</span>
        <span class="platform-tag">Placement Lab #3</span>
      </div>
      <h4 class="problem-title">Precision Calculator</h4>
      <p class="problem-desc">
        Build a simple calculator that performs arithmetic on decimals. Highlight the precision differences between float, double, and <code>BigDecimal</code>.
      </p>
      <div class="problem-connection">
        <strong>Connection to this lesson:</strong> Demonstrates precision trade-offs in floating-point representations.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Perform a division sequence (like 1/3) and compare float, double, and <code>BigDecimal</code> values.
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
        <span class="platform-tag">LeetCode #8</span>
      </div>
      <h4 class="problem-title">String to Integer (atoi)</h4>
      <p class="problem-desc">
        Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer, handling leading whitespaces, signs, and overflow boundaries.
      </p>
      <div class="problem-connection">
        <strong>Connection to this lesson:</strong> Demonstrates parsing boundaries, casting, and type limits.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Traverse the string character by character. Skip spaces, handle '+' or '-', and perform checks for overflows at each step.
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
        <span class="platform-tag">Placement Lab #4</span>
      </div>
      <h4 class="problem-title">Memory Footprint Simulator</h4>
      <p class="problem-desc">
        Write a simulator that parses class fields to compute its memory footprints on 64-bit systems with and without Compressed OOPs.
      </p>
      <div class="problem-connection">
        <strong>Connection to this lesson:</strong> Explores JVM padding rules and object alignment calculations.
      </div>
      <div class="problem-hint">
        <span class="hint-toggle">💡 Show Hint</span>
        <p class="hint-text" style="display:none">
          Add field sizes (using primitive byte costs and pointer sizes), include the 12-byte or 16-byte object header, and round up to the nearest multiple of 8 bytes.
        </p>
      </div>
      <div class="problem-complexity">
        Expected: <span class="complexity-good">O(1) time</span> | <span class="complexity-good">O(1) space</span>
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
        <span>Java enforces class containment; free-standing variables do not exist.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Statically typed variables are bound to their declared types at compile time.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Primitives store values directly in stack memory locations.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Reference variables store memory addresses (pointers) pointing to dynamic objects on the Heap.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Decimals default to double precision; floats require the 'f' suffix to prevent narrowing compile errors.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Assigning reference variables copies the memory address pointer, sharing the target Heap object.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Integer overflows roll over into negative ranges silently without throwing runtime exceptions.</span>
      </li>
      <li class="summary-item">
        <span class="check-icon">✓</span>
        <span>Stack memory allocation adjusting pointer registers is faster than dynamic Heap allocation.</span>
      </li>
    </ul>
    
    <div class="interview-takeaways">
      <h4>🎯 Say This in Your Interview:</h4>
      <div class="quote-block">
        "Java splits variables into stack primitives and heap reference pointers. Copying a primitive copies its actual value, whereas copying a reference variable copies the target object's memory address pointer. This is why mutations via reference copies alter the shared Heap state."
      </div>
    </div>
    
    <div class="next-lesson-card">
      <span class="next-label">Up Next &rarr;</span>
      <span class="next-title">Control Structures &amp; Conditionals</span>
      <span class="next-desc">
        Learn how Java guides execution flow using branch evaluations, switch expressions, and loop constructs.
      </span>
    </div>
  </div>

  <h2>Real-Life Analogy</h2>
  <div class="analogy-intro">
    <h2 class="analogy-main-title">Understanding Variables Through Real Life</h2>
    <p class="analogy-subtitle">
      Before writing code, let's understand how variables work in memory using intuitive, real-world analogies.
    </p>
  </div>

  <!-- ANALOGY 1 -->
  <div class="analogy-card analogy-primary">
    <div class="analogy-number">Analogy 1</div>
    <div class="analogy-icon">🏪</div>
    <h3 class="analogy-title">The Kirana Store: Primitives vs. References</h3>
    
    <div class="analogy-story">
      <p>
        Imagine walking into a local kirana store in Delhi. Behind the counter, the owner has a row of small spice boxes containing turmeric, salt, and red pepper. Each box stores its contents directly. If you want salt, the owner reaches into the salt jar and pulls it out. This is exactly how Java <strong>primitives</strong> work in memory. The variable name is the jar label, and the stack allocation is the physical container holding the spice.
      </p>
      <p>
        Now, imagine you ask the shopkeeper for a large bag of Basmati rice. The shopkeeper doesn't keep 50 kg bags behind the counter. Instead, he reaches into a drawer, pulls out a paper slip, and writes: <em>"Aisle 3, Shelf B"</em>. He hands you this address slip. The actual rice bag is stored in a warehouse (the JVM Heap). The slip of paper is your <strong>reference variable</strong>.
      </p>
      <p>
        If you copy the paper slip and hand it to your friend, you now have two slips pointing to the same warehouse location. If your friend goes to Aisle 3 and takes 5 kg of rice, the contents of the bag change for both of you. The bag itself is not duplicated—only the reference slip was copied.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Spice Jar</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Primitive Variable (Stack)</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Spice inside Jar</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Primitive Value</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Address Slip</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Reference Variable</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Rice Bag in Warehouse</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Object in Heap</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Primitives store actual data values, while references store pointers to where the actual data resides.</p>
    </div>
  </div>

  <!-- ANALOGY 2 -->
  <div class="analogy-card analogy-secondary">
    <div class="analogy-number">Analogy 2</div>
    <div class="analogy-icon">🚂</div>
    <h3 class="analogy-title">The IRCTC Seat Allocation System</h3>
    
    <div class="analogy-story">
      <p>
        Consider booking a train ticket on the Indian Railways (IRCTC) website. When your reservation is confirmed, the system allocates you a seat number, for example, <em>Coach B1, Seat 42</em>. 
      </p>
      <p>
        The coach B1 seat 42 is a fixed spot on the physical train (equivalent to a cell inside the Heap). Your printed ticket is a reference variable containing the address "B1-42". The ticket is small enough to fit in your wallet (Stack), but it points to the physical seat location on the train (Heap).
      </p>
      <p>
        If two passengers print copies of the same ticket, both tickets point to the exact same physical seat. If someone leaves a water bottle on seat B1-42, the occupant using the copy ticket will see the bottle, illustrating how objects are shared across references in memory.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Printed Ticket</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Reference Variable</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Seat Number "B1-42"</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Memory Reference Address</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Physical Berth on Train</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Object in Heap Space</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Items left on Berth</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Object Properties/State</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Multiple references can point to the same Heap object, sharing its state changes.</p>
    </div>
  </div>

  <!-- ANALOGY 3 -->
  <div class="analogy-card analogy-tertiary">
    <div class="analogy-number">Analogy 3</div>
    <div class="analogy-icon">💳</div>
    <h3 class="analogy-title">Why a Reference is NOT the object (Aadhaar Card Misconception)</h3>
    
    <div class="analogy-story">
      <p>
        A common mistake is thinking that reference variables are the objects themselves. Let's look at your Aadhaar card to clarify this difference.
      </p>
      <p>
        Your Aadhaar card contains a unique 12-digit identification number. This card is not you. It is a reference card containing a unique code pointing to your physical body in the real world.
      </p>
      <p>
        If you make photocopies of your Aadhaar card, you do not duplicate your physical body. If you write your name on the back of the card, you only change the card itself. Your physical body remains unchanged. Similarly, setting a reference variable to <code>null</code> only deletes the reference pointer (Aadhaar card); it does not destroy the Heap object (your body) until the garbage collector cleans it up.
      </p>
    </div>
    
    <div class="analogy-mapping">
      <h4 class="mapping-title">🔗 How This Maps to Code:</h4>
      <div class="mapping-table">
        <div class="mapping-row">
          <span class="real-world">Aadhaar Card</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Reference Variable</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">12-digit Aadhaar Number</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Hex Memory Address Pointer</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Your Physical Body</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Object in Heap</span>
        </div>
        <div class="mapping-row">
          <span class="real-world">Losing Aadhaar Card</span>
          <span class="mapping-arrow">&rarr;</span>
          <span class="code-world">Setting Reference to null</span>
        </div>
      </div>
    </div>
    
    <div class="analogy-insight">
      <span class="insight-icon">💡</span>
      <p><strong>The Key Insight:</strong> Deleting a reference variable does not delete the object it points to; it only breaks the connection pointer.</p>
    </div>
  </div>

  <!-- BEFORE vs AFTER UNDERSTANDING -->
  <div class="analogy-before-after">
    <h3>Before &amp; After Learning This</h3>
    <div class="ba-grid">
      <div class="ba-before">
        <h4>😕 Before (What you thought)</h4>
        <p>You thought variables store objects directly, and copying variables copies the target objects.</p>
      </div>
      <div class="ba-after">
        <h4>😊 After (What you now know)</h4>
        <p>You know variables only store reference addresses. Copying reference variables copies pointers, sharing the same target object.</p>
      </div>
    </div>
  </div>

  <!-- VISUAL MEMORY AID -->
  <div class="memory-aid">
    <h3>Remember It Forever: The One-Line Mental Model</h3>
    <div class="memory-card">
      <p class="memory-quote">
        "Primitives hold raw data on the Stack; references store addresses pointing to the Heap."
      </p>
    </div>
  </div>
</article>`,
      theory: `<h3>Core Theory: Java Syntax & Variables</h3>
<p>Java is a statically-typed language where every variable must be declared with a type. Variables are divided into primitives (store values directly on the stack) and references (store heap addresses). Understanding memory allocation is crucial for writing efficient, bug-free code.</p>`,
      analogy: "Think of primitives like spice jars on the counter (stack) that hold the spice directly. References are like address slips pointing to a warehouse (heap) where the actual item is stored. Copying a slip gives you another pointer to the same item.",
      interviewNotes: "Key interview points: pass-by-value semantics, stack vs heap, widening/narrowing conversions, final references vs immutability, and default initialization rules.",
      commonMistakes: "Uninitialized local variables, forgetting 'f' suffix for floats, integer overflow, floating-point comparison with ==, and NullPointerException from unassigned references.",
      practiceProblems: [
        {
          title: "Primitive Reference Swapper",
          problemText: "Write a Java method that attempts to swap two integers using a helper method. Demonstrate why the original values don't change after the swap call. Also implement a method that swaps the coordinates of two Point objects, showing how object mutation works.",
          solution: `public class Swapper {
    public static void swapPrimitives(int a, int b) {
        int temp = a;
        a = b;
        b = temp;
    }
    
    public static void swapPoints(Point p1, Point p2) {
        Point temp = new Point(p1.x, p1.y);
        p1.x = p2.x;
        p1.y = p2.y;
        p2.x = temp.x;
        p2.y = temp.y;
    }
    
    public static void main(String[] args) {
        int x = 5, y = 10;
        swapPrimitives(x, y);
        System.out.println(x + " " + y); // 5 10 (no change)
        
        Point a = new Point(1, 2);
        Point b = new Point(3, 4);
        swapPoints(a, b);
        System.out.println(a.x + "," + a.y); // 3,4 (swapped)
    }
}`
        },
        {
          title: "Range Boundary Checker",
          problemText: "Given a string input representing a number, determine which Java primitive type (byte, short, int, long) can hold this value without overflow. If the number is too large even for long, return 'OUT OF RANGE'.",
          solution: `public class RangeChecker {
    public static String getPrimitiveType(String numStr) {
        try {
            long val = Long.parseLong(numStr);
            if (val >= Byte.MIN_VALUE && val <= Byte.MAX_VALUE) return "byte";
            if (val >= Short.MIN_VALUE && val <= Short.MAX_VALUE) return "short";
            if (val >= Integer.MIN_VALUE && val <= Integer.MAX_VALUE) return "int";
            return "long";
        } catch (NumberFormatException e) {
            return "OUT OF RANGE";
        }
    }
}`
        },
        {
          title: "Reverse Integer (with Overflow)",
          problemText: "Given a 32-bit signed integer, return the reversed integer. If reversing causes overflow outside the 32-bit range, return 0.",
          solution: `public class ReverseInteger {
    public int reverse(int x) {
        long reversed = 0;
        while (x != 0) {
            reversed = reversed * 10 + x % 10;
            x /= 10;
        }
        if (reversed > Integer.MAX_VALUE || reversed < Integer.MIN_VALUE) return 0;
        return (int) reversed;
    }
}`
        }
      ],
      quiz: {
        questions: [
          {
            questionText: "Which of the following is a valid way to declare a float variable with value 3.14?",
            options: [
              { text: "float f = 3.14;", isCode: true },
              { text: "float f = 3.14f;", isCode: true },
              { text: "float f = (float) 3.14;", isCode: true },
              { text: "Both B and C", isCode: false }
            ],
            correctAnswerIndex: 3,
            explanation: "Java treats decimal literals as double by default. You must either suffix with 'f' (3.14f) or cast explicitly to float ((float) 3.14). Options B and C are both correct."
          },
          {
            questionText: "What is the output of this code?\n\nint a = 10;\nint b = a;\nb = 20;\nSystem.out.println(a);",
            options: [
              { text: "10", isCode: false },
              { text: "20", isCode: false },
              { text: "Compilation error", isCode: false },
              { text: "0", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Primitives store actual values. When b = a, a copy of 10 is assigned to b. Changing b to 20 does not affect a, which remains 10."
          },
          {
            questionText: "In Java, what does a reference variable store?",
            options: [
              { text: "The actual object data", isCode: false },
              { text: "A copy of the object", isCode: false },
              { text: "A memory address pointing to the object on the heap", isCode: false },
              { text: "The class definition", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "Reference variables store the heap memory address where the object is located, not the object itself."
          },
          {
            questionText: "What happens when you try to use an uninitialized local variable in Java?",
            options: [
              { text: "It gets a default value of 0 or null", isCode: false },
              { text: "Compilation error", isCode: false },
              { text: "Runtime NullPointerException", isCode: false },
              { text: "The program runs with a random value", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Local variables are not assigned default values. The compiler will report an error if you attempt to use them without explicit initialization."
          },
          {
            questionText: "Which statement is true about the 'final' keyword applied to a reference variable?",
            options: [
              { text: "It makes the referenced object immutable", isCode: false },
              { text: "It prevents reassignment of the variable to a different object", isCode: false },
              { text: "It makes all fields of the object final", isCode: false },
              { text: "It prevents the object from being garbage collected", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "final on a reference variable means you cannot change the reference to point to another object. However, you can still modify the object's internal state unless the class itself is immutable."
          }
        ]
      }
    }
  ]
};