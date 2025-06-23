import { LessonData } from "./types";

export const allLessons: Record<string, LessonData> = {
  "1": {
    title: "JavaScript Basics",
    subtitle: "Lesson 1: Functions and Scope",
    steps: [
      {
        type: "concept",
        title: "What are Functions?",
        content:
          "Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.",
        example: `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("JavaScript"));`,
        explanation: "This function takes a name parameter and returns a greeting message.",
      },
      {
        type: "practice",
        title: "Create Your First Function",
        instruction: "Create a function called 'add' that takes two parameters and returns their sum.",
        starterCode: "// Write your function here\nfunction add(a, b) {\n  // Your code here\n}",
        solution: "function add(a, b) {\n  return a + b;\n}",
        hint: "Use the 'return' keyword to send back the result of a + b",
        test: {
          type: "function",
          call: "add(5, 8)",
          expected: 13,
        },
      },
      {
        type: "quiz",
        title: "Quick Check",
        question: "What keyword is used to send a value back from a function?",
        options: ["return", "send", "give", "output"],
        correct: 0,
      },
    ],
  },
  "2": {
    title: "DOM Manipulation",
    subtitle: "Lesson 1: Selecting Elements",
    steps: [
      {
        type: "concept",
        title: "What is the DOM?",
        content:
          "The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.",
        example: `// Accessing an element\nconst heading = document.getElementById('main-title');\n\n// Changing its content\nheading.textContent = 'Welcome to the DOM!';`,
        explanation: "This code selects an element with the ID 'main-title' and changes its text.",
      },
      {
        type: "practice",
        title: "Select and Modify",
        instruction: "Select the element with the ID 'title' and change its text content to 'Hello, DOM!'.",
        starterCode: "const element = document.getElementById('title');\n// Your code here",
        solution: "const element = document.getElementById('title');\nelement.textContent = 'Hello, DOM!';",
        hint: "Use the .textContent property to change the text inside an element.",
        test: {
          type: "dom",
          expected: "Hello, DOM!",
        },
      },
      {
        type: "quiz",
        title: "Quick Check",
        question: "Which method is used to select an element by its ID?",
        options: ["getElementByClass", "querySelector", "getElementById", "selectById"],
        correct: 2,
      },
    ],
  },
  "4": {
    title: "Async JavaScript",
    subtitle: "Lesson 1: Using Async/Await",
    steps: [
      {
        type: "concept",
        title: "Understanding Async/Await",
        content:
          "Async/await is modern syntax for handling asynchronous operations. It lets you write promise-based code as if it were synchronous, making it more readable and easier to manage.",
        example: `async function fetchData() {\n  const response = await fetch('https://api.example.com/data');\n  const data = await response.json();\n  console.log(data);\n}\n\nfetchData();`,
        explanation: "The 'await' keyword pauses the function execution until the Promise is resolved.",
      },
      {
        type: "practice",
        title: "Fetch Data with Async/Await",
        instruction: "Create an async function 'fetchUser' that fetches data from 'https://api.fakedata.com/users/1' and logs the user's name.",
        starterCode: "async function fetchUser() {\n  // Your code here\n}\n\nfetchUser();",
        solution: "async function fetchUser() {\n  const response = await fetch('https://api.fakedata.com/users/1');\n  const user = await response.json();\n  console.log(user.name);\n}",
        hint: "Use 'await' for both the fetch call and the .json() call.",
        test: {
          type: "async",
          url: "https://api.fakedata.com/users/1",
          mockResponse: { name: "Codey" },
          expectedLog: "Codey",
        },
      },
      {
        type: "quiz",
        title: "Quick Check",
        question: "What does the 'await' keyword do in an async function?",
        options: [
          "It executes the function immediately.",
          "It pauses the function until a Promise is settled.",
          "It converts a function to be synchronous.",
          "It automatically catches errors.",
        ],
        correct: 1,
      },
    ],
  },
}; 