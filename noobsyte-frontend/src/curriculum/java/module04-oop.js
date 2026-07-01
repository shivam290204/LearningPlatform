export default {
  id: 'module04-oop',
  title: 'Module 4: Object-Oriented Programming',
  lessons: [
    {
      id: "oop-comprehensive",
      title: "Complete OOP Guide: Principles, Patterns & Practices",
      slug: "oop-comprehensive",
      description: "Master all Object-Oriented Programming concepts from classes and objects to SOLID principles and design patterns.",
      difficulty: "Intermediate",
      estTime: "45 min",
      quizAvailable: true,
      xpReward: 100,
      visualizer: null,
      visualizations: [],
      objectives: [
        "Understand core OOP pillars: Encapsulation, Abstraction, Inheritance, Polymorphism",
        "Apply class relationships and access modifiers in real-world design",
        "Design with SOLID principles and avoid common anti-patterns",
        "Recognise advanced concepts like immutability, composition over inheritance, and design patterns"
      ],
      content: `<article class="lesson-content">
  <!-- HOOK -->
  <div class="theory-hook" style="background:#1a1a2e; padding:1.5rem; border-radius:8px; margin-bottom:2rem;">
    <div class="hook-badge" style="color:#FFA657;">[ WHY THIS MATTERS ]</div>
    <h2>From Chaos to Clean Architecture: How OOP Shapes Billion-Dollar Systems</h2>
    <p>
      Every Uber ride, every Amazon order, every Netflix stream is powered by a vast web of objects communicating through well-defined contracts. A single misused inheritance chain or a fragile mutable state can bring down entire services. Object-Oriented Programming is not just about syntax — it is a philosophy for building maintainable, scalable software. In this module, you will learn every major OOP concept, from the simplest class to the most nuanced design principle, with real Java code and practical reasoning.
    </p>
    <p style="color:#79C0FF;">Tested in technical interviews at Google, Amazon, Microsoft, and every enterprise Java shop.</p>
  </div>

  <!-- THEORY DEEP DIVE -->
  <div class="theory-section" style="margin-bottom:2rem;">
    <div class="section-badge">[ CORE THEORY ]</div>
    <h3>The Building Blocks of Object-Oriented Programming</h3>

    <h4>1. Classes and Objects</h4>
    <p>A <strong>class</strong> is a blueprint that defines properties (fields) and behaviours (methods). An <strong>object</strong> is an instance of a class, created using the <code>new</code> keyword. Each object occupies its own memory on the heap, with its own copies of instance variables, while methods are shared.</p>

    <h4>2. Encapsulation and Data Hiding</h4>
    <p>Encapsulation bundles data and the methods that operate on that data into a single unit. Data hiding is achieved by marking fields as <code>private</code> and exposing them through public getters and setters. This protects the internal state from unintended modifications and enforces invariants.</p>

    <h4>3. Abstraction</h4>
    <p>Abstraction hides implementation complexity. In Java, <strong>abstract classes</strong> may contain both abstract (unimplemented) and concrete methods. <strong>Interfaces</strong> define a contract of behaviour with only abstract methods (until Java 8 introduced default/static methods). A class can implement multiple interfaces, enabling a form of multiple inheritance of type.</p>

    <h4>4. Inheritance</h4>
    <p>Inheritance allows a class to derive properties and methods from a parent class, promoting code reuse. Java supports:</p>
    <ul>
      <li><strong>Single Inheritance</strong> – a class can extend only one parent class.</li>
      <li><strong>Multilevel Inheritance</strong> – a chain (A -> B -> C).</li>
      <li><strong>Hierarchical Inheritance</strong> – multiple classes extend a single parent.</li>
      <li><strong>Multiple Inheritance</strong> – achieved only through interfaces (a class can implement many interfaces).</li>
      <li><strong>Hybrid Inheritance</strong> – combination, achieved through interfaces to avoid diamond problem.</li>
    </ul>

    <h4>5. Polymorphism</h4>
    <p>Polymorphism ("many forms") allows one interface to be used for a general class of actions.</p>
    <ul>
      <li><strong>Compile-time Polymorphism (Static Binding)</strong> – method overloading: multiple methods with the same name but different parameter lists. Resolved at compile time.</li>
      <li><strong>Runtime Polymorphism (Dynamic Binding)</strong> – method overriding: a subclass provides a specific implementation of a method defined in its superclass. Resolved at runtime via virtual method invocation.</li>
    </ul>

    <h4>6. Class Relationships</h4>
    <table style="width:100%; margin:1rem 0;">
      <tr><th>Relationship</th><th>Description</th></tr>
      <tr><td>Association</td><td>A general "uses-a" relationship; objects are aware of each other.</td></tr>
      <tr><td>Aggregation</td><td>"Has-a" with weak bonding: child can exist independently of parent (e.g., Department - Employee).</td></tr>
      <tr><td>Composition</td><td>"Has-a" with strong bonding: child cannot exist without parent (e.g., House - Room).</td></tr>
      <tr><td>Dependency</td><td>A class depends on another to function (e.g., method parameter).</td></tr>
      <tr><td>Realization</td><td>A class implements an interface.</td></tr>
    </table>

    <h4>7. Constructors and Destructors</h4>
    <p>Constructors initialise objects. Java provides default, parameterized, and copy constructors. Destructors (<code>finalize()</code>) exist but are deprecated; Java relies on garbage collection.</p>

    <h4>8. Access Modifiers</h4>
    <table style="width:100%; margin:1rem 0;">
      <tr><th>Modifier</th><th>Class</th><th>Package</th><th>Subclass</th><th>World</th></tr>
      <tr><td>private</td><td>Y</td><td>N</td><td>N</td><td>N</td></tr>
      <tr><td>default</td><td>Y</td><td>Y</td><td>N</td><td>N</td></tr>
      <tr><td>protected</td><td>Y</td><td>Y</td><td>Y</td><td>N</td></tr>
      <tr><td>public</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td></tr>
    </table>

    <h4>9. Advanced Class Types</h4>
    <p><strong>Static classes:</strong> nested static classes that don't need an outer instance.</p>
    <p><strong>Final classes:</strong> cannot be subclassed. <strong>Sealed classes</strong> (Java 17) restrict which classes may extend/implement them.</p>
    <p><strong>Inner/Nested classes:</strong> member inner, local inner, anonymous inner, and static nested classes.</p>
    <p><strong>Singleton classes:</strong> ensure only one instance exists.</p>
    <p><strong>Immutable objects:</strong> state cannot change after creation (all fields final, no setters).</p>

    <h4>10. Advanced Polymorphism and Methods</h4>
    <p>Virtual methods (default in Java), method hiding (static methods redefined in subclass), covariant return types, upcasting/downcasting, and operator overloading (not supported in Java except for <code>+</code> on strings).</p>

    <h4>11. SOLID Principles</h4>
    <ul>
      <li><strong>S</strong>ingle Responsibility – a class should have only one reason to change.</li>
      <li><strong>O</strong>pen/Closed – open for extension, closed for modification.</li>
      <li><strong>L</strong>iskov Substitution – subtypes must be substitutable for their base types.</li>
      <li><strong>I</strong>nterface Segregation – many client-specific interfaces are better than one general-purpose interface.</li>
      <li><strong>D</strong>ependency Inversion – depend on abstractions, not concretions.</li>
    </ul>

    <h4>12. Other Design Principles</h4>
    <p>DRY, KISS, YAGNI, Law of Demeter, GRASP, Composition over Inheritance.</p>

    <h4>13. Gang of Four Design Patterns</h4>
    <p><strong>Creational:</strong> Singleton, Factory, Builder. <strong>Structural:</strong> Adapter, Decorator, Facade. <strong>Behavioral:</strong> Observer, Strategy, Command. (These are applied patterns, not language constructs.)</p>
  </div>

  <!-- CODE LAB -->
  <div class="theory-section" style="margin-bottom:2rem;">
    <div class="section-badge">[ CODE LAB ]</div>
    <h3>Java Implementations of Key Concepts</h3>

    <h4>Encapsulation &amp; Access Modifiers</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">BankAccount.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">BankAccount</span> {</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">private</span> <span style="color:#79C0FF">double</span> <span style="color:#E6EDF3">balance;</span> <span style="color:#484F58; font-style:italic"> // data hiding</span></span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#D2A8FF">BankAccount</span>(<span style="color:#79C0FF">double</span> initial) { balance = initial; }</span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#79C0FF">double</span> <span style="color:#D2A8FF">getBalance</span>() { <span style="color:#FF7B72">return</span> balance; } <span style="color:#484F58; font-style:italic">// getter</span></span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#79C0FF">void</span> <span style="color:#D2A8FF">deposit</span>(<span style="color:#79C0FF">double</span> amt) { <span style="color:#FF7B72">if</span> (amt > 0) balance += amt; } <span style="color:#484F58; font-style:italic">// setter with validation</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">}</span></div>
      </div>
    </div>

    <h4>Abstract Class vs Interface</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">Payment.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">abstract class</span> <span style="color:#FFA657">Payment</span> {</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">abstract void</span> <span style="color:#D2A8FF">pay</span>(<span style="color:#79C0FF">double</span> amount);</span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">receipt</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Generating receipt"</span>); }</span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">}</span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content"><span style="color:#FF7B72">interface</span> <span style="color:#FFA657">UPIEnabled</span> {</span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">  <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">scanQR</span>();</span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">}</span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">CreditCardPayment</span> <span style="color:#FF7B72">extends</span> <span style="color:#FFA657">Payment</span> <span style="color:#FF7B72">implements</span> <span style="color:#FFA657">UPIEnabled</span> {</span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">  <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">pay</span>(<span style="color:#79C0FF">double</span> amount) { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Paid "</span> + amount); }</span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">  <span style="color:#FF7B72">public void</span> <span style="color:#D2A8FF">scanQR</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"QR scanned"</span>); }</span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">}</span></div>
      </div>
    </div>

    <h4>Inheritance and Polymorphism</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">AnimalDemo.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">Animal</span> { <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">speak</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Animal sound"</span>); } }</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">Dog</span> <span style="color:#FF7B72">extends</span> <span style="color:#FFA657">Animal</span> { <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">speak</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Bark"</span>); } }</span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">Cat</span> <span style="color:#FF7B72">extends</span> <span style="color:#FFA657">Animal</span> { <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">speak</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Meow"</span>); } }</span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">AnimalDemo</span> {</span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#FF7B72">public static void</span> <span style="color:#D2A8FF">main</span>(<span style="color:#79C0FF">String</span>[] args) {</span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">    <span style="color:#FFA657">Animal</span> a = <span style="color:#FF7B72">new</span> <span style="color:#FFA657">Dog</span>(); <span style="color:#484F58; font-style:italic">// upcasting</span></span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    a.speak(); <span style="color:#484F58; font-style:italic">         // prints "Bark" (runtime polymorphism)</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">    <span style="color:#FFA657">Animal</span>[] zoo = {<span style="color:#FF7B72">new</span> <span style="color:#FFA657">Dog</span>(), <span style="color:#FF7B72">new</span> <span style="color:#FFA657">Cat</span>()};</span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">    <span style="color:#FF7B72">for</span> (<span style="color:#FFA657">Animal</span> x : zoo) x.speak(); <span style="color:#484F58; font-style:italic">// polymorphic call</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">  }</span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">}</span></div>
      </div>
      <div class="code-output">
        <div class="output-label">OUTPUT</div>
        <div class="output-body">
          <span class="output-text">Bark</span>
          <span class="output-text">Bark</span>
          <span class="output-text">Meow</span>
        </div>
      </div>
    </div>

    <h4>Constructor Types (Default, Parameterized, Copy, Destructor simulation)</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">Student.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">Student</span> {</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">private</span> <span style="color:#79C0FF">String</span> name;</span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// default constructor</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#D2A8FF">Student</span>() { <span style="color:#FF7B72">this</span>(<span style="color:#A5D6FF">"Unknown"</span>); }</span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// parameterized constructor</span></span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#D2A8FF">Student</span>(<span style="color:#79C0FF">String</span> name) { <span style="color:#FF7B72">this</span>.name = name; }</span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// copy constructor</span></span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#D2A8FF">Student</span>(<span style="color:#FFA657">Student</span> other) { <span style="color:#FF7B72">this</span>.name = other.name; }</span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">  <span style="color:#484F58; font-style:italic">// deprecated finalize acts as destructor callback (avoid)</span></span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">  <span style="color:#FF7B72">protected void</span> <span style="color:#D2A8FF">finalize</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Cleaning up"</span>); }</span></div>
        <div class="code-line"><span class="ln">11</span><span class="code-content">}</span></div>
      </div>
    </div>

    <h4>Composition vs Inheritance</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">Car.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">Engine</span> { <span style="color:#FF7B72">void</span> <span style="color:#D2A8FF">start</span>() { <span style="color:#79C0FF">System</span>.out.println(<span style="color:#A5D6FF">"Engine starts"</span>); } }</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content"><span style="color:#FF7B72">class</span> <span style="color:#FFA657">Car</span> {</span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">private</span> <span style="color:#FFA657">Engine</span> engine; <span style="color:#484F58; font-style:italic"> // composition: Car owns Engine</span></span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">public</span> <span style="color:#D2A8FF">Car</span>() { engine = <span style="color:#FF7B72">new</span> <span style="color:#FFA657">Engine</span>(); }</span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">  <span style="color:#FF7B72">public void</span> <span style="color:#D2A8FF">drive</span>() { engine.start(); }</span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">}</span></div>
      </div>
    </div>

    <h4>Singleton Pattern (Eager initialization)</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">DatabaseConnection.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">DatabaseConnection</span> {</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">private static final</span> <span style="color:#FFA657">DatabaseConnection</span> INSTANCE = <span style="color:#FF7B72">new</span> <span style="color:#FFA657">DatabaseConnection</span>();</span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">private</span> <span style="color:#D2A8FF">DatabaseConnection</span>() {}</span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">public static</span> <span style="color:#FFA657">DatabaseConnection</span> <span style="color:#D2A8FF">getInstance</span>() { <span style="color:#FF7B72">return</span> INSTANCE; }</span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">}</span></div>
      </div>
    </div>

    <h4>Builder Pattern (Creational)</h4>
    <div class="code-block-wrapper">
      <div class="code-header"><span class="code-lang-badge">Java</span><span class="code-filename">User.java</span></div>
      <div class="code-body">
        <div class="code-line"><span class="ln">1</span><span class="code-content"><span style="color:#FF7B72">public class</span> <span style="color:#FFA657">User</span> {</span></div>
        <div class="code-line"><span class="ln">2</span><span class="code-content">  <span style="color:#FF7B72">private</span> <span style="color:#79C0FF">String</span> name, email;</span></div>
        <div class="code-line"><span class="ln">3</span><span class="code-content">  <span style="color:#FF7B72">private</span> <span style="color:#D2A8FF">User</span>(<span style="color:#FFA657">Builder</span> builder) { name = builder.name; email = builder.email; }</span></div>
        <div class="code-line"><span class="ln">4</span><span class="code-content">  <span style="color:#FF7B72">public static class</span> <span style="color:#FFA657">Builder</span> {</span></div>
        <div class="code-line"><span class="ln">5</span><span class="code-content">    <span style="color:#FF7B72">private</span> <span style="color:#79C0FF">String</span> name, email;</span></div>
        <div class="code-line"><span class="ln">6</span><span class="code-content">    <span style="color:#FF7B72">public</span> <span style="color:#FFA657">Builder</span> <span style="color:#D2A8FF">name</span>(<span style="color:#79C0FF">String</span> name) { <span style="color:#FF7B72">this</span>.name = name; <span style="color:#FF7B72">return</span> <span style="color:#FF7B72">this</span>; }</span></div>
        <div class="code-line"><span class="ln">7</span><span class="code-content">    <span style="color:#FF7B72">public</span> <span style="color:#FFA657">Builder</span> <span style="color:#D2A8FF">email</span>(<span style="color:#79C0FF">String</span> email) { <span style="color:#FF7B72">this</span>.email = email; <span style="color:#FF7B72">return</span> <span style="color:#FF7B72">this</span>; }</span></div>
        <div class="code-line"><span class="ln">8</span><span class="code-content">    <span style="color:#FF7B72">public</span> <span style="color:#FFA657">User</span> <span style="color:#D2A8FF">build</span>() { <span style="color:#FF7B72">return</span> <span style="color:#FF7B72">new</span> <span style="color:#FFA657">User</span>(<span style="color:#FF7B72">this</span>); }</span></div>
        <div class="code-line"><span class="ln">9</span><span class="code-content">  }</span></div>
        <div class="code-line"><span class="ln">10</span><span class="code-content">}</span></div>
      </div>
    </div>
  </div>

  <!-- ANALOGIES -->
  <h2>Real-Life Analogies</h2>
  <div class="analogy-card" style="background:#222; padding:1.5rem; border-radius:8px; margin-bottom:1.5rem;">
    <h3>Class and Object: Blueprint and Houses</h3>
    <p>A class is like a blueprint of a house. The blueprint describes walls, doors, windows. An object is a physical house built from that blueprint. You can build many houses (objects) from the same blueprint (class).</p>
  </div>
  <div class="analogy-card" style="background:#222; padding:1.5rem; border-radius:8px; margin-bottom:1.5rem;">
    <h3>Encapsulation: The Medicine Capsule</h3>
    <p>A capsule encloses different chemical powders and protects them from the outside. The outer shell (getters/setters) controls how the contents are accessed. You don't directly touch the powder; you go through the shell.</p>
  </div>
  <div class="analogy-card" style="background:#222; padding:1.5rem; border-radius:8px; margin-bottom:1.5rem;">
    <h3>Polymorphism: The Steering Wheel</h3>
    <p>A steering wheel (the same interface) can control a car, a truck, or a bus. Each vehicle (subclass) reacts differently to the same "turn" command, but the driver uses the wheel uniformly.</p>
  </div>

  <!-- INTERVIEW PREP -->
  <div class="interview-section" style="margin-top:2rem;">
    <div class="section-badge">[ INTERVIEW PREP ]</div>
    <h3>Common Interview Questions</h3>
    <div class="qa-item">
      <h4>Q: Difference between abstract class and interface in Java.</h4>
      <p>Abstract classes can have state (fields), constructors, and both abstract and concrete methods. Interfaces (pre-Java 8) had only abstract methods; since Java 8, they can have default and static methods. A class can implement many interfaces but extend only one abstract class.</p>
    </div>
    <div class="qa-item">
      <h4>Q: Explain the diamond problem and how Java avoids it.</h4>
      <p>The diamond problem occurs when a class inherits from two classes that have the same method signature. Java avoids this by not supporting multiple inheritance of classes. Multiple inheritance of type is achieved through interfaces, which do not contain state, thus avoiding ambiguity.</p>
    </div>
    <div class="qa-item">
      <h4>Q: Why prefer composition over inheritance?</h4>
      <p>Composition provides greater flexibility because behaviour can be changed at runtime by swapping components. Inheritance creates a tight compile-time coupling and can lead to fragile base class problems. Composition adheres to the principle of encapsulating varying behaviour.</p>
    </div>
  </div>

  <!-- COMMON MISTAKES -->
  <div class="mistakes-section" style="margin-top:2rem;">
    <div class="section-badge">[ COMMON MISTAKES ]</div>
    <ul>
      <li>Confusing aggregation with composition: aggregation implies weak bonding (child can exist independently).</li>
      <li>Breaking encapsulation by exposing mutable internal collections directly.</li>
      <li>Using inheritance for code reuse without an "is-a" relationship, leading to incorrect hierarchies.</li>
      <li>Overusing the Singleton pattern, which can make testing difficult and hide dependencies.</li>
      <li>Forgetting that Java uses pass-by-value, and assuming object references are passed by reference.</li>
    </ul>
  </div>

  <!-- PRACTICE PROBLEMS -->
  <div class="practice-section" style="margin-top:2rem;">
    <div class="section-badge">[ PRACTICE PROBLEMS ]</div>
    <div class="problem-card">
      <h4>1. Design a Library Management System</h4>
      <p>Identify classes (Book, Member, Library), their relationships, and implement borrowing with proper encapsulation. Use composition for Library having a list of Books.</p>
    </div>
    <div class="problem-card">
      <h4>2. Implement a Shape Hierarchy</h4>
      <p>Create abstract class Shape with method area(). Implement Circle, Rectangle, Triangle and demonstrate runtime polymorphism with a list of shapes.</p>
    </div>
    <div class="problem-card">
      <h4>3. Apply SOLID Principles</h4>
      <p>Refactor a monolithic notification class into separate classes adhering to Single Responsibility and Open/Closed (e.g., EmailNotifier, SMSNotifier) using an interface.</p>
    </div>
    <div class="problem-card">
      <h4>4. Build an Immutable Point class</h4>
      <p>Create a final class Point with final fields x and y. Provide a method to return a new Point when a move is requested, demonstrating immutability.</p>
    </div>
  </div>

  <!-- QUIZ -->
  <div class="quiz-section" style="margin-top:2rem;">
    <div class="section-badge">[ QUIZ ]</div>
    
    <div class="quiz-question">
      <p><strong>1. Which access modifier makes a member visible only within its own package and by subclasses?</strong></p>
      <ul>
        <li>A. private</li>
        <li>B. default (no modifier)</li>
        <li>C. protected</li>
        <li>D. public</li>
      </ul>
      <p><em>Correct: C. protected</em></p>
    </div>

    <div class="quiz-question">
      <p><strong>2. What is the output of the following code?</strong></p>
      <pre>class A { void print() { System.out.println("A"); } }
class B extends A { void print() { System.out.println("B"); } }
public class Test {
  public static void main(String[] args) {
    A obj = new B();
    obj.print();
  }
}</pre>
      <ul>
        <li>A. A</li>
        <li>B. B</li>
        <li>C. Compilation error</li>
        <li>D. Runtime exception</li>
      </ul>
      <p><em>Correct: B. B (runtime polymorphism calls overridden method)</em></p>
    </div>

    <div class="quiz-question">
      <p><strong>3. Which relationship is described as "has-a" with strong lifecycle dependency?</strong></p>
      <ul>
        <li>A. Association</li>
        <li>B. Aggregation</li>
        <li>C. Composition</li>
        <li>D. Dependency</li>
      </ul>
      <p><em>Correct: C. Composition</em></p>
    </div>

    <div class="quiz-question">
      <p><strong>4. In Java, multiple inheritance is achieved through:</strong></p>
      <ul>
        <li>A. Abstract classes</li>
        <li>B. Interfaces</li>
        <li>C. Both A and B</li>
        <li>D. None of the above</li>
      </ul>
      <p><em>Correct: B. Interfaces (a class can implement multiple interfaces)</em></p>
    </div>

    <div class="quiz-question">
      <p><strong>5. Which SOLID principle states that a class should have only one reason to change?</strong></p>
      <ul>
        <li>A. Open/Closed Principle</li>
        <li>B. Liskov Substitution Principle</li>
        <li>C. Single Responsibility Principle</li>
        <li>D. Interface Segregation Principle</li>
      </ul>
      <p><em>Correct: C. Single Responsibility Principle</em></p>
    </div>
  </div>

  <!-- SUMMARY -->
  <div class="summary-section" style="margin-top:2rem;">
    <div class="section-badge">[ SUMMARY ]</div>
    <p>You have explored the entire landscape of Object-Oriented Programming: classes, objects, encapsulation, abstraction, inheritance, polymorphism, class relationships, access modifiers, constructors, advanced class types, SOLID principles, and design patterns. The provided Java code examples illustrate each concept, and the real-world analogies cement understanding. You are now equipped to design robust, maintainable software architectures.</p>
  </div>
</article>`,
      theory: `Core OOP theory covering encapsulation, abstraction, inheritance, polymorphism, relationships, access control, and design principles.`,
      analogy: "Blueprint (class) to house (object), medicine capsule (encapsulation), steering wheel (polymorphism).",
      interviewNotes: "Prepare for questions on abstract class vs interface, diamond problem, composition over inheritance, and SOLID principles.",
      commonMistakes: "Confusing aggregation and composition, breaking encapsulation, misuse of inheritance, overusing Singleton, forgetting Java's pass-by-value.",
      practiceProblems: [
        {
          title: "Library Management System",
          problemText: "Design classes with proper encapsulation and composition.",
          solution: "// Define Book, Member, Library classes; Library contains list of Books."
        },
        {
          title: "Shape Hierarchy",
          problemText: "Use abstract class and method overriding to calculate area of various shapes.",
          solution: "abstract class Shape { abstract double area(); } class Circle extends Shape { ... }"
        },
        {
          title: "SOLID Refactoring",
          problemText: "Refactor a notification class to follow Single Responsibility and Open/Closed principles.",
          solution: "interface Notifier { void send(String msg); } class EmailNotifier implements Notifier { ... }"
        },
        {
          title: "Immutable Point",
          problemText: "Create an immutable class with final fields and a method that returns a new instance on state change.",
          solution: "public final class Point { private final int x, y; public Point move(int dx, int dy) { return new Point(x+dx, y+dy); } }"
        }
      ],
      quiz: {
        questions: [
          {
            questionText: "Which access modifier makes a member visible only within its own package and by subclasses?",
            options: [
              { text: "private", isCode: false },
              { text: "default", isCode: false },
              { text: "protected", isCode: false },
              { text: "public", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "protected allows access within the same package and also from subclasses."
          },
          {
            questionText: "What is the output of: A obj = new B(); obj.print(); where B extends A and both have print()?",
            options: [
              { text: "A", isCode: false },
              { text: "B", isCode: false },
              { text: "Compilation error", isCode: false },
              { text: "Runtime exception", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Runtime polymorphism dispatches to the actual object's method, so B's print() executes."
          },
          {
            questionText: "Which relationship implies a strong lifecycle dependency between objects?",
            options: [
              { text: "Association", isCode: false },
              { text: "Aggregation", isCode: false },
              { text: "Composition", isCode: false },
              { text: "Dependency", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "In composition, the child object is created and destroyed with the parent."
          },
          {
            questionText: "How does Java achieve multiple inheritance?",
            options: [
              { text: "Through abstract classes", isCode: false },
              { text: "Through interfaces", isCode: false },
              { text: "Both", isCode: false },
              { text: "None", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "A class can implement multiple interfaces, enabling multiple inheritance of type."
          },
          {
            questionText: "Which SOLID principle advocates a single reason for a class to change?",
            options: [
              { text: "Open/Closed", isCode: false },
              { text: "Liskov Substitution", isCode: false },
              { text: "Single Responsibility", isCode: false },
              { text: "Interface Segregation", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "Single Responsibility Principle states that a class should have only one job."
          }
        ]
      }
    }
  ]
};