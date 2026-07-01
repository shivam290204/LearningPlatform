export default {
  id: 'module03-methods',
  title: 'Module 3: Methods & Execution',
  lessons: [
    {
      id: 'java-functions',
      title: 'Functions & Method Execution',
      slug: 'java-functions',
      description: 'Deep dive into Functions & Method Execution: how methods are structured, called, and managed on the call stack.',
      difficulty: 'Beginner',
      estTime: '25 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: null,
      visualizations: [],
      objectives: [
        'Understand method declaration, parameters, and return types',
        'Explain the call stack and how stack frames are created and destroyed',
        'Differentiate between static and instance methods',
        'Recognize common pitfalls like missing return statements and shadowing'
      ],
      content: `
        <h2>Functions & Method Execution in Java</h2>
        <p>In Java, what many languages call <em>functions</em> are known as <strong>methods</strong>. A method is a block of code that performs a specific task and can be called (invoked) from other parts of the program. Every method must belong to a class; Java does not allow standalone functions.</p>
        
        <h3>Anatomy of a Method</h3>
        <pre><code>// General form:
[access modifier] [static] returnType methodName(parameterType paramName, ...) {
    // body
    return value; // if returnType is not void
}

// Example:
public static int add(int a, int b) {
    int sum = a + b;
    return sum;
}</code></pre>
        <ul>
          <li><strong>Access modifier:</strong> <code>public</code>, <code>private</code>, etc. – controls visibility.</li>
          <li><strong>static:</strong> if present, the method belongs to the class itself, not to instances.</li>
          <li><strong>Return type:</strong> the data type of the value returned (e.g., <code>int</code>, <code>String</code>). Use <code>void</code> if the method returns nothing.</li>
          <li><strong>Parameters:</strong> a comma-separated list of type-name pairs that act as input variables within the method.</li>
        </ul>

        <h3>Calling a Method & The Call Stack</h3>
        <p>When you invoke a method, the JVM creates a new <strong>stack frame</strong> on the <strong>call stack</strong>. This frame holds:</p>
        <ul>
          <li>The method’s parameters (initialized with the passed arguments)</li>
          <li>Local variables declared inside the method</li>
          <li>The return address (where to resume after the method finishes)</li>
        </ul>
        <p>When the method completes (hits a <code>return</code> or reaches the end of a <code>void</code> method), its stack frame is destroyed. Control returns to the caller, and any return value is passed back.</p>

        <h3>Static vs Instance Methods</h3>
        <p><strong>Static methods</strong> (using the <code>static</code> keyword) belong to the class. You call them using the class name: <code>ClassName.methodName()</code>. They cannot directly access instance variables or instance methods unless given an object reference.</p>
        <p><strong>Instance methods</strong> require an object of the class to be called (<code>object.methodName()</code>) and can access instance variables and other instance methods directly.</p>

        <h3>Method Overloading</h3>
        <p>Java allows multiple methods with the same name but different parameter lists (different number, types, or order). This is called <strong>overloading</strong>. The compiler chooses the appropriate version based on the arguments provided. Overloading is resolved at compile time.</p>
        
        <h3>LeetCode‑Style Example: Sum of Digits</h3>
        <p>Write a method <code>sumOfDigits</code> that takes an integer <code>n</code> and returns the sum of its digits. Use the method in a simple demo.</p>
        <pre><code>public class DigitSum {
    public static int sumOfDigits(int n) {
        int sum = 0;
        // Handle negative numbers by taking absolute value
        n = Math.abs(n);
        while (n > 0) {
            sum += n % 10;  // extract last digit
            n = n / 10;     // remove last digit
        }
        return sum;
    }

    public static void main(String[] args) {
        int result = sumOfDigits(1234); // 1+2+3+4 = 10
        System.out.println("Sum of digits of 1234: " + result);
    }
}</code></pre>
        <p>Explanation: The method uses a loop to repeatedly strip off the last digit using <code>% 10</code> and then reduces <code>n</code> by a factor of 10. The absolute value ensures it works for negative inputs.</p>
      `,
      theory: `
        <h3>Call Stack Deep Dive</h3>
        <p>Every thread in Java has its own call stack. When a method is called:</p>
        <ol>
          <li>A new frame is pushed onto the stack.</li>
          <li>All parameters are copied into that frame (remember, Java is pass‑by‑value).</li>
          <li>Local variables inside the method are allocated in the frame.</li>
          <li>The method executes.</li>
          <li>On <code>return</code>, the frame is popped. If there is a return value, it is placed where the caller can access it.</li>
        </ol>
        <p>A deep chain of calls can lead to a <code>StackOverflowError</code> if recursion is too deep or memory is exhausted.</p>
        <p>Understanding the stack is crucial for debugging and reasoning about variable lifetimes and scope.</p>
      `,
      analogy: `
        <p>Think of methods like <strong>recipes in a cookbook</strong>. Each recipe (method) lists the ingredients (parameters) and the steps (body). When you want to cook that dish, you follow the recipe with your specific ingredients. While cooking, you might need to follow a sub‑recipe (call another method) for a sauce – you put the current recipe on hold (push a stack frame), execute the sub‑recipe, then return to the main recipe with the sauce ready.</p>
        <p>The call stack is like a stack of recipe cards on your kitchen counter: the top card is the one you’re currently executing. Once you finish, you take it off and resume where you left off on the previous card.</p>
      `,
      interviewNotes: `
        <p>Common interview questions:</p>
        <ul>
          <li>What is the difference between method overloading and overriding? (Overloading: same name, different parameters, compile‑time; Overriding: same signature, runtime polymorphism with inheritance)</li>
          <li>Can we overload the <code>main</code> method? (Yes, but the JVM only calls <code>main(String[] args)</code>)</li>
          <li>What happens on the stack when a method calls itself recursively? (Multiple frames for the same method are stacked; each with its own copies of parameters and locals.)</li>
        </ul>
      `,
      commonMistakes: `
        <ul>
          <li>Forgetting the return type or writing a return statement in a <code>void</code> method.</li>
          <li>Trying to return a value from a method with a <code>void</code> return type – compile error.</li>
          <li>Shadowing: declaring a local variable with the same name as a parameter, leading to confusion.</li>
          <li>Calling an instance method from a static context without an object.</li>
        </ul>
      `,
      practiceProblems: [
        {
          title: 'Factorial Computation (Iterative)',
          problemText: 'Write a static method `factorial(int n)` that returns the factorial of `n` (n!). Assume `n >= 0`. Use an iterative approach. Provide a `main` method to test with `n = 5`.',
          solution: `public class Factorial {
    public static long factorial(int n) {
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(factorial(5)); // 120
    }
}`
        }
      ],
      quiz: {
        questions: [
          {
            questionText: 'Which of the following is a valid method signature?',
            options: [
              { text: 'void doSomething(int a, b)', isCode: true },
              { text: 'public static int compute(int x, int y)', isCode: true },
              { text: 'static void process(int a, int b) { } // missing return', isCode: false },
              { text: 'int 123calc(int num)', isCode: true }
            ],
            correctAnswerIndex: 1,
            explanation: 'Option 2 is correct: `public static int compute(int x, int y)`. Option 1 missing type for `b`, option 3 has missing return type (though syntactically wrong structure), option 4 starts with a digit.'
          },
          {
            questionText: 'What is stored in a stack frame when a method is called?',
            options: [
              { text: 'Only the method’s return value', isCode: false },
              { text: 'Parameters, local variables, and return address', isCode: false },
              { text: 'Object instances created inside the method', isCode: false },
              { text: 'The class definition of the method', isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: 'A stack frame contains parameters, local variables, and a return address. Object instances live on the heap, not inside the frame (only their references are in the frame).'
          },
          {
            questionText: 'How does Java differentiate between overloaded methods?',
            options: [
              { text: 'By return type only', isCode: false },
              { text: 'By method name and parameter list', isCode: false },
              { text: 'By access modifiers', isCode: false },
              { text: 'By the number of lines of code', isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: 'Overloaded methods must have the same name but a different parameter list (number, type, or order). Return type alone is not enough.'
          },
          {
            questionText: 'What happens if a static method tries to access an instance variable directly?',
            options: [
              { text: 'It gets the default value of the variable', isCode: false },
              { text: 'Compilation error', isCode: false },
              { text: 'It accesses the variable of the last created instance', isCode: false },
              { text: 'It automatically creates an instance', isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: 'A static method cannot directly access instance variables because there is no implicit `this` reference. The compiler will report an error.'
          },
          {
            questionText: 'What is the maximum number of values a method can return in Java?',
            options: [
              { text: 'One', isCode: false },
              { text: 'Two, if you use a Pair class', isCode: false },
              { text: 'Unlimited, via varargs', isCode: false },
              { text: 'One, but you can return an object containing multiple values', isCode: false }
            ],
            correctAnswerIndex: 3,
            explanation: 'A method can return only one value (or none if void). To return multiple values, wrap them in an object or array.'
          }
        ]
      }
    },
    {
      id: 'parameters-passing',
      title: 'Parameters Passing: Value vs References',
      slug: 'parameters-passing',
      description: 'Master Java’s pass-by-value semantics and understand the difference between passing primitives and object references.',
      difficulty: 'Beginner',
      estTime: '25 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: 'jvm-memory',
      visualizations: [
        {
          step: 1,
          label: 'User original = new User(); -> We allocate original user at address 0x5501 in the Stack frame.',
          memorySnapshot: {
            stack: [{ variable: 'original', value: '0x5501' }],
            heap: [{ address: '0x5501', objectType: 'User', fields: { name: 'Unassigned' } }]
          }
        },
        {
          step: 2,
          label: 'Calling changeName(original) creates a copy of the reference (param u = copy of 0x5501). Both point to same object.',
          memorySnapshot: {
            stack: [
              { variable: 'original (main)', value: '0x5501' },
              { variable: 'u (changeName param)', value: '0x5501' }
            ],
            heap: [{ address: '0x5501', objectType: 'User', fields: { name: 'Unassigned' } }]
          }
        },
        {
          step: 3,
          label: 'u.name = "Alice"; modifies the shared object on heap. Original sees change.',
          memorySnapshot: {
            stack: [
              { variable: 'original (main)', value: '0x5501' },
              { variable: 'u (changeName param)', value: '0x5501' }
            ],
            heap: [{ address: '0x5501', objectType: 'User', fields: { name: 'Alice' } }]
          }
        },
        {
          step: 4,
          label: 'u = new User("Bob"); reassigns local copy to a new address. Original still points to Alice.',
          memorySnapshot: {
            stack: [
              { variable: 'original (main)', value: '0x5501' },
              { variable: 'u (changeName param)', value: '0x7702' }
            ],
            heap: [
              { address: '0x5501', objectType: 'User', fields: { name: 'Alice' } },
              { address: '0x7702', objectType: 'User', fields: { name: 'Bob' } }
            ]
          }
        }
      ],
      objectives: [
        'Understand that Java is always pass-by-value',
        'Differentiate between passing a primitive and passing an object reference',
        'Predict the effect of modifying a parameter inside a method',
        'Explain why reassigning an object parameter does not affect the original reference'
      ],
      content: `
        <h2>Java Pass‑by‑Value: The Truth</h2>
        <p>Java is <strong>strictly pass‑by‑value</strong>. When you call a method and supply arguments, <strong>the values of those arguments are copied</strong> into the method’s parameter variables.</p>
        
        <h3>Primitive Types</h3>
        <p>For primitives (<code>int</code>, <code>double</code>, <code>boolean</code>, etc.), the actual numeric/boolean value is copied. Any changes to the parameter inside the method have no effect on the original variable.</p>
        <pre><code>public static void increment(int x) {
    x = x + 1;
}
public static void main(String[] args) {
    int a = 5;
    increment(a);
    System.out.println(a); // still 5
}</code></pre>
        <p>Here, <code>x</code> is a separate copy of <code>a</code>. Changing <code>x</code> does not change <code>a</code>.</p>

        <h3>Object References</h3>
        <p>When you pass an object, the value passed is the <strong>reference (memory address)</strong> to that object. The reference itself is copied. So the method receives its own copy of the remote control pointing to the same object on the heap.</p>
        <pre><code>class Car { int speed = 0; }

public static void accelerate(Car c) {
    c.speed += 10;   // modifies the shared object
}
public static void main(String[] args) {
    Car myCar = new Car();
    accelerate(myCar);
    System.out.println(myCar.speed); // 10
}</code></pre>
        <p>Because <code>c</code> and <code>myCar</code> point to the same object, changes to the object’s fields are visible to the caller. However, if you reassign the parameter <code>c</code> to a new object, that only changes the local copy; the original reference remains unchanged.</p>
        <pre><code>public static void replace(Car c) {
    c = new Car();   // local copy now points elsewhere
    c.speed = 100;
}
public static void main(String[] args) {
    Car myCar = new Car();
    myCar.speed = 5;
    replace(myCar);
    System.out.println(myCar.speed); // still 5, not 100
}</code></pre>

        <h3>LeetCode‑Style Example: Swap Attempt</h3>
        <p>Implement a method that tries to swap two integers. Explain why it doesn’t work as expected.</p>
        <pre><code>public class SwapTest {
    public static void swap(int a, int b) {
        int temp = a;
        a = b;
        b = temp;
    }

    public static void main(String[] args) {
        int x = 3, y = 7;
        swap(x, y);
        System.out.println("x=" + x + ", y=" + y); // still 3 and 7
    }
}</code></pre>
        <p>The copies of <code>x</code> and <code>y</code> are swapped inside the method, but the original variables remain untouched because Java is pass‑by‑value. To truly swap values, you would need to use a mutable wrapper object or return an array.</p>
      `,
      theory: `
        <h3>Memory Model Behind Pass‑by‑Value</h3>
        <p>Every variable in Java occupies a slot in the current stack frame. For primitives, that slot holds the raw data. For objects, the slot holds the heap address. When a method is called, the JVM copies the content of each argument slot into the corresponding parameter slot of the new frame. That’s the core of pass‑by‑value.</p>
        <p>If the parameter is a primitive, the copied value is independent. If it’s a reference, the copied value is the address; thus both the caller and the callee can access the same heap object. But if the callee points its own copy to a different object, the caller’s copy is unaffected.</p>
      `,
      analogy: `
        <p>Imagine you have a document stored in a cloud folder (the heap). You share a <strong>link</strong> to that document with a colleague. That link is like an object reference. When your colleague edits the document through the link, you see the changes because you both access the same file. If your colleague creates a new document and replaces the link on their own desktop (reassigns the parameter), your original link still points to the original document – you won’t see the new one.</p>
        <p>Passing a primitive is like photocopying a page and handing the copy to someone. They can scribble on the copy all they want; your original page remains unchanged.</p>
      `,
      interviewNotes: `
        <p>Frequently asked: “Is Java pass‑by‑reference?” – The correct answer is <em>no</em>; it’s pass‑by‑value. The misconception arises because passing object references allows modification of the object’s state. Emphasise that the reference itself is passed by value.</p>
        <p>Another twist: arrays are objects, so the same rules apply.</p>
      `,
      commonMistakes: `
        <ul>
          <li>Thinking that reassigning a parameter inside a method will change the original reference.</li>
          <li>Believing primitives can be passed by reference using arrays (arrays are objects, the reference is passed by value).</li>
          <li>Confusing immutability (e.g., <code>String</code>) with pass‑by‑value: you can’t change the String’s content because the class is immutable, not because of parameter passing.</li>
        </ul>
      `,
      practiceProblems: [
        {
          title: 'Point Mover',
          problemText: 'Define a class `Point` with fields `int x, y`. Write a static method `move(Point p, int dx, int dy)` that adds `dx` to `p.x` and `dy` to `p.y`. Show that after calling `move(myPoint, 2, 3)`, the original `myPoint` coordinates are updated. Also demonstrate that reassigning `p` to a new `Point` inside the method does not affect the caller.',
          solution: `class Point { int x, y; Point(int x, int y) { this.x = x; this.y = y; } }

public class PointMover {
    public static void move(Point p, int dx, int dy) {
        p.x += dx;
        p.y += dy;
    }

    public static void replace(Point p) {
        p = new Point(99, 99); // local copy reassigned
    }

    public static void main(String[] args) {
        Point myPoint = new Point(1, 1);
        move(myPoint, 2, 3);
        System.out.println(myPoint.x + "," + myPoint.y); // 3,4

        replace(myPoint);
        System.out.println(myPoint.x + "," + myPoint.y); // still 3,4
    }
}`
        }
      ],
      quiz: {
        questions: [
          {
            questionText: 'In Java, when an object is passed to a method, what actually gets passed?',
            options: [
              { text: 'A deep copy of the entire object', isCode: false },
              { text: 'The object itself is placed on the stack', isCode: false },
              { text: 'A copy of the reference (memory address) to the object', isCode: false },
              { text: 'The class definition of the object', isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: 'Java passes a copy of the reference (the remote control), not the object. The object remains on the heap.'
          },
          {
            questionText: 'What is the output of this code? <br><code>public static void change(int[] arr) { arr[0] = 99; }</code><br><code>int[] nums = {1,2,3}; change(nums); System.out.println(nums[0]);</code>',
            options: [
              { text: '1', isCode: false },
              { text: '99', isCode: false },
              { text: 'Compilation error', isCode: false },
              { text: 'NullPointerException', isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: 'The reference to the array is passed by value, so arr and nums point to the same array. Modifying arr[0] changes the shared array. Output: 99.'
          },
          {
            questionText: 'Which statement correctly describes Java’s parameter passing?',
            options: [
              { text: 'Primitives are passed by reference, objects by value', isCode: false },
              { text: 'Both primitives and objects are passed by reference', isCode: false },
              { text: 'Both primitives and objects are passed by value', isCode: false },
              { text: 'Objects are passed by reference, primitives by value', isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: 'Everything in Java is passed by value. For objects, the value being passed is the reference.'
          },
          {
            questionText: 'Why can’t a swap method work in Java when using primitive parameters?',
            options: [
              { text: 'Because Java doesn’t support methods that return multiple values', isCode: false },
              { text: 'Because the method receives copies of the primitives, not the original variables', isCode: false },
              { text: 'Because primitives are immutable', isCode: false },
              { text: 'Because the JVM doesn’t allow reassignment of parameters', isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: 'The method receives copies, so swapping the copies does not affect the original variables. The originals remain unchanged.'
          },
          {
            questionText: 'Given: <code>public static void reassign(String s) { s = "world"; }</code> and <code>String str = "hello"; reassign(str);</code> What is <code>str</code>?',
            options: [
              { text: '"hello"', isCode: false },
              { text: '"world"', isCode: false },
              { text: 'null', isCode: false },
              { text: 'Compilation error', isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: 'The local copy <code>s</code> is reassigned to a new String object, but the original <code>str</code> reference is unaffected. <code>str</code> remains "hello". Additionally, Strings are immutable.'
          }
        ]
      }
    }
  ]
};